/**
 * Europe PMC API client.
 *
 * Queries the Europe PMC REST API for biomedical and life sciences literature.
 * No authentication required. Broader coverage than PubMed — includes
 * European research council content, preprints, and patents.
 *
 * API docs: https://europepmc.org/RestfulWebService
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class EuropePmcClient implements ScholarClient {
    private rateLimiter;
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    getPaper(id: string): Promise<Paper>;
    private mapToPaper;
}
