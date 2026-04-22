/**
 * OpenAlex API client.
 *
 * Queries the OpenAlex REST API for scholarly works across all disciplines.
 * No authentication required. Set OPENALEX_MAILTO env var for the polite pool
 * (higher rate limits and priority).
 *
 * API docs: https://docs.openalex.org/
 */
import { RateLimiter } from "./rate-limiter.js";
import { formatAllCitations } from "./utils.js";
const BASE_URL = "https://api.openalex.org";
export class OpenAlexClient {
    rateLimiter = new RateLimiter(10, 1000);
    mailto;
    constructor() {
        this.mailto = process.env.OPENALEX_MAILTO ?? process.env.CROSSREF_MAILTO;
    }
    buildUrl(path, params) {
        if (this.mailto) {
            params.set("mailto", this.mailto);
        }
        return `${BASE_URL}${path}?${params}`;
    }
    async search(query, options) {
        const maxResults = options?.maxResults ?? 10;
        await this.rateLimiter.acquire();
        const params = new URLSearchParams({
            search: query,
            per_page: String(maxResults),
            sort: "cited_by_count:desc",
        });
        // Year filter
        if (options?.yearFrom || options?.yearTo) {
            const from = options?.yearFrom ?? 1900;
            const to = options?.yearTo ?? new Date().getFullYear();
            params.set("filter", `publication_year:${from}-${to}`);
        }
        // OA filter
        if (options?.openAccessOnly) {
            const existing = params.get("filter");
            const oaFilter = "is_oa:true";
            params.set("filter", existing ? `${existing},${oaFilter}` : oaFilter);
        }
        const url = this.buildUrl("/works", params);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OpenAlex search failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return (data.results ?? []).map((work) => this.mapToPaper(work));
    }
    async getPaper(id) {
        await this.rateLimiter.acquire();
        // Accept OpenAlex ID, DOI, or other external IDs
        let path;
        if (id.startsWith("W") || id.startsWith("https://openalex.org/")) {
            path = `/works/${id.replace("https://openalex.org/", "")}`;
        }
        else if (id.includes("10.")) {
            path = `/works/doi:${id}`;
        }
        else {
            path = `/works/${id}`;
        }
        const params = new URLSearchParams();
        const url = this.buildUrl(path, params);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OpenAlex get paper failed: ${response.status} ${response.statusText}`);
        }
        const work = (await response.json());
        return this.mapToPaper(work);
    }
    mapToPaper(work) {
        const authors = (work.authorships ?? []).map((a) => ({
            name: a.author?.display_name ?? "Unknown",
            affiliations: a.institutions?.map((i) => i.display_name).filter(Boolean),
        }));
        const doi = work.doi?.replace("https://doi.org/", "") ?? undefined;
        const paper = {
            title: work.title ?? "Untitled",
            authors,
            abstract: reconstructAbstract(work.abstract_inverted_index) ?? "",
            year: work.publication_year ?? 0,
            journal: work.primary_location?.source?.display_name ?? undefined,
            volume: work.biblio?.volume ?? undefined,
            issue: work.biblio?.issue ?? undefined,
            pages: work.biblio?.first_page
                ? work.biblio.last_page
                    ? `${work.biblio.first_page}-${work.biblio.last_page}`
                    : work.biblio.first_page
                : undefined,
            publisher: work.primary_location?.source?.host_organization_name ?? undefined,
            doi,
            url: work.primary_location?.landing_page_url ?? work.id ?? "",
            source: "openalex",
            sourceId: work.id ?? "",
            citationCount: work.cited_by_count ?? undefined,
            keywords: work.keywords?.map((k) => k.keyword ?? k.display_name).filter(Boolean),
            openAccess: work.open_access?.is_oa ?? false,
            openAccessUrl: work.open_access?.oa_url ?? undefined,
            fullTextAvailable: !!(work.open_access?.oa_url),
        };
        return { ...paper, citations: formatAllCitations(paper) };
    }
}
/**
 * OpenAlex stores abstracts as inverted indexes.
 * Reconstruct the abstract text from the inverted index.
 */
function reconstructAbstract(invertedIndex) {
    if (!invertedIndex)
        return null;
    const words = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
        for (const pos of positions) {
            words.push([pos, word]);
        }
    }
    words.sort((a, b) => a[0] - b[0]);
    return words.map(([, word]) => word).join(" ");
}
//# sourceMappingURL=openalex-client.js.map