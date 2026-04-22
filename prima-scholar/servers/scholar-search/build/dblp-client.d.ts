/**
 * DBLP API client.
 *
 * Queries the DBLP computer science bibliography for publications.
 * No authentication required.
 *
 * API docs: https://dblp.org/faq/How+to+use+the+dblp+search+API.html
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class DblpClient implements ScholarClient {
    private rateLimiter;
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    getPaper(id: string): Promise<Paper>;
    private mapToPaper;
}
