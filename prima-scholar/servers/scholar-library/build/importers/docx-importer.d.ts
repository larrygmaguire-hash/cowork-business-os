/**
 * DOCX file importer using mammoth
 */
export declare function importDocx(filePath: string): Promise<{
    title: string;
    content: string;
    fileType: string;
}>;
