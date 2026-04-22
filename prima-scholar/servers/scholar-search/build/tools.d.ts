/**
 * MCP Tool Definitions for PRIMA Scholar Search v2.
 *
 * Five tools: wizard, search, get_paper, citations, full_text.
 * All backend routing happens inside the server, not at the tool level.
 */
export declare const TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            max_results?: undefined;
            sources?: undefined;
            open_access_only?: undefined;
            year_from?: undefined;
            year_to?: undefined;
            citation_style?: undefined;
            id?: undefined;
            paper_id?: undefined;
            direction?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            max_results: {
                type: string;
                description: string;
            };
            sources: {
                type: string;
                items: {
                    type: string;
                    enum: string[];
                };
                description: string;
            };
            open_access_only: {
                type: string;
                description: string;
            };
            year_from: {
                type: string;
                description: string;
            };
            year_to: {
                type: string;
                description: string;
            };
            citation_style: {
                type: string;
                description: string;
                enum: string[];
            };
            id?: undefined;
            paper_id?: undefined;
            direction?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            citation_style: {
                type: string;
                description: string;
                enum: string[];
            };
            query?: undefined;
            max_results?: undefined;
            sources?: undefined;
            open_access_only?: undefined;
            year_from?: undefined;
            year_to?: undefined;
            paper_id?: undefined;
            direction?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            paper_id: {
                type: string;
                description: string;
            };
            direction: {
                type: string;
                enum: string[];
                description: string;
            };
            max_results: {
                type: string;
                description: string;
            };
            query?: undefined;
            sources?: undefined;
            open_access_only?: undefined;
            year_from?: undefined;
            year_to?: undefined;
            citation_style?: undefined;
            id?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            query?: undefined;
            max_results?: undefined;
            sources?: undefined;
            open_access_only?: undefined;
            year_from?: undefined;
            year_to?: undefined;
            citation_style?: undefined;
            paper_id?: undefined;
            direction?: undefined;
        };
        required: string[];
    };
})[];
