/**
 * DOCX file importer using mammoth
 */
import path from "path";
import mammoth from "mammoth";
export async function importDocx(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    // Extract title from first non-empty line or use filename
    const firstLine = text.split("\n").find((line) => line.trim().length > 0);
    const title = firstLine?.trim().slice(0, 200) ?? path.basename(filePath, ".docx");
    return {
        title,
        content: text,
        fileType: "docx",
    };
}
//# sourceMappingURL=docx-importer.js.map