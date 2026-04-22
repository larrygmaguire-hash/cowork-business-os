/**
 * SQLite Database Manager for Prima Scholar Library
 *
 * Manages the document library database with FTS5 full-text search.
 * Uses better-sqlite3 for synchronous, high-performance operations.
 */
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
/**
 * All schema migrations in sequential order.
 * Version 1 is the original schema. Add new migrations here as needed.
 */
const MIGRATIONS = [
    {
        version: 1,
        up: [
            `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        authors TEXT,
        abstract TEXT,
        content TEXT,
        year INTEGER,
        doi TEXT,
        source_url TEXT,
        file_path TEXT,
        file_type TEXT,
        date_added TEXT DEFAULT (datetime('now')),
        notes TEXT,
        metadata TEXT,
        citations TEXT
      )`,
            `CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
        title, authors, abstract, content, notes,
        content='documents',
        content_rowid='id'
      )`,
            `CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
        INSERT INTO documents_fts(rowid, title, authors, abstract, content, notes)
        VALUES (new.id, new.title, new.authors, new.abstract, new.content, new.notes);
      END`,
            `CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
        INSERT INTO documents_fts(documents_fts, rowid, title, authors, abstract, content, notes)
        VALUES ('delete', old.id, old.title, old.authors, old.abstract, old.content, old.notes);
      END`,
            `CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
        INSERT INTO documents_fts(documents_fts, rowid, title, authors, abstract, content, notes)
        VALUES ('delete', old.id, old.title, old.authors, old.abstract, old.content, old.notes);
        INSERT INTO documents_fts(rowid, title, authors, abstract, content, notes)
        VALUES (new.id, new.title, new.authors, new.abstract, new.content, new.notes);
      END`,
            `CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        date_created TEXT DEFAULT (datetime('now'))
      )`,
            `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`,
            `CREATE TABLE IF NOT EXISTS document_collections (
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
        PRIMARY KEY (document_id, collection_id)
      )`,
            `CREATE TABLE IF NOT EXISTS document_tags (
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (document_id, tag_id)
      )`,
        ],
    },
    {
        version: 2,
        up: [
            // citations column was retroactively added to v1 CREATE TABLE.
            // This ALTER is only needed for databases created before that change.
            // Marked as safe_alter — the migration runner catches "duplicate column" errors.
            `ALTER TABLE documents ADD COLUMN citations TEXT`,
        ],
        safeDdl: true,
    },
];
export class LibraryDatabase {
    db;
    constructor(dbPath) {
        // Ensure parent directory exists
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.db = new Database(dbPath);
        this.db.pragma("journal_mode = WAL");
        this.db.pragma("foreign_keys = ON");
        this.initialise();
    }
    /**
     * Initialise the database schema using versioned migrations.
     *
     * Creates the schema_version table if it does not exist, checks the
     * current version, and runs any pending migrations sequentially.
     */
    initialise() {
        // Create version tracking table
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `).run();
        // Determine current schema version
        const row = this.db.prepare("SELECT MAX(version) AS current_version FROM schema_version").get();
        const currentVersion = row?.current_version ?? 0;
        // Run pending migrations in a transaction
        const pendingMigrations = MIGRATIONS.filter((m) => m.version > currentVersion);
        if (pendingMigrations.length > 0) {
            const runMigrations = this.db.transaction(() => {
                for (const migration of pendingMigrations) {
                    for (const sql of migration.up) {
                        if (migration.safeDdl) {
                            try {
                                this.db.prepare(sql).run();
                            }
                            catch (err) {
                                const msg = err instanceof Error ? err.message : String(err);
                                if (!msg.includes("duplicate column name")) {
                                    throw err;
                                }
                            }
                        }
                        else {
                            this.db.prepare(sql).run();
                        }
                    }
                    this.db.prepare("INSERT INTO schema_version (version) VALUES (?)").run(migration.version);
                }
            });
            runMigrations();
        }
    }
    /**
     * Insert a new document and return its ID.
     */
    insertDocument(doc) {
        const stmt = this.db.prepare(`
      INSERT INTO documents (title, authors, abstract, content, year, doi, source_url, file_path, file_type, notes, metadata, citations)
      VALUES (@title, @authors, @abstract, @content, @year, @doi, @sourceUrl, @filePath, @fileType, @notes, @metadata, @citations)
    `);
        const result = stmt.run({
            title: doc.title ?? "Untitled",
            authors: doc.authors ?? null,
            abstract: doc.abstract ?? null,
            content: doc.content ?? null,
            year: doc.year ?? null,
            doi: doc.doi ?? null,
            sourceUrl: doc.sourceUrl ?? null,
            filePath: doc.filePath ?? null,
            fileType: doc.fileType ?? null,
            notes: doc.notes ?? null,
            metadata: doc.metadata ?? null,
            citations: doc.citations ?? null,
        });
        return result.lastInsertRowid;
    }
    /**
     * Get a single document by ID.
     */
    getDocument(id) {
        const stmt = this.db.prepare(`
      SELECT id, title, authors, abstract, content, year, doi,
             source_url AS sourceUrl, file_path AS filePath, file_type AS fileType,
             date_added AS dateAdded, notes, metadata, citations
      FROM documents WHERE id = ?
    `);
        return stmt.get(id) ?? null;
    }
    /**
     * List documents with optional filters.
     */
    listDocuments(filters) {
        const conditions = [];
        const params = {};
        let joins = "";
        if (filters?.collection) {
            joins += `
        JOIN document_collections dc ON dc.document_id = d.id
        JOIN collections c ON c.id = dc.collection_id
      `;
            conditions.push("c.name = @collection");
            params.collection = filters.collection;
        }
        if (filters?.tag) {
            joins += `
        JOIN document_tags dt ON dt.document_id = d.id
        JOIN tags t ON t.id = dt.tag_id
      `;
            conditions.push("t.name = @tag");
            params.tag = filters.tag;
        }
        if (filters?.year) {
            conditions.push("d.year = @year");
            params.year = filters.year;
        }
        if (filters?.fileType) {
            conditions.push("d.file_type = @fileType");
            params.fileType = filters.fileType;
        }
        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const limit = filters?.limit ?? 20;
        const offset = filters?.offset ?? 0;
        const stmt = this.db.prepare(`
      SELECT DISTINCT d.id, d.title, d.authors, d.abstract, d.year, d.doi,
             d.source_url AS sourceUrl, d.file_path AS filePath, d.file_type AS fileType,
             d.date_added AS dateAdded, d.notes, d.metadata, d.citations
      FROM documents d
      ${joins}
      ${where}
      ORDER BY d.date_added DESC
      LIMIT @limit OFFSET @offset
    `);
        return stmt.all({ ...params, limit, offset });
    }
    /**
     * Full-text search across the document library.
     */
    searchDocuments(query, limit = 10) {
        const stmt = this.db.prepare(`
      SELECT d.id, d.title, d.authors, d.year,
             snippet(documents_fts, 3, '<mark>', '</mark>', '...', 30) AS snippet,
             rank
      FROM documents_fts f
      JOIN documents d ON d.id = f.rowid
      WHERE documents_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `);
        return stmt.all(query, limit);
    }
    /**
     * Update an existing document.
     */
    updateDocument(id, updates) {
        const fields = [];
        const params = { id };
        if (updates.title !== undefined) {
            fields.push("title = @title");
            params.title = updates.title;
        }
        if (updates.authors !== undefined) {
            fields.push("authors = @authors");
            params.authors = updates.authors;
        }
        if (updates.abstract !== undefined) {
            fields.push("abstract = @abstract");
            params.abstract = updates.abstract;
        }
        if (updates.content !== undefined) {
            fields.push("content = @content");
            params.content = updates.content;
        }
        if (updates.year !== undefined) {
            fields.push("year = @year");
            params.year = updates.year;
        }
        if (updates.doi !== undefined) {
            fields.push("doi = @doi");
            params.doi = updates.doi;
        }
        if (updates.notes !== undefined) {
            fields.push("notes = @notes");
            params.notes = updates.notes;
        }
        if (updates.sourceUrl !== undefined) {
            fields.push("source_url = @sourceUrl");
            params.sourceUrl = updates.sourceUrl;
        }
        if (fields.length === 0)
            return false;
        const stmt = this.db.prepare(`UPDATE documents SET ${fields.join(", ")} WHERE id = @id`);
        const result = stmt.run(params);
        return result.changes > 0;
    }
    /**
     * Delete a document by ID. Cascade handles FTS cleanup via trigger.
     */
    deleteDocument(id) {
        const stmt = this.db.prepare("DELETE FROM documents WHERE id = ?");
        const result = stmt.run(id);
        return result.changes > 0;
    }
    /**
     * Create a new collection.
     */
    createCollection(name, description) {
        const stmt = this.db.prepare("INSERT INTO collections (name, description) VALUES (?, ?)");
        const result = stmt.run(name, description ?? null);
        return result.lastInsertRowid;
    }
    /**
     * List all collections with document counts.
     */
    listCollections() {
        const stmt = this.db.prepare(`
      SELECT c.id, c.name, c.description, c.date_created AS dateCreated,
             COUNT(dc.document_id) AS documentCount
      FROM collections c
      LEFT JOIN document_collections dc ON dc.collection_id = c.id
      GROUP BY c.id
      ORDER BY c.name
    `);
        return stmt.all();
    }
    /**
     * Add a document to a collection.
     */
    addToCollection(documentId, collectionId) {
        const stmt = this.db.prepare("INSERT OR IGNORE INTO document_collections (document_id, collection_id) VALUES (?, ?)");
        const result = stmt.run(documentId, collectionId);
        return result.changes > 0;
    }
    /**
     * Remove a document from a collection.
     */
    removeFromCollection(documentId, collectionId) {
        const stmt = this.db.prepare("DELETE FROM document_collections WHERE document_id = ? AND collection_id = ?");
        const result = stmt.run(documentId, collectionId);
        return result.changes > 0;
    }
    /**
     * Add a tag to a document. Creates the tag if it does not exist.
     */
    addTag(documentId, tagName) {
        this.db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)").run(tagName);
        const tag = this.db.prepare("SELECT id FROM tags WHERE name = ?").get(tagName);
        const stmt = this.db.prepare("INSERT OR IGNORE INTO document_tags (document_id, tag_id) VALUES (?, ?)");
        const result = stmt.run(documentId, tag.id);
        return result.changes > 0;
    }
    /**
     * Remove a tag from a document.
     */
    removeTag(documentId, tagName) {
        const tag = this.db.prepare("SELECT id FROM tags WHERE name = ?").get(tagName);
        if (!tag)
            return false;
        const stmt = this.db.prepare("DELETE FROM document_tags WHERE document_id = ? AND tag_id = ?");
        const result = stmt.run(documentId, tag.id);
        return result.changes > 0;
    }
    /**
     * Get all tags for a document.
     */
    getDocumentTags(documentId) {
        const stmt = this.db.prepare(`
      SELECT t.id, t.name
      FROM tags t
      JOIN document_tags dt ON dt.tag_id = t.id
      WHERE dt.document_id = ?
      ORDER BY t.name
    `);
        return stmt.all(documentId);
    }
    /**
     * Get a collection by name.
     */
    getCollectionByName(name) {
        const stmt = this.db.prepare("SELECT id, name, description, date_created AS dateCreated FROM collections WHERE name = ?");
        return stmt.get(name) ?? null;
    }
    /**
     * Get aggregate library statistics.
     */
    getStats() {
        const totalDocuments = this.db.prepare("SELECT COUNT(*) AS count FROM documents").get().count;
        const byTypeRows = this.db
            .prepare("SELECT COALESCE(file_type, 'unknown') AS type, COUNT(*) AS count FROM documents GROUP BY file_type")
            .all();
        const byType = {};
        for (const row of byTypeRows) {
            byType[row.type] = row.count;
        }
        const byYearRows = this.db
            .prepare("SELECT COALESCE(CAST(year AS TEXT), 'unknown') AS yr, COUNT(*) AS count FROM documents GROUP BY year ORDER BY year DESC")
            .all();
        const byYear = {};
        for (const row of byYearRows) {
            byYear[row.yr] = row.count;
        }
        const topTags = this.db
            .prepare(`
        SELECT t.name, COUNT(dt.document_id) AS count
        FROM tags t
        JOIN document_tags dt ON dt.tag_id = t.id
        GROUP BY t.id
        ORDER BY count DESC
        LIMIT 20
      `)
            .all();
        const totalCollections = this.db.prepare("SELECT COUNT(*) AS count FROM collections").get().count;
        return { totalDocuments, byType, byYear, topTags, totalCollections };
    }
}
//# sourceMappingURL=database.js.map