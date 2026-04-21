import { join } from 'path';
import { homedir } from 'os';
/**
 * Central path configuration for PRIMA Memory.
 *
 * All paths are resolved at startup based on the workspace that launched
 * the server. No hardcoded user-specific paths — works for any user
 * on any machine.
 */
// Workspace root = where the server process was launched from
export const WORKSPACE_ROOT = process.cwd();
/**
 * Encode a workspace path to match Claude Code's project directory naming.
 * Claude Code encodes absolute paths by replacing / and spaces with -.
 */
function encodeWorkspacePath(absolutePath) {
    return absolutePath.replace(/[\s\/]/g, '-');
}
// Session data source: ~/.claude/projects/
export const PROJECTS_DIR = join(homedir(), '.claude', 'projects');
// Encoded workspace path — used to find the matching subdirectory in PROJECTS_DIR
export const WORKSPACE_PROJECT_DIR = encodeWorkspacePath(WORKSPACE_ROOT);
// Database: {workspace}/.prima-memory/index.db
export const DB_DIR = join(WORKSPACE_ROOT, '.prima-memory');
export const DB_PATH = join(DB_DIR, 'index.db');
// Agent output extracts: {workspace}/.prima-memory/extracts/
export const EXTRACTS_DIR = join(DB_DIR, 'extracts');
