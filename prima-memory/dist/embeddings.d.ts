/**
 * Generate embedding for a text string
 * Returns a 384-dimensional Float32Array
 */
export declare function generateEmbedding(text: string): Promise<Float32Array>;
/**
 * Generate embedding for a user-assistant exchange pair
 * Combines both messages for richer semantic content
 */
export declare function generateExchangeEmbedding(userMessage: string | null, assistantMessage: string | null): Promise<Float32Array>;
/**
 * Pre-warm the model (optional, for faster first search)
 * Call this during server startup if desired
 */
export declare function warmupModel(): Promise<void>;
/**
 * Check if the model is loaded
 */
export declare function isModelLoaded(): boolean;
