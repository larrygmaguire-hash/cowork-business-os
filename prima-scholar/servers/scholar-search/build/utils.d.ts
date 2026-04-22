/**
 * Utility functions for citation formatting and deduplication.
 */
import { CitationStyle, Paper } from "./types.js";
type PaperForCitation = Omit<Paper, 'citations'> & {
    citations?: Record<string, string>;
};
/**
 * Format a Paper into an APA7 citation string.
 *
 * Handles single author, two authors, and three or more authors.
 * Handles preprints (no journal) and missing DOIs.
 */
export declare function formatApa7Citation(paper: PaperForCitation): string;
export declare function formatHarvardCitation(paper: PaperForCitation): string;
export declare function formatChicagoCitation(paper: PaperForCitation): string;
export declare function formatVancouverCitation(paper: PaperForCitation): string;
export declare function formatIeeeCitation(paper: PaperForCitation): string;
export declare function formatMlaCitation(paper: PaperForCitation): string;
export declare function formatCitation(paper: PaperForCitation, style: CitationStyle): string;
export declare function formatAllCitations(paper: Omit<Paper, 'citations'>): Record<string, string>;
/**
 * Normalise a DOI string: strip common prefixes, lowercase, trim.
 */
export declare function normaliseDoi(doi: string): string;
/**
 * Deduplicate papers by DOI.
 *
 * When duplicates are found, prefer the source with more metadata
 * (measured by number of non-null fields).
 */
export declare function deduplicateByDoi(papers: Paper[]): Paper[];
export {};
