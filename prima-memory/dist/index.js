#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { getAllSessions, getRecentSessionsFast, searchSessions, getFileHistory, getSessionById, summarisePeriod, parsePeriod, searchAgentOutputs, findCheckpointForSession } from './jsonl-parser.js';
import { semanticSearch, semanticResultsToScoredSessions, mergeSearchResults, rebuildIndex, syncIndex, getStats } from './semantic-search.js';
/**
 * Format agent output results for display
 */
function formatAgentResults(agentResults, limit) {
    return agentResults.slice(0, limit).map(result => {
        const scoreStr = result.score > 0 ? ` (relevance: ${Math.round(result.score)})` : '';
        return `- **${result.description}**${scoreStr}
  File: ${result.filePath}
  Project: ${result.projectId}
  Time: ${result.timestamp.toLocaleString()}
  Preview: ${result.preview}...`;
    }).join('\n\n');
}
const server = new Server({
    name: 'prima-memory',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'search_history',
                description: `Search your conversation history with Claude Code. Use this to:
- Remember what you worked on ("what did we do yesterday?")
- Find context for decisions ("why did we add rate limiting?")
- Continue previous work ("what files did we change for auth?")
- Find specific discussions ("find where we talked about caching")
- Find substantial agent outputs ("deep search for research on attachment theory")

The search looks through session summaries, file changes, and conversation content.
When deep: true, also searches saved agent output files for comprehensive retrieval.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Search query - can be natural language, file names, or keywords'
                        },
                        mode: {
                            type: 'string',
                            enum: ['keyword', 'semantic', 'both'],
                            description: 'Search mode: "keyword" for exact matches, "semantic" for meaning-based search, "both" for combined (default)'
                        },
                        time_filter: {
                            type: 'string',
                            description: 'Time filter: "today", "yesterday", "this week", "last week", "this month", "last month", "N days ago", "N weeks ago"'
                        },
                        project_path: {
                            type: 'string',
                            description: 'Filter to specific project path (optional)'
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of sessions to return (default: 5)'
                        },
                        deep: {
                            type: 'boolean',
                            description: 'When true, also search session extract files in .prima-memory/extracts/ after searching conversation history. Use for comprehensive searches across all stored knowledge.'
                        }
                    }
                }
            },
            {
                name: 'get_file_history',
                description: `Get the history of changes to a specific file across all sessions.
Shows when the file was modified, what was changed, and the explanation given at the time.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        file_path: {
                            type: 'string',
                            description: 'File path or partial path to search for'
                        },
                        project_path: {
                            type: 'string',
                            description: 'Filter to specific project path (optional)'
                        }
                    },
                    required: ['file_path']
                }
            },
            {
                name: 'get_recent_sessions',
                description: `Get a summary of recent coding sessions.
Use this to quickly see what work has been done recently.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'Number of sessions to return (default: 5)'
                        },
                        project_path: {
                            type: 'string',
                            description: 'Filter to specific project path (optional)'
                        }
                    }
                }
            },
            {
                name: 'get_session_details',
                description: `Get the full conversation details from a specific session.
Use this to drill into a session found via search_history or get_recent_sessions.
Returns the complete message history with timestamps.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        session_id: {
                            type: 'string',
                            description: 'The session ID to retrieve (from search results or recent sessions)'
                        },
                        project_path: {
                            type: 'string',
                            description: 'Filter to specific project path (optional)'
                        },
                        include_tool_calls: {
                            type: 'boolean',
                            description: 'Include tool call details in output (default: false)'
                        },
                        detail_level: {
                            type: 'string',
                            enum: ['summary', 'standard', 'full'],
                            description: 'Message detail level: "summary" (2000 chars/msg), "standard" (5000 chars/msg, default), "full" (no limit — use with caution on long sessions)'
                        }
                    },
                    required: ['session_id']
                }
            },
            {
                name: 'summarise_period',
                description: `Get a summary of all work done over a time period.
Aggregates multiple sessions to show: total sessions, files changed, projects worked on, and common topics.
Use this for weekly reviews or understanding what was accomplished.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        period: {
                            type: 'string',
                            description: 'Time period: "today", "yesterday", "this week", "last week", "this month", "last month"'
                        },
                        project_path: {
                            type: 'string',
                            description: 'Filter to specific project path (optional)'
                        }
                    },
                    required: ['period']
                }
            },
            {
                name: 'rebuild_index',
                description: `Force a complete rebuild of the semantic search index.
Use this if search results seem stale or after significant changes to conversation history.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        confirm: {
                            type: 'boolean',
                            description: 'Must be true to proceed with rebuild'
                        }
                    },
                    required: ['confirm']
                }
            }
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === 'search_history') {
            const query = args?.query || '';
            const mode = args?.mode || 'both';
            const timeFilter = args?.time_filter;
            const projectPath = args?.project_path;
            const limit = args?.limit || 5;
            const deep = args?.deep || false;
            let results = [];
            try {
                if (mode === 'keyword') {
                    const allSessions = await getAllSessions(projectPath);
                    results = searchSessions(allSessions, query, timeFilter).slice(0, limit);
                }
                else if (mode === 'semantic') {
                    // Sync index first (lazy)
                    await syncIndex(projectPath);
                    const semanticResults = await semanticSearch({ query, limit, projectPath });
                    results = await semanticResultsToScoredSessions(semanticResults, projectPath);
                }
                else {
                    // mode === 'both'
                    const allSessions = await getAllSessions(projectPath);
                    const keywordResults = searchSessions(allSessions, query, timeFilter).slice(0, limit * 2);
                    // Sync and search semantically
                    await syncIndex(projectPath);
                    const semanticResults = await semanticSearch({ query, limit: limit * 2, projectPath });
                    const semanticScored = await semanticResultsToScoredSessions(semanticResults, projectPath);
                    // Merge results
                    results = mergeSearchResults(keywordResults, semanticScored).slice(0, limit);
                }
            }
            catch (err) {
                // Fallback to keyword search if semantic fails
                console.error('Semantic search error, falling back to keyword:', err);
                const allSessions = await getAllSessions(projectPath);
                results = searchSessions(allSessions, query, timeFilter).slice(0, limit);
            }
            if (results.length === 0) {
                // If deep search, still check agent outputs before giving up
                if (deep) {
                    try {
                        const agentResults = await searchAgentOutputs(query, {
                            projectId: projectPath,
                            timeFilter: timeFilter,
                        });
                        if (agentResults.length > 0) {
                            return {
                                content: [
                                    {
                                        type: 'text',
                                        text: `No conversation sessions found, but found ${agentResults.length} agent output(s):\n\n## Agent Outputs\n\n${formatAgentResults(agentResults, limit)}`
                                    }
                                ]
                            };
                        }
                    }
                    catch (err) {
                        console.error('Agent output search error:', err);
                    }
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No sessions found matching "${query}"${timeFilter ? ` within ${timeFilter}` : ''}.${deep ? ' No agent outputs found either.' : ''}`
                        }
                    ]
                };
            }
            const formatted = results.map(session => {
                const filesStr = session.filesChanged.length > 0
                    ? `\n  Files changed: ${session.filesChanged.map(f => f.filePath.split('/').pop()).join(', ')}`
                    : '';
                const tagsStr = session.tags && session.tags.length > 0
                    ? `\n  Tags: ${session.tags.join(', ')}`
                    : '';
                const scoreStr = session.score > 0 ? ` (relevance: ${Math.round(session.score)})` : '';
                const relevantMessages = session.messages
                    .filter(m => m.text && m.role === 'assistant')
                    .filter(m => {
                    if (!query)
                        return true;
                    return m.text?.toLowerCase().includes(query.toLowerCase());
                })
                    .slice(0, 2)
                    .map(m => `    "${m.text?.slice(0, 150)}..."`)
                    .join('\n');
                const messagesStr = relevantMessages ? `\n  Relevant context:\n${relevantMessages}` : '';
                return `## ${session.summary}${scoreStr}
  Session: ${session.id}
  Time: ${session.startTime.toLocaleString()}
  Project: ${session.cwd || 'unknown'}
  Branch: ${session.gitBranch || 'unknown'}${tagsStr}${filesStr}${messagesStr}`;
            }).join('\n\n');
            // Deep search: also search agent outputs
            let agentOutputSection = '';
            if (deep) {
                try {
                    const agentResults = await searchAgentOutputs(query, {
                        projectId: projectPath,
                        timeFilter: timeFilter,
                    });
                    if (agentResults.length > 0) {
                        agentOutputSection = `\n\n---\n\n## Agent Outputs\n\n${formatAgentResults(agentResults, limit)}`;
                    }
                }
                catch (err) {
                    console.error('Agent output search error:', err);
                    // Non-fatal: continue with conversation results only
                }
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: `Found ${results.length} session(s) matching your query (mode: ${mode}):\n\n${formatted}${agentOutputSection}`
                    }
                ]
            };
        }
        if (name === 'rebuild_index') {
            const confirm = args?.confirm;
            if (!confirm) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Rebuild cancelled. Set confirm: true to proceed.'
                        }
                    ]
                };
            }
            try {
                const result = await rebuildIndex();
                const stats = getStats();
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Index rebuilt successfully.\n\nIndexed: ${result.indexed} exchanges\nSkipped: ${result.skipped} files\nErrors: ${result.errors}\n\nTotal in index: ${stats.totalExchanges} exchanges from ${stats.totalFiles} files`
                        }
                    ]
                };
            }
            catch (err) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error rebuilding index: ${err instanceof Error ? err.message : 'Unknown error'}`
                        }
                    ]
                };
            }
        }
        if (name === 'get_file_history') {
            const filePath = args?.file_path;
            const projectPath = args?.project_path;
            if (!filePath) {
                return {
                    content: [{ type: 'text', text: 'Error: file_path is required' }]
                };
            }
            const allSessions = await getAllSessions(projectPath);
            const changes = getFileHistory(allSessions, filePath);
            if (changes.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No history found for "${filePath}".`
                        }
                    ]
                };
            }
            const formatted = changes.map(change => {
                return `- ${change.timestamp.toLocaleString()} [${change.changeType}]
  ${change.filePath}
  Session: ${change.sessionId}
  "${change.explanation || 'No explanation recorded'}"`;
            }).join('\n\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `File history for "${filePath}" (${changes.length} changes):\n\n${formatted}`
                    }
                ]
            };
        }
        if (name === 'get_recent_sessions') {
            const limit = args?.limit || 5;
            const projectPath = args?.project_path;
            const recent = await getRecentSessionsFast(limit, projectPath);
            if (recent.length === 0) {
                return {
                    content: [{ type: 'text', text: 'No sessions found.' }]
                };
            }
            // Check for checkpoint files for each session
            const checkpointResults = await Promise.all(recent.map(session => session.cwd
                ? findCheckpointForSession(session.cwd, session.startTime)
                : Promise.resolve(null)));
            const formatted = recent.map((session, index) => {
                const duration = session.endTime
                    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
                    : null;
                const durationStr = duration ? ` (${duration} min)` : '';
                const tagsStr = session.tags && session.tags.length > 0
                    ? `\n  Tags: ${session.tags.join(', ')}`
                    : '';
                const checkpoint = checkpointResults[index];
                const checkpointStr = checkpoint
                    ? `\n  Checkpoint: ${checkpoint.path}\n  Checkpoint preview: ${checkpoint.preview.slice(0, 150)}...`
                    : '';
                return `## ${session.summary}
  Session: ${session.id}
  Time: ${session.startTime.toLocaleString()}${durationStr}
  Project: ${session.cwd || 'unknown'}
  Branch: ${session.gitBranch || 'unknown'}${tagsStr}
  Messages: ${session.messageCount}
  Files changed: ${session.filesChanged.length}${checkpointStr}`;
            }).join('\n\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `Recent sessions:\n\n${formatted}`
                    }
                ]
            };
        }
        if (name === 'get_session_details') {
            const sessionId = args?.session_id;
            const projectPath = args?.project_path;
            const includeToolCalls = args?.include_tool_calls || false;
            const detailLevel = args?.detail_level || 'standard';
            const maxMessageLength = detailLevel === 'full' ? 0 : detailLevel === 'summary' ? 2000 : 5000;
            if (!sessionId) {
                return {
                    content: [{ type: 'text', text: 'Error: session_id is required' }]
                };
            }
            const session = await getSessionById(sessionId, projectPath);
            if (!session) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Session "${sessionId}" not found.`
                        }
                    ]
                };
            }
            const duration = session.endTime
                ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
                : null;
            // Format messages
            const messagesFormatted = session.messages
                .filter(m => m.text || (includeToolCalls && m.toolCalls))
                .map(m => {
                const roleLabel = m.role === 'user' ? '👤 User' : '🤖 Assistant';
                const timestamp = m.timestamp.toLocaleTimeString();
                let content = `### ${roleLabel} (${timestamp})\n`;
                if (m.text) {
                    if (maxMessageLength > 0 && m.text.length > maxMessageLength) {
                        content += m.text.slice(0, maxMessageLength) + `\n\n[... truncated at ${maxMessageLength} chars — use detail_level: "full" for complete text]`;
                    }
                    else {
                        content += m.text;
                    }
                }
                if (includeToolCalls && m.toolCalls && m.toolCalls.length > 0) {
                    const tools = m.toolCalls.map(t => `  - ${t.name}`).join('\n');
                    content += `\n\nTools used:\n${tools}`;
                }
                return content;
            })
                .join('\n\n---\n\n');
            const filesStr = session.filesChanged.length > 0
                ? `\n\n## Files Changed\n${session.filesChanged.map(f => `- ${f.filePath} [${f.changeType}]`).join('\n')}`
                : '';
            const header = `# ${session.summary}

**Session ID:** ${session.id}
**Time:** ${session.startTime.toLocaleString()}${duration ? ` (${duration} min)` : ''}
**Project:** ${session.cwd || 'unknown'}
**Branch:** ${session.gitBranch || 'unknown'}
**Messages:** ${session.messageCount}
${session.tags && session.tags.length > 0 ? `**Tags:** ${session.tags.join(', ')}` : ''}
${filesStr}

---

## Conversation

${messagesFormatted}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: header
                    }
                ]
            };
        }
        if (name === 'summarise_period') {
            const period = args?.period;
            const projectPath = args?.project_path;
            if (!period) {
                return {
                    content: [{ type: 'text', text: 'Error: period is required' }]
                };
            }
            const { startDate, endDate } = parsePeriod(period);
            const summary = await summarisePeriod(startDate, endDate, projectPath);
            if (summary.totalSessions === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No sessions found for ${period}.`
                        }
                    ]
                };
            }
            const projectsList = summary.projectsWorkedOn.length > 0
                ? summary.projectsWorkedOn.map(p => `  - ${p}`).join('\n')
                : '  None recorded';
            const topicsList = summary.topTopics.length > 0
                ? summary.topTopics.join(', ')
                : 'None extracted';
            const sessionsList = summary.sessionSummaries.length > 0
                ? summary.sessionSummaries.map(s => `  - ${s}`).slice(0, 10).join('\n')
                : '  No summaries available';
            const filesList = summary.filesChanged.length > 0
                ? `${summary.filesChanged.length} files (${summary.filesChanged.slice(0, 5).map(f => f.split('/').pop()).join(', ')}${summary.filesChanged.length > 5 ? '...' : ''})`
                : 'None';
            const formatted = `# Summary: ${period}

**Period:** ${summary.startDate.toLocaleDateString()} - ${summary.endDate.toLocaleDateString()}
**Total Sessions:** ${summary.totalSessions}
**Total Messages:** ${summary.totalMessages}
**Files Changed:** ${filesList}

## Projects Worked On
${projectsList}

## Key Topics
${topicsList}

## Session Highlights
${sessionsList}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted
                    }
                ]
            };
        }
        return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            ]
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('PRIMA Memory MCP server running...');
}
main().catch(console.error);
