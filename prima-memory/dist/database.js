import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { mkdirSync, existsSync } from 'fs';
import { DB_DIR, DB_PATH } from './config.js';
let db = null;
/**
 * Initialise and return the SQLite database with vector extension
 */
export function getDatabase() {
    if (db)
        return db;
    // Ensure directory exists
    if (!existsSync(DB_DIR)) {
        mkdirSync(DB_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    // Load sqlite-vec extension
    sqliteVec.load(db);
    // Create tables
    db.exec(`
    -- Core exchanges table
    CREATE TABLE IF NOT EXISTS exchanges (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      exchange_index INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      user_message TEXT,
      assistant_message TEXT,
      project_path TEXT,
      git_branch TEXT,
      file_path TEXT,
      indexed_at INTEGER NOT NULL,
      UNIQUE(session_id, exchange_index)
    );

    -- Vector index (sqlite-vec virtual table)
    CREATE VIRTUAL TABLE IF NOT EXISTS vec_exchanges USING vec0(
      id TEXT PRIMARY KEY,
      embedding FLOAT[384]
    );

    -- Metadata for sync tracking
    CREATE TABLE IF NOT EXISTS sync_state (
      file_path TEXT PRIMARY KEY,
      mtime INTEGER NOT NULL,
      last_synced INTEGER NOT NULL
    );

    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_exchanges_session ON exchanges(session_id);
    CREATE INDEX IF NOT EXISTS idx_exchanges_project ON exchanges(project_path);
    CREATE INDEX IF NOT EXISTS idx_exchanges_timestamp ON exchanges(timestamp DESC);
  `);
    return db;
}
/**
 * Close the database connection
 */
export function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
/**
 * Check if a file has been indexed and is up to date
 */
export function isFileIndexed(filePath, mtime) {
    const database = getDatabase();
    const row = database.prepare('SELECT mtime FROM sync_state WHERE file_path = ?').get(filePath);
    return row !== undefined && row.mtime === mtime;
}
/**
 * Update sync state for a file
 */
export function updateSyncState(filePath, mtime) {
    const database = getDatabase();
    database.prepare(`
    INSERT OR REPLACE INTO sync_state (file_path, mtime, last_synced)
    VALUES (?, ?, ?)
  `).run(filePath, mtime, Date.now());
}
/**
 * Insert an exchange with its embedding
 */
export function insertExchange(id, sessionId, exchangeIndex, timestamp, userMessage, assistantMessage, projectPath, gitBranch, filePath, embedding) {
    const database = getDatabase();
    // Insert metadata
    database.prepare(`
    INSERT OR REPLACE INTO exchanges
    (id, session_id, exchange_index, timestamp, user_message, assistant_message, project_path, git_branch, file_path, indexed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, sessionId, exchangeIndex, timestamp, userMessage, assistantMessage, projectPath, gitBranch, filePath, Date.now());
    // Insert vector
    database.prepare(`
    INSERT OR REPLACE INTO vec_exchanges (id, embedding)
    VALUES (?, ?)
  `).run(id, embedding);
}
/**
 * Search for similar exchanges using vector similarity
 */
export function searchSimilar(queryEmbedding, limit = 10, projectPath) {
    const database = getDatabase();
    let query = `
    SELECT v.id, v.distance
    FROM vec_exchanges v
  `;
    const params = [queryEmbedding, limit];
    if (projectPath) {
        query += `
      JOIN exchanges e ON v.id = e.id
      WHERE e.project_path LIKE ?
      AND v.embedding MATCH ?
      ORDER BY v.distance
      LIMIT ?
    `;
        params.unshift(`%${projectPath}%`);
    }
    else {
        query += `
      WHERE v.embedding MATCH ?
      ORDER BY v.distance
      LIMIT ?
    `;
    }
    return database.prepare(query).all(...params);
}
/**
 * Get exchange metadata by ID
 */
export function getExchangeById(id) {
    const database = getDatabase();
    const row = database.prepare('SELECT * FROM exchanges WHERE id = ?').get(id);
    if (!row)
        return undefined;
    return {
        id: row.id,
        sessionId: row.session_id,
        exchangeIndex: row.exchange_index,
        timestamp: row.timestamp,
        userMessage: row.user_message,
        assistantMessage: row.assistant_message,
        projectPath: row.project_path,
        gitBranch: row.git_branch,
        filePath: row.file_path,
    };
}
/**
 * Clear all indexed data (for rebuild)
 */
export function clearIndex() {
    const database = getDatabase();
    database.exec(`
    DELETE FROM exchanges;
    DELETE FROM vec_exchanges;
    DELETE FROM sync_state;
  `);
}
/**
 * Get index statistics
 */
export function getIndexStats() {
    const database = getDatabase();
    const exchanges = database.prepare('SELECT COUNT(*) as count FROM exchanges').get();
    const files = database.prepare('SELECT COUNT(*) as count FROM sync_state').get();
    return {
        totalExchanges: exchanges.count,
        totalFiles: files.count
    };
}
