/**
 * SQLite Database Manager for Prima Scholar Library
 *
 * Manages the document library database with FTS5 full-text search.
 * Uses better-sqlite3 for synchronous, high-performance operations.
 */
import type { Document, Collection, Tag, SearchResult, LibraryStats } from "./types.js";
export declare class LibraryDatabase {
    private db;
    constructor(dbPath: string);
    /**
     * Initialise the database schema using versioned migrations.
     *
     * Creates the schema_version table if it does not exist, checks the
     * current version, and runs any pending migrations sequentially.
     */
    private initialise;
    /**
     * Insert a new document and return its ID.
     */
    insertDocument(doc: Partial<Document>): number;
    /**
     * Get a single document by ID.
     */
    getDocument(id: number): Document | null;
    /**
     * List documents with optional filters.
     */
    listDocuments(filters?: {
        collection?: string;
        tag?: string;
        year?: number;
        fileType?: string;
        limit?: number;
        offset?: number;
    }): Document[];
    /**
     * Full-text search across the document library.
     */
    searchDocuments(query: string, limit?: number): SearchResult[];
    /**
     * Update an existing document.
     */
    updateDocument(id: number, updates: Partial<Document>): boolean;
    /**
     * Delete a document by ID. Cascade handles FTS cleanup via trigger.
     */
    deleteDocument(id: number): boolean;
    /**
     * Create a new collection.
     */
    createCollection(name: string, description?: string): number;
    /**
     * List all collections with document counts.
     */
    listCollections(): Collection[];
    /**
     * Add a document to a collection.
     */
    addToCollection(documentId: number, collectionId: number): boolean;
    /**
     * Remove a document from a collection.
     */
    removeFromCollection(documentId: number, collectionId: number): boolean;
    /**
     * Add a tag to a document. Creates the tag if it does not exist.
     */
    addTag(documentId: number, tagName: string): boolean;
    /**
     * Remove a tag from a document.
     */
    removeTag(documentId: number, tagName: string): boolean;
    /**
     * Get all tags for a document.
     */
    getDocumentTags(documentId: number): Tag[];
    /**
     * Get a collection by name.
     */
    getCollectionByName(name: string): Collection | null;
    /**
     * Get aggregate library statistics.
     */
    getStats(): LibraryStats;
}
