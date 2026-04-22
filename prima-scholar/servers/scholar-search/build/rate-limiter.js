/**
 * Token bucket rate limiter.
 *
 * Tracks timestamps of recent requests and waits if the bucket is full.
 */
export class RateLimiter {
    timestamps = [];
    maxRequests;
    windowMs;
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    async acquire() {
        const now = Date.now();
        // Remove timestamps outside the current window
        this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
        if (this.timestamps.length >= this.maxRequests) {
            // Calculate how long to wait until the oldest request exits the window
            const oldest = this.timestamps[0];
            const waitMs = this.windowMs - (now - oldest) + 1;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            // Clean up again after waiting
            const afterWait = Date.now();
            this.timestamps = this.timestamps.filter((t) => afterWait - t < this.windowMs);
        }
        this.timestamps.push(Date.now());
    }
}
//# sourceMappingURL=rate-limiter.js.map