/**
 * PubMed E-utilities API client.
 *
 * Searches PubMed via esearch + efetch for biomedical literature.
 * Optional API key via PUBMED_API_KEY env var for higher rate limits.
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class PubMedClient implements ScholarClient {
    private rateLimiter;
    private apiKey;
    private xmlParser;
    constructor();
    private appendApiKey;
    /**
     * Search PubMed for articles matching the query.
     *
     * Two-step process: esearch to get PMIDs, then efetch to get full records.
     */
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    /**
     * Get a single paper by PMID.
     */
    getPaper(pmid: string): Promise<Paper>;
    private parseArticles;
    private mapToPaper;
    private parseAuthors;
    private parseAbstract;
    private parseYear;
    private parseDoi;
}
