/**
 * ERIC (Education Resources Information Center) API client.
 *
 * Queries the ERIC API for education research literature.
 * No authentication required.
 *
 * API docs: https://eric.ed.gov/api
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class EricClient implements ScholarClient {
    private rateLimiter;
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    getPaper(id: string): Promise<Paper>;
    private mapToPaper;
}
