import type { SemanticSearchOptions, SemanticSearchResult, SyncResult, ScoredSession } from './types.js';
/**
 * Sync the index with all session files
 */
export declare function syncIndex(projectPath?: string): Promise<SyncResult>;
/**
 * Perform semantic search
 */
export declare function semanticSearch(options: SemanticSearchOptions): Promise<SemanticSearchResult[]>;
/**
 * Convert semantic search results to ScoredSession format
 */
export declare function semanticResultsToScoredSessions(results: SemanticSearchResult[], projectPath?: string): Promise<ScoredSession[]>;
/**
 * Merge keyword and semantic results
 */
export declare function mergeSearchResults(keywordResults: ScoredSession[], semanticResults: ScoredSession[]): ScoredSession[];
/**
 * Rebuild the entire index
 */
export declare function rebuildIndex(projectPath?: string): Promise<SyncResult>;
/**
 * Get current index statistics
 */
export declare function getStats(): {
    totalExchanges: number;
    totalFiles: number;
};
