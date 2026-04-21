import type { Session, ExtractResult } from './types.js';
/**
 * Determine if a session is substantial enough to warrant auto-extraction.
 * A session qualifies if ANY of these are true:
 * - 50+ messages
 * - 10+ files changed
 * - Duration > 30 minutes
 */
export declare function isSubstantialSession(session: Session): boolean;
/**
 * Write a session extract to disk if the session qualifies and no extract exists yet.
 * Non-fatal — errors are logged but do not interrupt the caller.
 */
export declare function writeExtract(session: Session): Promise<ExtractResult>;
