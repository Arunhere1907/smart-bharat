/**
 * Rate limiting middleware using IP-based throttling
 * For production, integrate with Vercel KV or Upstash Redis
 */

import type { VercelRequest } from "@vercel/node";

// In-memory rate limit store (resets on serverless function cold start)
// For production, use Vercel KV or Upstash Redis for persistent storage
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter
 * Returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  req: VercelRequest,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  // Get client IP (Vercel provides this in headers)
  const ip = 
    (req.headers?.['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers?.['x-real-ip'] as string) ||
    'unknown';

  const key = `${ip}:${req.url}`;
  const now = Date.now();

  // Get or initialize rate limit data
  let data = rateLimitStore.get(key);

  if (!data || now > data.resetAt) {
    // Reset window
    data = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  // Increment count
  data.count++;
  rateLimitStore.set(key, data);

  const remaining = Math.max(0, maxRequests - data.count);
  const allowed = data.count <= maxRequests;

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  return {
    allowed,
    remaining,
    resetAt: data.resetAt,
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit presets for different endpoints
 */
export const RateLimits = {
  // Complaint submission: 5 per 10 minutes
  COMPLAINT_SUBMIT: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
  
  // Chat: 20 per minute
  CHAT: { maxRequests: 20, windowMs: 60 * 1000 },
  
  // Upvote: 10 per minute
  UPVOTE: { maxRequests: 10, windowMs: 60 * 1000 },
  
  // Status update: 10 per minute
  STATUS_UPDATE: { maxRequests: 10, windowMs: 60 * 1000 },
  
  // Read operations: 100 per minute
  READ: { maxRequests: 100, windowMs: 60 * 1000 },
};

/**
 * Apply rate limit to a request
 * Returns null if allowed, or an error response if rate limited
 */
export function rateLimit(
  req: VercelRequest,
  limit: { maxRequests: number; windowMs: number }
): { statusCode: number; body: any } | null {
  const result = checkRateLimit(req, limit.maxRequests, limit.windowMs);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return {
      statusCode: 429,
      body: {
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      },
    };
  }

  return null;
}
