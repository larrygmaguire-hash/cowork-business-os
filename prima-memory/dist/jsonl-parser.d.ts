import type { Session, ScoredSession, FileChange, PeriodSummary, AgentOutputResult } from './types.js';
export declare function getProjectDirs(): Promise<string[]>;
export declare function findProjectDir(projectPath: string): Promise<string | null>;
export declare function getSessionFiles(projectDir: string): Promise<string[]>;
export declare function parseSessionFile(filePath: string): Promise<Session | null>;
export declare function getAllSessions(projectDir?: string): Promise<Session[]>;
/**
 * Get recent sessions by stat()-ing files first and only parsing the top N.
 * Avoids reading all 495+ JSONL files when only the most recent are needed.
 */
export declare function getRecentSessionsFast(limit?: number, projectDir?: string): Promise<Session[]>;
/**
 * Get a specific session by ID — direct file lookup, no full scan.
 * Session IDs are JSONL filenames, so we construct the path directly.
 */
export declare function getSessionById(sessionId: string, projectDir?: string): Promise<Session | null>;
export declare function searchSessions(sessions: Session[], query: string, timeFilter?: string): ScoredSession[];
export declare function getFileHistory(sessions: Session[], filePath: string): FileChange[];
/**
 * Generate a summary of activity over a time period
 */
export declare function summarisePeriod(startDate: Date, endDate: Date, projectDir?: string): Promise<PeriodSummary>;
/**
 * Parse time period string into start/end dates
 */
export declare function parsePeriod(period: string): {
    startDate: Date;
    endDate: Date;
};
/**
 * Find checkpoint files for a session based on project and date.
 * Looks for YYYY-MM-DD-session-checkpoint.md in .prima-memory/extracts/[projectId]/
 * Returns the file path and a preview of the latest checkpoint section.
 */
export declare function findCheckpointForSession(cwd: string, sessionDate: Date): Promise<{
    path: string;
    preview: string;
} | null>;
/**
 * Search extract and agent output files in .prima-memory/extracts/
 * Lightweight on-demand search: reads markdown files, matches query against filename and content.
 * No database, no embeddings, no pre-indexing.
 */
export declare function searchAgentOutputs(query: string, options?: {
    projectId?: string;
    timeFilter?: string;
}): Promise<AgentOutputResult[]>;
