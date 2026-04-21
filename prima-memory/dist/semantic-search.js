import { createHash } from 'crypto';
import { stat } from 'fs/promises';
import { getDatabase, isFileIndexed, updateSyncState, insertExchange, searchSimilar, getExchangeById, clearIndex, getIndexStats, } from './database.js';
import { generateEmbedding, generateExchangeEmbedding } from './embeddings.js';
import { getAllSessions, getSessionById } from './jsonl-parser.js';
/**
 * Generate a unique ID for an exchange
 */
function generateExchangeId(sessionId, exchangeIndex) {
    const hash = createHash('sha256');
    hash.update(`${sessionId}:${exchangeIndex}`);
    return hash.digest('hex').slice(0, 16);
}
/**
 * Extract user-assistant exchange pairs from a session
 */
function extractExchanges(session, filePath) {
    const exchanges = [];
    let exchangeIndex = 0;
    let currentUserMessage = null;
    let currentTimestamp = session.startTime;
    for (const msg of session.messages) {
        if (msg.role === 'user' && msg.text) {
            currentUserMessage = msg.text;
            currentTimestamp = msg.timestamp;
        }
        else if (msg.role === 'assistant' && msg.text) {
            exchanges.push({
                id: generateExchangeId(session.id, exchangeIndex),
                sessionId: session.id,
                exchangeIndex,
                timestamp: currentTimestamp.toISOString(),
                userMessage: currentUserMessage,
                assistantMessage: msg.text,
                projectPath: session.cwd || null,
                gitBranch: session.gitBranch || null,
                filePath,
            });
            exchangeIndex++;
            currentUserMessage = null;
        }
    }
    return exchanges;
}
/**
 * Index a single session file
 */
async function indexSessionFile(filePath) {
    let indexed = 0;
    let errors = 0;
    try {
        const fileStat = await stat(filePath);
        const mtime = fileStat.mtimeMs;
        // Skip if already indexed and unchanged
        if (isFileIndexed(filePath, mtime)) {
            return { indexed: 0, errors: 0 };
        }
        // Parse the session
        const { parseSessionFile } = await import('./jsonl-parser.js');
        const session = await parseSessionFile(filePath);
        if (!session) {
            return { indexed: 0, errors: 0 };
        }
        // Extract and index exchanges
        const exchanges = extractExchanges(session, filePath);
        for (const exchange of exchanges) {
            try {
                const embedding = await generateExchangeEmbedding(exchange.userMessage, exchange.assistantMessage);
                insertExchange(exchange.id, exchange.sessionId, exchange.exchangeIndex, exchange.timestamp, exchange.userMessage, exchange.assistantMessage, exchange.projectPath, exchange.gitBranch, exchange.filePath, embedding);
                indexed++;
            }
            catch (err) {
                errors++;
                console.error(`Error indexing exchange ${exchange.id}:`, err);
            }
        }
        // Auto-extract if substantial (non-fatal)
        try {
            const { writeExtract } = await import('./session-extract.js');
            const extractResult = await writeExtract(session);
            if (!extractResult.skipped) {
                console.error(`Auto-extracted: ${extractResult.filePath}`);
            }
        }
        catch (err) {
            console.error('Auto-extract error (non-fatal):', err);
        }
        // Update sync state
        updateSyncState(filePath, mtime);
    }
    catch (err) {
        errors++;
        console.error(`Error processing file ${filePath}:`, err);
    }
    return { indexed, errors };
}
/**
 * Sync the index with all session files
 */
export async function syncIndex(projectPath) {
    const sessions = await getAllSessions(projectPath);
    let totalIndexed = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    // Deduplicate by file path (multiple sessions can share a file)
    const seen = new Set();
    for (const session of sessions) {
        if (seen.has(session.filePath))
            continue;
        seen.add(session.filePath);
        const result = await indexSessionFile(session.filePath);
        if (result.indexed > 0) {
            totalIndexed += result.indexed;
        }
        else if (result.errors === 0) {
            totalSkipped++;
        }
        totalErrors += result.errors;
    }
    return {
        indexed: totalIndexed,
        skipped: totalSkipped,
        errors: totalErrors,
    };
}
/**
 * Perform semantic search
 */
export async function semanticSearch(options) {
    const { query, limit = 10, projectPath, threshold = 0.3, } = options;
    // Ensure index is initialised
    getDatabase();
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);
    // Search for similar vectors
    const results = searchSimilar(queryEmbedding, limit * 2, projectPath);
    // Convert to SemanticSearchResult format
    const searchResults = [];
    for (const result of results) {
        const exchangeData = getExchangeById(result.id);
        if (!exchangeData)
            continue;
        // Convert distance to similarity (cosine distance to similarity)
        const similarity = 1 - result.distance;
        // Apply threshold
        if (similarity < threshold)
            continue;
        const exchange = {
            id: exchangeData.id,
            sessionId: exchangeData.sessionId,
            exchangeIndex: exchangeData.exchangeIndex,
            timestamp: new Date(exchangeData.timestamp),
            userMessage: exchangeData.userMessage,
            assistantMessage: exchangeData.assistantMessage,
            projectPath: exchangeData.projectPath,
            gitBranch: exchangeData.gitBranch,
            filePath: exchangeData.filePath,
        };
        searchResults.push({
            exchange,
            similarity,
            sessionId: exchangeData.sessionId,
        });
    }
    // Deduplicate by session (keep highest similarity per session)
    const sessionMap = new Map();
    for (const result of searchResults) {
        const existing = sessionMap.get(result.sessionId);
        if (!existing || result.similarity > existing.similarity) {
            sessionMap.set(result.sessionId, result);
        }
    }
    // Sort by similarity and limit
    return [...sessionMap.values()]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
}
/**
 * Convert semantic search results to ScoredSession format
 */
export async function semanticResultsToScoredSessions(results, projectPath) {
    const scoredSessions = [];
    for (const result of results) {
        const session = await getSessionById(result.sessionId, projectPath);
        if (!session)
            continue;
        scoredSessions.push({
            ...session,
            score: Math.round(result.similarity * 100), // Normalise to 0-100
        });
    }
    return scoredSessions;
}
/**
 * Merge keyword and semantic results
 */
export function mergeSearchResults(keywordResults, semanticResults) {
    const combined = new Map();
    // Normalise keyword scores (typically 0-50) to 0-100
    const maxKeywordScore = Math.max(...keywordResults.map(s => s.score), 1);
    for (const session of keywordResults) {
        const normalisedScore = (session.score / maxKeywordScore) * 100;
        combined.set(session.id, { ...session, score: normalisedScore });
    }
    // Merge semantic results
    for (const session of semanticResults) {
        const existing = combined.get(session.id);
        if (existing) {
            // Dual match bonus (20%)
            existing.score = Math.max(existing.score, session.score) * 1.2;
        }
        else {
            combined.set(session.id, session);
        }
    }
    // Sort by score descending
    return [...combined.values()].sort((a, b) => b.score - a.score);
}
/**
 * Rebuild the entire index
 */
export async function rebuildIndex(projectPath) {
    clearIndex();
    return syncIndex(projectPath);
}
/**
 * Get current index statistics
 */
export function getStats() {
    return getIndexStats();
}
