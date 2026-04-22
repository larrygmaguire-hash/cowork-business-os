/**
 * DBLP API client.
 *
 * Queries the DBLP computer science bibliography for publications.
 * No authentication required.
 *
 * API docs: https://dblp.org/faq/How+to+use+the+dblp+search+API.html
 */
import { RateLimiter } from "./rate-limiter.js";
import { formatAllCitations } from "./utils.js";
const BASE_URL = "https://dblp.org/search/publ/api";
export class DblpClient {
    rateLimiter = new RateLimiter(5, 1000);
    async search(query, options) {
        const maxResults = options?.maxResults ?? 10;
        await this.rateLimiter.acquire();
        let searchQuery = query;
        if (options?.yearFrom && options?.yearTo) {
            searchQuery += ` year:${options.yearFrom}:${options.yearTo}`;
        }
        else if (options?.yearFrom) {
            searchQuery += ` year:${options.yearFrom}:`;
        }
        else if (options?.yearTo) {
            searchQuery += ` year::${options.yearTo}`;
        }
        const params = new URLSearchParams({
            q: searchQuery,
            h: String(maxResults),
            format: "json",
        });
        const response = await fetch(`${BASE_URL}?${params}`);
        if (!response.ok) {
            throw new Error(`DBLP search failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        const hits = data.result?.hits?.hit ?? [];
        return hits.map((hit) => this.mapToPaper(hit.info));
    }
    async getPaper(id) {
        await this.rateLimiter.acquire();
        // DBLP uses URL-based keys, e.g. "conf/nips/AuthorYear"
        // Try searching by key
        const params = new URLSearchParams({
            q: id,
            h: "1",
            format: "json",
        });
        const response = await fetch(`${BASE_URL}?${params}`);
        if (!response.ok) {
            throw new Error(`DBLP get paper failed: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        const hit = data.result?.hits?.hit?.[0];
        if (!hit) {
            throw new Error(`Paper not found: ${id}`);
        }
        return this.mapToPaper(hit.info);
    }
    mapToPaper(info) {
        // DBLP authors can be a string or array
        let authorNames = [];
        if (info.authors?.author) {
            const raw = info.authors.author;
            if (Array.isArray(raw)) {
                authorNames = raw.map((a) => (typeof a === "string" ? a : a.text ?? "Unknown"));
            }
            else {
                authorNames = [typeof raw === "string" ? raw : raw.text ?? "Unknown"];
            }
        }
        const authors = authorNames.map((name) => ({ name }));
        const doi = info.doi ?? undefined;
        // Determine venue type
        const venue = info.venue
            ? typeof info.venue === "string"
                ? info.venue
                : Array.isArray(info.venue)
                    ? info.venue.join(", ")
                    : String(info.venue)
            : undefined;
        // DBLP links to publisher pages — many CS publications are OA
        const url = info.ee
            ? typeof info.ee === "string"
                ? info.ee
                : Array.isArray(info.ee)
                    ? info.ee[0]
                    : info.url ?? ""
            : info.url ?? "";
        const paper = {
            title: info.title ?? "Untitled",
            authors,
            abstract: "", // DBLP does not provide abstracts
            year: info.year ? parseInt(String(info.year), 10) : 0,
            journal: venue,
            volume: info.volume ?? undefined,
            issue: info.number ?? undefined,
            pages: info.pages ?? undefined,
            publisher: undefined,
            doi,
            url,
            source: "dblp",
            sourceId: info.key ?? info.url ?? "",
            citationCount: undefined, // DBLP does not provide citation counts
            keywords: info.type ? [info.type] : undefined,
            openAccess: false, // DBLP does not track OA status — conservative default
            openAccessUrl: undefined,
            fullTextAvailable: false,
        };
        return { ...paper, citations: formatAllCitations(paper) };
    }
}
//# sourceMappingURL=dblp-client.js.map