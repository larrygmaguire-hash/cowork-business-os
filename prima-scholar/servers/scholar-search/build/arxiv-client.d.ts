/**
 * arXiv API client.
 *
 * Queries the arXiv Atom feed API for preprint metadata.
 * No authentication required.
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class ArxivClient implements ScholarClient {
    private rateLimiter;
    private xmlParser;
    constructor();
    /**
     * Search arXiv for papers matching the query.
     */
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    /**
     * Get a single paper by arXiv ID.
     */
    getPaper(arxivId: string): Promise<Paper>;
    private parseEntries;
    private mapToPaper;
    private extractUrl;
    private extractArxivId;
    private extractDoi;
    private extractKeywords;
}
