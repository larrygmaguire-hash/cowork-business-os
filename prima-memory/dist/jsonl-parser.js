import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { PROJECTS_DIR, WORKSPACE_PROJECT_DIR, EXTRACTS_DIR } from './config.js';
// In-memory cache for parsed sessions
const sessionCache = new Map();
/**
 * Extract a session title from the first user message.
 * Cleans up the text and truncates to a reasonable length.
 */
function extractTitleFromMessage(text) {
    // Remove XML-style tags and their content
    let cleaned = text
        .replace(/<ide_selection>[\s\S]*?<\/ide_selection>/g, '')
        .replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g, '')
        .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
        .replace(/<command-message>[\s\S]*?<\/command-message>/g, '')
        .replace(/<command-name>[\s\S]*?<\/command-name>/g, '')
        .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '') // Catch any remaining paired tags
        .trim();
    // Take first line or first sentence
    const firstLine = cleaned.split('\n')[0].trim();
    const firstSentence = firstLine.split(/[.!?]/)[0].trim();
    // Use whichever is shorter but meaningful
    let title = firstSentence.length > 0 && firstSentence.length <= 80
        ? firstSentence
        : firstLine.slice(0, 80);
    // Clean up and truncate
    title = title
        .replace(/^(can you |please |help me |i want to |i need to )/i, '')
        .trim();
    // Capitalise first letter
    if (title.length > 0) {
        title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    // Add ellipsis if truncated
    if (title.length >= 80) {
        title = title.slice(0, 77) + '...';
    }
    return title || '';
}
/**
 * Extract tags from session content (language, task type, key files)
 */
function extractTags(session) {
    const tags = [];
    // Detect languages/frameworks from file extensions
    const extensions = new Set();
    for (const file of session.filesChanged) {
        const ext = file.filePath.split('.').pop()?.toLowerCase();
        if (ext)
            extensions.add(ext);
    }
    const langMap = {
        'ts': 'typescript', 'tsx': 'typescript', 'js': 'javascript', 'jsx': 'javascript',
        'py': 'python', 'rs': 'rust', 'go': 'go', 'rb': 'ruby', 'java': 'java',
        'swift': 'swift', 'kt': 'kotlin', 'cs': 'csharp', 'cpp': 'cpp', 'c': 'c'
    };
    for (const ext of extensions) {
        if (langMap[ext])
            tags.push(langMap[ext]);
    }
    // Detect task type from summary/messages
    const allText = (session.summary + ' ' + session.messages.map(m => m.text || '').join(' ')).toLowerCase();
    if (allText.includes('fix') || allText.includes('bug') || allText.includes('error'))
        tags.push('bugfix');
    if (allText.includes('refactor'))
        tags.push('refactor');
    if (allText.includes('test'))
        tags.push('testing');
    if (allText.includes('feature') || allText.includes('add') || allText.includes('implement'))
        tags.push('feature');
    return [...new Set(tags)]; // Deduplicate
}
export async function getProjectDirs() {
    try {
        const entries = await readdir(PROJECTS_DIR, { withFileTypes: true });
        const allDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
        // Only return directories matching this workspace
        const matching = allDirs.filter(d => d === WORKSPACE_PROJECT_DIR || d.endsWith(WORKSPACE_PROJECT_DIR));
        if (matching.length === 0) {
            console.error(`[prima-memory] WARNING: No session directory found for workspace "${WORKSPACE_PROJECT_DIR}". Searched ${allDirs.length} directories in ${PROJECTS_DIR}. Sessions will be empty until Claude Code creates sessions for this workspace.`);
        }
        return matching;
    }
    catch {
        return [];
    }
}
export async function findProjectDir(projectPath) {
    const dirs = await getProjectDirs();
    // Project dirs are encoded as path with / and spaces replaced by -
    const encoded = projectPath.replace(/[\s\/]/g, '-');
    const match = dirs.find(d => d === encoded || d.includes(encoded.split('-').slice(-2).join('-')));
    return match || null;
}
export async function getSessionFiles(projectDir) {
    const fullPath = join(PROJECTS_DIR, projectDir);
    try {
        const entries = await readdir(fullPath);
        return entries.filter(e => e.endsWith('.jsonl')).map(e => join(fullPath, e));
    }
    catch {
        return [];
    }
}
/**
 * Check if cached session is still valid (file hasn't been modified)
 */
