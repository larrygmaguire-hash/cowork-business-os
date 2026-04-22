/**
 * Type definitions for the Prima Scholar Library
 */
export interface Document {
    id: number;
    title: string;
    authors: string | null;
    abstract: string | null;
    content: string | null;
    year: number | null;
    doi: string | null;
    sourceUrl: string | null;
    filePath: string | null;
    fileType: string | null;
    dateAdded: string;
    notes: string | null;
    metadata: string | null;
    citations: string | null;
}
export interface Collection {
    id: number;
    name: string;
    description: string | null;
    dateCreated: string;
    documentCount?: number;
}
export interface Tag {
    id: number;
    name: string;
}
export interface SearchResult {
    id: number;
    title: string;
    authors: string | null;
    year: number | null;
    snippet: string;
    rank: number;
}
export interface LibraryStats {
    totalDocuments: number;
    byType: Record<string, number>;
    byYear: Record<string, number>;
    topTags: {
        name: string;
        count: number;
    }[];
    totalCollections: number;
}
export interface ImportResult {
    id: number;
    title: string;
    extractedLength: number;
    fileType: string;
}
