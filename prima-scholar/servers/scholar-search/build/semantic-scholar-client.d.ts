/**
 * Semantic Scholar Graph API client.
 *
 * Queries the Semantic Scholar academic graph for papers, citations,
 * and references. Optional API key via SEMANTIC_SCHOLAR_KEY env var.
 */
import { Paper, SearchOptions, ScholarClient } from "./types.js";
export declare class SemanticScholarClient implements ScholarClient {
    private rateLimiter;
    private apiKey;
    constructor();
    private getHeaders;
    /**
     * Search for papers matching the query.
     */
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    /**
     * Get a single paper by ID.
     * ID can be a Semantic Scholar ID, DOI:xxx, ARXIV:xxx, or PMID:xxx.
     */
    getPaper(id: string): Promise<Paper>;
    /**
     * Get papers that cite the given paper.
     */
    getCitations(paperId: string, options?: SearchOptions): Promise<Paper[]>;
    /**
     * Get papers referenced by the given paper.
     */
    getReferences(paperId: string, options?: SearchOptions): Promise<Paper[]>;
    private mapToPaper;
}