async function isCacheValid(filePath) {
    const cached = sessionCache.get(filePath);
    if (!cached)
        return false;
    try {
        const fileStat = await stat(filePath);
        return fileStat.mtimeMs === cached.mtime;
    }
    catch {
        return false;
    }
}
export async function parseSessionFile(filePath) {
    // Check cache first
    if (await isCacheValid(filePath)) {
        return sessionCache.get(filePath).session;
    }
    try {
        const content = await readFile(filePath, 'utf-8');
        const fileStat = await stat(filePath);
        const lines = content.trim().split('\n').filter(Boolean);
        if (lines.length === 0)
            return null;
        let summary = '';
        let sessionId = '';
        let cwd = '';
        let gitBranch = '';
        let startTime = null;
        let endTime = null;
        const messages = [];
        const filesChanged = [];
        let lastExplanation = '';
        let firstUserMessage = '';
        for (const line of lines) {
            try {
                const record = JSON.parse(line);
                // Extract summary
                if (record.type === 'summary' && record.summary) {
                    summary = record.summary;
                }
                // Extract session metadata from first message with it
                if (record.sessionId && !sessionId) {
                    sessionId = record.sessionId;
                }
                if (record.cwd && !cwd) {
                    cwd = record.cwd;
                }
                if (record.gitBranch && !gitBranch) {
                    gitBranch = record.gitBranch;
                }
                // Track timestamps
                if (record.timestamp) {
                    const ts = new Date(record.timestamp);
                    if (!startTime || ts < startTime)
                        startTime = ts;
                    if (!endTime || ts > endTime)
                        endTime = ts;
                }
                // Parse messages
                if (record.message) {
                    const msg = record.message;
                    const timestamp = record.timestamp ? new Date(record.timestamp) : new Date();
                    const parsedMsg = {
                        uuid: record.uuid || '',
                        timestamp,
                        role: msg.role,
                    };
                    // Extract text and tool calls from content
                    if (Array.isArray(msg.content)) {
                        const textParts = [];
                        const toolCalls = [];
                        for (const block of msg.content) {
                            if (block.type === 'text' && block.text) {
                                textParts.push(block.text);
                                // Track explanation for file changes
                                if (msg.role === 'assistant') {
                                    lastExplanation = block.text;
                                }
                            }
                            if (block.type === 'tool_use' && block.name) {
                                toolCalls.push({
                                    name: block.name,
                                    input: block.input || {}
                                });
                                // Track file changes
                                if (['Write', 'Edit'].includes(block.name) && block.input?.file_path) {
                                    filesChanged.push({
                                        filePath: block.input.file_path,
                                        changeType: block.name.toLowerCase(),
                                        timestamp,
                                        explanation: lastExplanation.slice(0, 2000),
                                        sessionId
                                    });
                                }
                            }
                        }
                        if (textParts.length > 0) {
                            parsedMsg.text = textParts.join('\n');
                        }
                        if (toolCalls.length > 0) {
                            parsedMsg.toolCalls = toolCalls;
                        }
                    }
                    else if (typeof msg.content === 'string') {
                        parsedMsg.text = msg.content;
                    }
                    // Capture first user message for fallback title
                    if (msg.role === 'user' && !firstUserMessage && parsedMsg.text) {
                        firstUserMessage = parsedMsg.text;
                    }
                    messages.push(parsedMsg);
                }
            }
            catch {
                // Skip malformed lines
                continue;
            }
        }
        if (!sessionId) {
            // Use filename as session ID fallback
            sessionId = filePath.split('/').pop()?.replace('.jsonl', '') || 'unknown';
        }
        // Generate fallback title from first user message if no summary exists
        const fallbackTitle = firstUserMessage ? extractTitleFromMessage(firstUserMessage) : '';
        const session = {
            id: sessionId,
            filePath,
            summary: summary || fallbackTitle || 'Untitled Session',
            startTime: startTime || new Date(),
            endTime: endTime || undefined,
            cwd,
            gitBranch,
            messageCount: messages.length,
            filesChanged,
            messages
        };
        // Extract and attach tags
        session.tags = extractTags(session);
        // Update cache
        sessionCache.set(filePath, {
            session,
            mtime: fileStat.mtimeMs
        });
        return session;
    }
    catch {
        return null;
    }
}
export async function getAllSessions(projectDir) {
    const sessions = [];
    let dirs;
    if (projectDir) {
        const found = await findProjectDir(projectDir);
        dirs = found ? [found] : [];
    }
    else {
        dirs = await getProjectDirs();
    }
    for (const dir of dirs) {
        const files = await getSessionFiles(dir);
        for (const file of files) {
            const session = await parseSessionFile(file);
            if (session) {
                sessions.push(session);
            }
        }
    }
    // Sort by start time, most recent first
    sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    // Filter out empty sessions (no messages and no file changes)
    return sessions.filter(s => s.messageCount > 0 || s.filesChanged.length > 0);
}
/**
 * Get recent sessions by stat()-ing files first and only parsing the top N.
 * Avoids reading all 495+ JSONL files when only the most recent are needed.
 */
