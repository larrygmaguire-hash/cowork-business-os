export interface JSONLMessage {
    type: string;
    uuid?: string;
    parentUuid?: string;
    sessionId?: string;
    timestamp?: string;
    cwd?: string;
    gitBranch?: string;
    version?: string;
    message?: {
        role: string;
        content: string | ContentBlock[];
        model?: string;
    };
    summary?: string;
    leafUuid?: string;
}
export interface ContentBlock {
    type: string;
    text?: string;
    thinking?: string;
    name?: string;
    input?: Record<string, unknown>;
    id?: string;
}
export interface Session {
    id: string;
    filePath: string;
    summary: string;
    startTime: Date;
    endTime?: Date;
    cwd: string;
    gitBranch?: string;
    messageCount: number;
    filesChanged: FileChange[];
    messages: ParsedMessage[];
    tags?: string[];
}
export interface ScoredSession extends Session {
    score: number;
}
export interface ParsedMessage {
    uuid: string;
    timestamp: Date;
    role: string;
    text?: string;
    toolCalls?: ToolCall[];
}
export interface ToolCall {
    name: string;
    input: Record<string, unknown>;
}
export interface FileChange {
    filePath: string;
    changeType: 'write' | 'edit' | 'delete';
    timestamp: Date;
    explanation?: string;
    sessionId: string;
}
export interface SearchResult {
    session: {
        id: string;
        summary: string;
        startTime: string;
        cwd: string;
        gitBranch?: string;
    };
    matches: MatchedMessage[];
    filesChanged: FileChange[];
    score: number;
}
export interface MatchedMessage {
    timestamp: string;
    role: string;
    text: string;
    relevance: 'high' | 'medium' | 'low';
}
export interface CacheEntry {
    session: Session;
    mtime: number;
}
export interface PeriodSummary {
    startDate: Date;
    endDate: Date;
    totalSessions: number;
    totalMessages: number;
    filesChanged: string[];
    projectsWorkedOn: string[];
    topTopics: string[];
    sessionSummaries: string[];
}
export interface Exchange {
    id: string;
    sessionId: string;
    exchangeIndex: number;
    timestamp: Date;
    userMessage: string | null;
    assistantMessage: string | null;
    projectPath: string | null;
    gitBranch: string | null;
    filePath: string;
}
export interface SemanticSearchOptions {
    query: string;
    limit?: number;
    projectPath?: string;
    after?: Date;
    before?: Date;
    threshold?: number;
}
export interface SemanticSearchResult {
    exchange: Exchange;
    similarity: number;
    sessionId: string;
}
export type SearchMode = 'keyword' | 'semantic' | 'both';
export interface SyncResult {
    indexed: number;
    skipped: number;
    errors: number;
}
export interface ExtractResult {
    filePath: string;
    sessionId: string;
    skipped: boolean;
    reason?: string;
}
export interface AgentOutputResult {
    filePath: string;
    projectId: string;
    timestamp: Date;
    description: string;
    preview: string;
    score: number;
}
