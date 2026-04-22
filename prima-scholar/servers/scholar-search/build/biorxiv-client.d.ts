/**
 * bioRxiv / medRxiv API client.
 *
 * Queries the bioRxiv and medRxiv preprint servers via their shared API.
 * No authentication required.
 *
 * API docs: https://api.biorxiv.org/
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class BiorxivClient implements ScholarClient {
    private rateLimiter;
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    private searchServer;
    getPaper(id: string): Promise<Paper>;
    private mapToPaper;
}
