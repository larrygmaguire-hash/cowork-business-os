import { readdir, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { EXTRACTS_DIR } from './config.js';
/**
 * Determine if a session is substantial enough to warrant auto-extraction.
 * A session qualifies if ANY of these are true:
 * - 50+ messages
 * - 10+ files changed
 * - Duration > 30 minutes
 */
export function isSubstantialSession(session) {
    if (session.messageCount >= 50)
        return true;
    if (session.filesChanged.length >= 10)
        return true;
    if (session.endTime) {
        const durationMs = session.endTime.getTime() - session.startTime.getTime();
        const durationMins = durationMs / 60000;
        if (durationMins >= 30)
            return true;
    }
    return false;
}
/**
 * Derive a project ID from the session's working directory.
 * Tries to match against known project ID patterns (P001, P002, etc.).
 * Falls back to the last path segment in kebab-case.
 */
function getProjectId(cwd) {
    if (!cwd)
        return 'general';
    // Extract last meaningful segment
    const segments = cwd.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'general';
    // Convert to kebab-case
    return lastSegment
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase() || 'general';
}
/**
 * Check if an extract/checkpoint already exists for this session.
 * Matches by session ID prefix or by date+time.
 */
async function extractAlreadyExists(session, outputDir) {
    try {
        const entries = await readdir(outputDir);
        const sessionIdPrefix = session.id.slice(0, 8);
        // Format the session start time as YYYY-MM-DD-HHMM
        const d = session.startTime;
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        for (const entry of entries) {
            // Match by session ID prefix in filename
            if (entry.includes(sessionIdPrefix))
                return true;
            // Match by date and extract/checkpoint suffix
            if (entry.startsWith(dateStr) &&
                (entry.includes('session-extract') || entry.includes('session-checkpoint'))) {
                return true;
            }
        }
        return false;
    }
    catch {
        // Directory doesn't exist yet — no extracts exist
        return false;
    }
}
/**
 * Generate the markdown extract content from a session.
 */
function generateExtract(session) {
    const duration = session.endTime
        ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
        : null;
    const tagsStr = session.tags && session.tags.length > 0
        ? session.tags.join(', ')
        : 'none';
    // Build files changed table
    let filesTable = '';
    if (session.filesChanged.length > 0) {
        const rows = session.filesChanged.map(f => {
            const fileName = f.filePath.split('/').pop() || f.filePath;
            const explanation = f.explanation || 'No explanation recorded';
            return `| ${fileName} | ${f.changeType} | ${explanation} |`;
        });
        filesTable = `| File | Action | Explanation |
|------|--------|-------------|
${rows.join('\n')}`;
    }
    else {
        filesTable = 'No files changed.';
    }
    // Get last 5 substantive assistant messages (>200 chars), most recent first
    const substantiveMessages = session.messages
        .filter(m => m.role === 'assistant' && m.text && m.text.length > 200)
        .slice(-5)
        .reverse();
    let conclusionsSection = '';
    if (substantiveMessages.length > 0) {
        conclusionsSection = substantiveMessages
            .map((m, i) => {
            const time = m.timestamp.toLocaleTimeString();
            return `### ${i + 1}. (${time})\n\n${m.text}`;
        })
            .join('\n\n---\n\n');
    }
    else {
        conclusionsSection = 'No substantive assistant messages found.';
    }
    // Get last 10 exchange pairs (user + assistant), full text
    const exchanges = [];
    let currentUser = null;
    let currentTimestamp = session.startTime;
    for (const msg of session.messages) {
        if (msg.role === 'user' && msg.text) {
            currentUser = msg.text;
            currentTimestamp = msg.timestamp;
        }
        else if (msg.role === 'assistant' && msg.text && currentUser) {
            exchanges.push({
                user: currentUser,
                assistant: msg.text,
                timestamp: currentTimestamp,
            });
            currentUser = null;
        }
    }
    const lastExchanges = exchanges.slice(-10);
    let exchangesSection = '';
    if (lastExchanges.length > 0) {
        exchangesSection = lastExchanges
            .map((ex, i) => {
            const time = ex.timestamp.toLocaleTimeString();
            return `### Exchange ${i + 1} (${time})\n\n**User:**\n${ex.user}\n\n**Assistant:**\n${ex.assistant}`;
        })
            .join('\n\n---\n\n');
    }
    else {
        exchangesSection = 'No exchanges captured.';
    }
    return `# Session Extract

**Session:** ${session.id}
**Date:** ${session.startTime.toLocaleString()}
**Duration:** ${duration ? `${duration} minutes` : 'unknown'}
**Project:** ${session.cwd || 'unknown'}
**Branch:** ${session.gitBranch || 'unknown'}
**Messages:** ${session.messageCount}
**Files changed:** ${session.filesChanged.length}
**Tags:** ${tagsStr}

## Summary

${session.summary}

## Files Changed

${filesTable}

## Key Conclusions

Last ${substantiveMessages.length} substantive assistant messages (most recent first):

${conclusionsSection}

## Final Exchanges

Last ${lastExchanges.length} user-assistant exchange pairs:

${exchangesSection}
`;
}
/**
 * Write a session extract to disk if the session qualifies and no extract exists yet.
 * Non-fatal — errors are logged but do not interrupt the caller.
 */
export async function writeExtract(session) {
    // Check if session qualifies
    if (!isSubstantialSession(session)) {
        return {
            filePath: '',
            sessionId: session.id,
            skipped: true,
            reason: 'Session does not meet substantial threshold',
        };
    }
    const projectId = getProjectId(session.cwd);
    const outputDir = join(EXTRACTS_DIR, projectId);
    // Check for existing extract
    if (await extractAlreadyExists(session, outputDir)) {
        return {
            filePath: '',
            sessionId: session.id,
            skipped: true,
            reason: 'Extract or checkpoint already exists for this session',
        };
    }
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });
    // Generate filename
    const d = session.startTime;
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const fileName = `${dateStr}-${timeStr}-session-extract.md`;
    const filePath = join(outputDir, fileName);
    // Generate and write extract
    const content = generateExtract(session);
    await writeFile(filePath, content, 'utf-8');
    console.error(`Auto-extracted session ${session.id} → ${filePath}`);
    return {
        filePath,
        sessionId: session.id,
        skipped: false,
    };
}
