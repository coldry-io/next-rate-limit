import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000
  });

  return {
    checkNext: (req: NextRequest, limit: number) => {
      const headers: Headers = new Headers();
      const token =
        req.ip ||
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        req.headers.get('x-client-ip') ||
        '127.0.0.1';
      const tokenCount = (tokenCache.get(token) as number[]) || [0];

      if (tokenCount[0] === 0) tokenCache.set(token, tokenCount);

      tokenCount[0] += 1;

      const currentUsage = tokenCount[0] ?? 0;
      const isRateLimited = currentUsage >= limit;
      headers.set('X-RateLimit-Limit', limit.toString());
      headers.set('X-RateLimit-Remaining', isRateLimited ? '0' : (limit - currentUsage).toString());

      if (isRateLimited) throw new Error('Rate limit exceeded');

      return headers;
    }
  };
}