export async function getRecentSessionsFast(limit = 5, projectDir) {
    let dirs;
    if (projectDir) {
        const found = await findProjectDir(projectDir);
        dirs = found ? [found] : [];
    }
    else {
        dirs = await getProjectDirs();
    }
    // Collect all file paths
    const allFiles = [];
    for (const dir of dirs) {
        const files = await getSessionFiles(dir);
        allFiles.push(...files);
    }
    // stat() all files to get mtime (fast — no file content read)
    const fileStats = await Promise.all(allFiles.map(async (filePath) => {
        try {
            const fileStat = await stat(filePath);
            return { filePath, mtime: fileStat.mtimeMs };
        }
        catch {
            return null;
        }
    }));
    // Sort by mtime descending and take more than needed to account for empty sessions
    const sorted = fileStats
        .filter((s) => s !== null)
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, limit * 3); // Parse 3x the limit to handle empty sessions being filtered out
    // Parse only the top candidates
    const sessions = [];
    for (const { filePath } of sorted) {
        const session = await parseSessionFile(filePath);
        if (session && (session.messageCount > 0 || session.filesChanged.length > 0)) {
            sessions.push(session);
            if (sessions.length >= limit)
                break;
        }
    }
    // Sort by actual startTime (mtime may differ slightly from parsed startTime)
    sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    return sessions;
}
/**
 * Get a specific session by ID — direct file lookup, no full scan.
 * Session IDs are JSONL filenames, so we construct the path directly.
 */
export async function getSessionById(sessionId, projectDir) {
    let dirs;
    if (projectDir) {
        const found = await findProjectDir(projectDir);
        dirs = found ? [found] : [];
    }
    else {
        dirs = await getProjectDirs();
    }
    // Try direct file lookup first (session ID = filename without .jsonl)
    for (const dir of dirs) {
        const filePath = join(PROJECTS_DIR, dir, `${sessionId}.jsonl`);
        try {
            await stat(filePath);
            return await parseSessionFile(filePath);
        }
        catch {
            // File doesn't exist in this dir, try next
            continue;
        }
    }
    return null;
}
/**
 * Calculate relevance score for a session based on query
 */
