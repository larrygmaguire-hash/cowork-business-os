/**
 * CrossRef API client.
 *
 * Queries the CrossRef REST API for scholarly metadata.
 * No authentication required. Set CROSSREF_MAILTO env var to enter
 * the polite pool for higher rate limits.
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class CrossRefClient implements ScholarClient {
    private rateLimiter;
    private mailto;
    constructor();
    private getHeaders;
    /**
     * Search CrossRef for works matching the query.
     */
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    /**
     * Get a single paper by DOI.
     */
    getPaper(id: string): Promise<Paper>;
    /**
     * Resolve a single DOI to its metadata.
     */
    resolveDoi(doi: string): Promise<Paper>;
    private mapToPaper;
    private extractYear;
}
