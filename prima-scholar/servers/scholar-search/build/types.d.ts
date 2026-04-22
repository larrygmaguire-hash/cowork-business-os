/**
 * Shared type definitions for the PRIMA Scholar Search MCP server.
 */
export type SourceName = "pubmed" | "arxiv" | "semantic_scholar" | "crossref" | "openalex" | "core" | "europe_pmc" | "eric" | "biorxiv" | "dblp";
export declare const ALL_SOURCES: SourceName[];
export type Discipline = "psychology" | "education" | "neuroscience" | "business_management" | "computer_science" | "philosophy_humanities" | "biomedical" | "engineering" | "social_sciences" | "mathematics_physics" | "economics" | "multidisciplinary";
export interface Author {
    name: string;
    affiliations?: string[];
}
export type CitationStyle = "apa7" | "harvard" | "chicago" | "vancouver" | "ieee" | "mla";
export interface Paper {
    title: string;
    authors: Author[];
    abstract: string;
    year: number;
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    publisher?: string;
    doi?: string;
    url: string;
    source: SourceName;
    sourceId: string;
    citationCount?: number;
    keywords?: string[];
    citations: Record<string, string>;
    openAccess: boolean;
    openAccessUrl?: string;
    fullTextAvailable: boolean;
}
export interface SearchOptions {
    maxResults?: number;
    yearFrom?: number;
    yearTo?: number;
    openAccessOnly?: boolean;
}
export interface SearchResult {
    papers: Paper[];
    totalResults: number;
    query: string;
    sources: string[];
    openAccessCount?: number;
    gatedCount?: number;
    errors?: string[];
    missingApiKeys?: string[];
}
export interface WizardQuestion {
    id: string;
    question: string;
    options?: string[];
    type?: "select" | "free_text";
    default: string | null;
}
export interface WizardAnalysis {
    detectedDisciplines: Discipline[];
    suggestedSources: SourceName[];
    confidence: "high" | "medium" | "low";
}
export interface WizardResult {
    analysis: WizardAnalysis;
    questions: WizardQuestion[];
    suggestedSearch: {
        query: string;
        sources: SourceName[];
        openAccessOnly: boolean;
        yearFrom: number | null;
        yearTo: number | null;
        includePreprints: boolean;
        maxResults: number;
    };
}
export interface ScholarClient {
    search(query: string, options?: SearchOptions): Promise<Paper[]>;
    getPaper(id: string): Promise<Paper>;
}
