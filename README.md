# Next Rate Limit

Update to [next.js Api Route Limiting Example](https://github.com/vercel/next.js/tree/canary/examples/api-routes-rate-limit)

## Installation

```sh
# Using npm
> npm install next-rate-limit
# Using yarn
> yarn add next-rate-limit
# Using pnpm
> pnpm add next-rate-limit
```

## Usage

### Importing

```ts
import rateLimit from 'next-rate-limit';
```

### Examples

```ts
import rateLimit from 'next-rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500 // Max 500 users per minute
});

export function GET(req: NextRequest) {
  try {
    const headers = limiter.checkNext(req, 10);

    return NextResponse.json(
      {
        limit: headers.get('X-RateLimit-Limit'),
        remaining: headers.get('X-RateLimit-Remaining')
      },
      { headers }
    );
  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
}
```

See original [repo linked](https://github.com/vercel/next.js/tree/canary/examples/api-routes-rate-limit) for full example.

## Configuration

### `interval`

> `number`

See [lru-cache ttl](https://github.com/isaacs/node-lru-cache#ttl)

Defaults to `60000` ms (= 1 minute).

### `uniqueTokenPerInterval`

> `number`

See [lru-cache max](https://github.com/isaacs/node-lru-cache#max-read-only)

Defaults to `500`.
