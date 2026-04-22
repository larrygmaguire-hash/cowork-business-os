/**
 * PDF file importer using pdf-parse
 */
export declare function importPdf(filePath: string): Promise<{
    title: string;
    content: string;
    fileType: string;
    metadata?: Record<string, string>;
}>;
