/**
 * CORE API client.
 *
 * Queries the CORE API for open-access scholarly content.
 * Requires a free API key via CORE_API_KEY env var.
 * Register at: https://core.ac.uk/services/api
 *
 * API docs: https://api.core.ac.uk/docs/v3
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class CoreClient implements ScholarClient {
    private rateLimiter;
    private apiKey;
    constructor();
    isConfigured(): boolean;
    private getHeaders;
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    getPaper(id: string): Promise<Paper>;
    getFullText(id: string): Promise<string | null>;
    private mapToPaper;
}
