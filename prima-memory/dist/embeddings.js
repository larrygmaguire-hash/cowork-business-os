import { pipeline } from '@xenova/transformers';
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';
const MAX_TEXT_LENGTH = 2000;
let embeddingPipeline = null;
let isLoading = false;
let loadPromise = null;
/**
 * Load the embedding model (lazy, cached)
 * First call downloads the model (~90MB), subsequent calls return cached instance
 */
async function getEmbeddingPipeline() {
    if (embeddingPipeline)
        return embeddingPipeline;
    if (isLoading && loadPromise) {
        return loadPromise;
    }
    isLoading = true;
    loadPromise = pipeline('feature-extraction', MODEL_NAME, {
        quantized: true, // Use quantized model for smaller size and faster inference
    });
    embeddingPipeline = await loadPromise;
    isLoading = false;
    return embeddingPipeline;
}
/**
 * Generate embedding for a text string
 * Returns a 384-dimensional Float32Array
 */
export async function generateEmbedding(text) {
    const pipe = await getEmbeddingPipeline();
    // Truncate text if too long
    const truncatedText = text.length > MAX_TEXT_LENGTH
        ? text.slice(0, MAX_TEXT_LENGTH)
        : text;
    // Generate embedding with mean pooling and normalisation
    const output = await pipe(truncatedText, {
        pooling: 'mean',
        normalize: true,
    });
    // Extract the embedding array
    // Handle different array types from transformers.js output
    const data = output.data;
    if (data instanceof Float32Array) {
        return data;
    }
    return new Float32Array(data);
}
/**
 * Generate embedding for a user-assistant exchange pair
 * Combines both messages for richer semantic content
 */
export async function generateExchangeEmbedding(userMessage, assistantMessage) {
    const parts = [];
    if (userMessage) {
        parts.push(`User: ${userMessage}`);
    }
    if (assistantMessage) {
        parts.push(`Assistant: ${assistantMessage}`);
    }
    const combinedText = parts.join('\n\n');
    if (!combinedText) {
        // Return zero vector if no content
        return new Float32Array(384).fill(0);
    }
    return generateEmbedding(combinedText);
}
/**
 * Pre-warm the model (optional, for faster first search)
 * Call this during server startup if desired
 */
export async function warmupModel() {
    await getEmbeddingPipeline();
}
/**
 * Check if the model is loaded
 */
export function isModelLoaded() {
    return embeddingPipeline !== null;
}
