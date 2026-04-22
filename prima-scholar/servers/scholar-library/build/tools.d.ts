/**
 * MCP Tool Definitions for Prima Scholar Library
 *
 * Each tool defines its name, description, and input schema.
 */
export declare const TOOLS: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            file_path: {
                type: string;
                description: string;
            };
            title: {
                type: string;
                description: string;
            };
            authors: {
                type: string;
                description: string;
            };
            year: {
                type: string;
                description: string;
            };
            doi: {
                type: string;
                description: string;
            };
            notes: {
                type: string;
                description: string;
            };
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            title: {
                type: string;
                description: string;
            };
            authors: {
                type: string;
                description: string;
            };
            abstract: {
                type: string;
                description: string;
            };
            year: {
                type: string;
                description: string;
            };
            doi: {
                type: string;
                description: string;
            };
            source_url: {
                type: string;
                description: string;
            };
            source: {
                type: string;
                description: string;
            };
            citations: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            notes?: undefined;
            query?: undefined;
            max_results?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
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
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            year?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
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
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            year?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            collection: {
                type: string;
                description: string;
            };
            tag: {
                type: string;
                description: string;
            };
            year: {
                type: string;
                description: string;
            };
            file_type: {
                type: string;
                description: string;
            };
            max_results: {
                type: string;
                description: string;
            };
            offset: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            id?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: never[];
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
            title: {
                type: string;
                description: string;
            };
            authors: {
                type: string;
                description: string;
            };
            notes: {
                type: string;
                description: string;
            };
            year: {
                type: string;
                description: string;
            };
            doi: {
                type: string;
                description: string;
            };
            abstract: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            year?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            year?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            document_id?: undefined;
            collection_name?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            document_id: {
                type: string;
                description: string;
            };
            collection_name: {
                type: string;
                description: string;
            };
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            year?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            tag_name?: undefined;
            action?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            document_id: {
                type: string;
                description: string;
            };
            tag_name: {
                type: string;
                description: string;
            };
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            file_path?: undefined;
            title?: undefined;
            authors?: undefined;
            year?: undefined;
            doi?: undefined;
            notes?: undefined;
            abstract?: undefined;
            source_url?: undefined;
            source?: undefined;
            citations?: undefined;
            query?: undefined;
            max_results?: undefined;
            id?: undefined;
            collection?: undefined;
            tag?: undefined;
            file_type?: undefined;
            offset?: undefined;
            name?: undefined;
            description?: undefined;
            collection_name?: undefined;
        };
        required: string[];
    };
})[];