function calculateScore(session, query, queryTerms) {
    let score = 0;
    const queryLower = query.toLowerCase();
    // Title/summary match: +20 points
    if (session.summary.toLowerCase().includes(queryLower)) {
        score += 20;
    }
    // File path match: +10 points per file
    for (const file of session.filesChanged) {
        if (file.filePath.toLowerCase().includes(queryLower)) {
            score += 10;
        }
    }
    // Message content match: +2 points per match
    for (const msg of session.messages) {
        if (!msg.text)
            continue;
        const textLower = msg.text.toLowerCase();
        for (const term of queryTerms) {
            if (textLower.includes(term)) {
                score += 2;
            }
        }
    }
    // Recency bonus: up to +10 points for sessions in the last 7 days
    const ageInDays = (Date.now() - session.startTime.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays < 7) {
        score += Math.round(10 * (1 - ageInDays / 7));
    }
    // Activity bonus: +1 point per file changed (max 5)
    score += Math.min(session.filesChanged.length, 5);
    return score;
}
export function searchSessions(sessions, query, timeFilter) {
    let filtered = sessions;
    // Apply time filter
    if (timeFilter) {
        const now = new Date();
        let cutoff;
        let endCutoff = null;
        if (timeFilter === 'today') {
            cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        else if (timeFilter === 'yesterday') {
            cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        else if (timeFilter === 'this week') {
            const dayOfWeek = now.getDay();
            cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        }
        else if (timeFilter === 'last week') {
            const dayOfWeek = now.getDay();
            cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek - 7);
            endCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        }
        else if (timeFilter.match(/(\d+)\s*days?\s*ago/)) {
            const days = parseInt(timeFilter.match(/(\d+)/)?.[1] || '0');
            cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        }
        else if (timeFilter.match(/(\d+)\s*weeks?\s*ago/)) {
            const weeks = parseInt(timeFilter.match(/(\d+)/)?.[1] || '0');
            cutoff = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
        }
        else if (timeFilter === 'this month') {
            cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        else if (timeFilter === 'last month') {
            cutoff = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endCutoff = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        else {
            cutoff = new Date(0); // No filter
        }
        if (endCutoff) {
            filtered = filtered.filter(s => s.startTime >= cutoff && s.startTime < endCutoff);
        }
        else {
            filtered = filtered.filter(s => s.startTime >= cutoff);
        }
    }
    // Apply text search with scoring
    const queryLower = query?.toLowerCase() || '';
    const queryTerms = queryLower.split(/\s+/).filter(Boolean);
    if (query) {
        filtered = filtered.filter(session => {
            // Search in summary
            if (session.summary.toLowerCase().includes(queryLower))
                return true;
            // Search in file paths
            if (session.filesChanged.some(f => f.filePath.toLowerCase().includes(queryLower)))
                return true;
            // Search in messages - require ALL terms to match (AND logic)
            const allMessageText = session.messages.map(m => m.text || '').join(' ').toLowerCase();
            return queryTerms.every(term => allMessageText.includes(term));
        });
    }
    // Calculate scores and sort by relevance
    const scored = filtered.map(session => ({
        ...session,
        score: query ? calculateScore(session, query, queryTerms) : 0
    }));
    // Sort by score (if query provided) then by date
    scored.sort((a, b) => {
        if (query && a.score !== b.score) {
            return b.score - a.score; // Higher score first
        }
        return b.startTime.getTime() - a.startTime.getTime(); // More recent first
    });
    return scored;
}
export function getFileHistory(sessions, filePath) {
    const changes = [];
    for (const session of sessions) {
        for (const change of session.filesChanged) {
            if (change.filePath.toLowerCase().includes(filePath.toLowerCase())) {
                changes.push({
                    ...change,
                    sessionId: session.id
                });
            }
        }
    }
    // Sort by timestamp, most recent first
    changes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return changes;
}
/**
 * Generate a summary of activity over a time period
 */
export async function summarisePeriod(startDate, endDate, projectDir) {
    const allSessions = await getAllSessions(projectDir);
    const sessionsInPeriod = allSessions.filter(s => s.startTime >= startDate && s.startTime <= endDate);
    const filesChanged = new Set();
    const projects = new Set();
    const summaries = [];
    let totalMessages = 0;
    for (const session of sessionsInPeriod) {
        totalMessages += session.messageCount;
        if (session.cwd) {
            projects.add(session.cwd);
        }
        for (const file of session.filesChanged) {
            filesChanged.add(file.filePath);
        }
        if (session.summary && session.summary !== 'Untitled Session') {
            summaries.push(session.summary);
        }
    }
    // Extract common topics from summaries
    const wordFreq = new Map();
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their']);
    for (const summary of summaries) {
        const words = summary.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stopWords.has(w));
        for (const word of words) {
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
        }
    }
    const topTopics = [...wordFreq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
    return {
        startDate,
        endDate,
        totalSessions: sessionsInPeriod.length,
        totalMessages,
        filesChanged: [...filesChanged],
        projectsWorkedOn: [...projects],
        topTopics,
        sessionSummaries: summaries.slice(0, 20) // Limit to 20 most recent
    };
}
/**
 * Parse time period string into start/end dates
 */
export function parsePeriod(period) {
    const now = new Date();
    let startDate;
    let endDate = now;
    switch (period.toLowerCase()) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'yesterday':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'this week':
            const dayOfWeek = now.getDay();
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
            break;
        case 'last week':
            const dow = now.getDay();
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow - 7);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow);
            break;
        case 'this month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'last month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        default:
            // Default to last 7 days
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    return { startDate, endDate };
}
/**
 * Find checkpoint files for a session based on project and date.
 * Looks for YYYY-MM-DD-session-checkpoint.md in .prima-memory/extracts/[projectId]/
 * Returns the file path and a preview of the latest checkpoint section.
 */
export async function findCheckpointForSession(cwd, sessionDate) {
    // Derive project ID from cwd (last path segment, kebab-case)
    const projectId = cwd.split('/').filter(Boolean).pop()?.replace(/\s+/g, '-').toLowerCase();
    if (!projectId)
        return null;
    const dateStr = sessionDate.toISOString().slice(0, 10); // YYYY-MM-DD
    const checkpointFilename = `${dateStr}-session-checkpoint.md`;
    const checkpointPath = join(EXTRACTS_DIR, projectId, checkpointFilename);
    try {
        const content = await readFile(checkpointPath, 'utf-8');
        // Extract preview from the last checkpoint section
        // Find all ## Checkpoint HH:MM sections, take the last one's Summary
        const sections = content.split(/^## Checkpoint \d{2}:\d{2}/m);
        const lastSection = sections[sections.length - 1] || '';
        // Extract Summary subsection
        const summaryMatch = lastSection.match(/### Summary\s*\n([\s\S]*?)(?=\n###|\n---|\n## |$)/);
        const preview = summaryMatch
            ? summaryMatch[1].trim().slice(0, 300)
            : lastSection.trim().slice(0, 300);
        return { path: checkpointPath, preview };
    }
    catch {
        return null; // File doesn't exist
    }
}
/**
 * Search extract and agent output files in .prima-memory/extracts/
 * Lightweight on-demand search: reads markdown files, matches query against filename and content.
 * No database, no embeddings, no pre-indexing.
 */
export async function searchAgentOutputs(query, options) {
    const results = [];
    // Check if directory exists
    try {
        await stat(EXTRACTS_DIR);
    }
    catch {
        return results; // Directory doesn't exist yet — return empty
    }
    // Read project directories
    let projectDirs;
    try {
        const entries = await readdir(EXTRACTS_DIR, { withFileTypes: true });
        projectDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    }
    catch {
        return results;
    }
    // Filter by project ID if specified
    if (options?.projectId) {
        const pid = options.projectId.toUpperCase();
        projectDirs = projectDirs.filter(d => d.toUpperCase() === pid);
    }
    // Parse time filter into cutoff dates
    let timeCutoff = null;
    let timeEnd = null;
    if (options?.timeFilter) {
        const parsed = parsePeriod(options.timeFilter);
        timeCutoff = parsed.startDate;
        timeEnd = parsed.endDate;
    }
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(Boolean);
    for (const projectDir of projectDirs) {
        const projectPath = join(EXTRACTS_DIR, projectDir);
        let files;
        try {
            const entries = await readdir(projectPath);
            files = entries.filter(f => f.endsWith('.md'));
        }
        catch {
            continue;
        }
        for (const file of files) {
            // Parse filename: YYYY-MM-DD-HHMM-description.md
            const match = file.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})-(.+)\.md$/);
            if (!match)
                continue;
            const [, year, month, day, hour, minute, descriptionRaw] = match;
            const timestamp = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
            // Apply time filter
            if (timeCutoff && timestamp < timeCutoff)
                continue;
            if (timeEnd && timestamp > timeEnd)
                continue;
            const description = descriptionRaw.replace(/-/g, ' ');
            const filePath = join(projectPath, file);
            // Read file content for matching
            let content;
            try {
                content = await readFile(filePath, 'utf-8');
            }
            catch {
                continue;
            }
            // Calculate relevance score
            let score = 0;
            const contentLower = content.toLowerCase();
            const filenameLower = file.toLowerCase();
            // Filename match: +20 points
            if (filenameLower.includes(queryLower)) {
                score += 20;
            }
            // Description match: +15 points per term
            for (const term of queryTerms) {
                if (description.toLowerCase().includes(term)) {
                    score += 15;
                }
            }
            // Content match: +3 points per term found
            for (const term of queryTerms) {
                if (contentLower.includes(term)) {
                    score += 3;
                }
            }
            // Recency bonus: up to +5 points for outputs in the last 7 days
            const ageInDays = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
            if (ageInDays < 7) {
                score += Math.round(5 * (1 - ageInDays / 7));
            }
            // Skip if no relevance at all
            if (score === 0 && query)
                continue;
            // Extract preview (first 200 chars of content, skipping frontmatter)
            const contentLines = content.split('\n');
            const bodyStart = contentLines.findIndex((line, i) => i > 0 && line === '---');
            const bodyText = bodyStart > 0
                ? contentLines.slice(bodyStart + 1).join('\n').trim()
                : content.trim();
            const preview = bodyText.slice(0, 200).replace(/\n/g, ' ');
            results.push({
                filePath,
                projectId: projectDir,
                timestamp,
                description,
                preview,
                score,
            });
        }
    }
    // Sort by score (descending), then by timestamp (most recent first)
    results.sort((a, b) => {
        if (a.score !== b.score)
            return b.score - a.score;
        return b.timestamp.getTime() - a.timestamp.getTime();
    });
    return results;
}
