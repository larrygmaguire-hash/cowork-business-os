/**
 * ERIC (Education Resources Information Center) API client.
 *
 * Queries the ERIC API for education research literature.
 * No authentication required.
 *
 * API docs: https://eric.ed.gov/api
 */
import { RateLimiter } from "./rate-limiter.js";
import { formatAllCitations } from "./utils.js";
const BASE_URL = "https://api.ies.ed.gov/eric/";
export class EricClient {
    rateLimiter = new RateLimiter(10, 1000);
    async search(query, options) {
        const maxResults = options?.maxResults ?? 10;
        await this.rateLimiter.acquire();
        const params = new URLSearchParams({
            search: `title:"${query}" OR description:"${query}"`,
            rows: String(maxResults),
            format: "json",
        });
        // Year filter
        if (options?.yearFrom || options?.yearTo) {
            const from = options?.yearFrom ?? 1900;
            const to = options?.yearTo ?? new Date().getFullYear();
            params.set("start", "0");
            // ERIC uses publicationdateyear for filtering
            const existing = params.get("search") ?? "";
            params.set("search", `${existing} AND publicationdateyear:[${from} TO ${to}]`);
        }
        const response = await fetch(`${BASE_URL}?${params}`);
        if (!response.ok) {
            throw new Error(`ERIC search failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return (data.response?.docs ?? []).map((doc) => this.mapToPaper(doc));
    }
    async getPaper(id) {
        await this.rateLimiter.acquire();
        const params = new URLSearchParams({
            search: `id:${id}`,
            rows: "1",
            format: "json",
        });
        const response = await fetch(`${BASE_URL}?${params}`);
        if (!response.ok) {
            throw new Error(`ERIC get paper failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        const doc = data.response?.docs?.[0];
        if (!doc) {
            throw new Error(`Paper not found: ${id}`);
        }
        return this.mapToPaper(doc);
    }
    mapToPaper(doc) {
        const authors = (doc.author ?? []).map((name) => ({ name }));
        // ERIC documents with "e_fulltext" are freely available
        const hasFullText = !!doc.e_fulltext;
        const url = doc.url
            ?? (doc.id ? `https://eric.ed.gov/?id=${doc.id}` : "");
        const fullTextUrl = doc.e_fulltext
            ? `https://files.eric.ed.gov/fulltext/${doc.id}.pdf`
            : undefined;
        const paper = {
            title: doc.title ?? "Untitled",
            authors,
            abstract: doc.description ?? "",
            year: doc.publicationdateyear ?? 0,
            journal: doc.source ?? undefined,
            volume: undefined,
            issue: undefined,
            pages: doc.pagecount ? `${doc.pagecount} pages` : undefined,
            publisher: doc.publisher ?? undefined,
            doi: doc.doi ?? undefined,
            url: fullTextUrl ?? url,
            source: "eric",
            sourceId: doc.id ?? "",
            citationCount: undefined, // ERIC does not provide citation counts
            keywords: doc.subject ?? undefined,
            openAccess: hasFullText,
            openAccessUrl: fullTextUrl,
            fullTextAvailable: hasFullText,
        };
        return { ...paper, citations: formatAllCitations(paper) };
    }
}
//# sourceMappingURL=eric-client.js.map