/**
 * Token bucket rate limiter.
 *
 * Tracks timestamps of recent requests and waits if the bucket is full.
 */
export declare class RateLimiter {
    private timestamps;
    private maxRequests;
    private windowMs;
    constructor(maxRequests: number, windowMs: number);
    acquire(): Promise<void>;
}
