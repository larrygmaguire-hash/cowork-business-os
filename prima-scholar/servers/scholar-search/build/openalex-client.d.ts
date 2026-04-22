/**
 * OpenAlex API client.
 *
 * Queries the OpenAlex REST API for scholarly works across all disciplines.
 * No authentication required. Set OPENALEX_MAILTO env var for the polite pool
 * (higher rate limits and priority).
 *
 * API docs: https://docs.openalex.org/
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class OpenAlexClient implements ScholarClient {
    private rateLimiter;
    private mailto;
    constructor();
    private buildUrl;
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    getPaper(id: string): Promise<Paper>;
    private mapToPaper;
}
