import Database from 'better-sqlite3';
/**
 * Initialise and return the SQLite database with vector extension
 */
export declare function getDatabase(): Database.Database;
/**
 * Close the database connection
 */
export declare function closeDatabase(): void;
/**
 * Check if a file has been indexed and is up to date
 */
export declare function isFileIndexed(filePath: string, mtime: number): boolean;
/**
 * Update sync state for a file
 */
export declare function updateSyncState(filePath: string, mtime: number): void;
/**
 * Insert an exchange with its embedding
 */
export declare function insertExchange(id: string, sessionId: string, exchangeIndex: number, timestamp: string, userMessage: string | null, assistantMessage: string | null, projectPath: string | null, gitBranch: string | null, filePath: string, embedding: Float32Array): void;
/**
 * Search for similar exchanges using vector similarity
 */
export declare function searchSimilar(queryEmbedding: Float32Array, limit?: number, projectPath?: string): Array<{
    id: string;
    distance: number;
}>;
/**
 * Get exchange metadata by ID
 */
export declare function getExchangeById(id: string): {
    id: string;
    sessionId: string;
    exchangeIndex: number;
    timestamp: string;
    userMessage: string | null;
    assistantMessage: string | null;
    projectPath: string | null;
    gitBranch: string | null;
    filePath: string;
} | undefined;
/**
 * Clear all indexed data (for rebuild)
 */
export declare function clearIndex(): void;
/**
 * Get index statistics
 */
export declare function getIndexStats(): {
    totalExchanges: number;
    totalFiles: number;
};
