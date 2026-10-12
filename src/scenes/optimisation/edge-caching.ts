import type { Scene } from '@graphlearning/flow'

// §11.2 — edge caching for a shopper far from eu-west-2: a latency model with ASSUMED round-trip
// times (runs locally), the product-page cache policy (CreateCachePolicy request validated in full:
// path + lang only, TTL 60 s), and the cache-key / freshness contrasts. Images stay private behind
// Origin Access Control.
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
export const edgeCaching: Scene = {
  id: 'edge-caching',
  title: 'Most requests never reach London',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'edge',
      kind: 'code',
      filename: 'edge_latency.py · runs locally',
      hug: true,
      label: `RTT_LONDON, RTT_EDGE = 280, 12   # ms from a shopper in Sydney (assumed)
APP = 112                        # ms: the origin's p50 (Ch. 10)


def page(rtt, server_ms):        # TCP + TLS 1.3 + the request: 3 round trips
    return 3 * rtt + server_ms


direct = page(RTT_LONDON, APP)
hit = page(RTT_EDGE, 2)                      # answered from the edge cache
miss = page(RTT_EDGE, RTT_LONDON + APP)      # edge reuses a warm origin link
print(f"direct to eu-west-2:  {direct:>4} ms")
print(f"edge, cache hit:      {hit:>4} ms")
print(f"edge, cache miss:     {miss:>4} ms")
for ratio in (0.5, 0.9, 0.98):
    mean = ratio * hit + (1 - ratio) * miss
    print(f"hit ratio {ratio:>4.0%}:      {mean:>4.0f} ms on average")`,
    },
    {
      id: 'sydney',
      label: 'A shopper in Sydney, and the cache key',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'edge-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `direct to eu-west-2:   952 ms
edge, cache hit:        38 ms
edge, cache miss:      428 ms
hit ratio  50%:       233 ms on average
hit ratio  90%:        77 ms on average
hit ratio  98%:        46 ms on average`,
        },
        {
          id: 'contrasts',
          kind: 'table',
          label: 'Cache key and freshness',
          sub: 'what each choice costs',
          headers: ['choice', 'effect'],
          values: [
            ['key: path + lang', '3 copies per product, high hit ratio'],
            ['key: + every cookie', 'one copy per shopper, few hits'],
            ['TTL 60 s', 'a new price shows within a minute'],
            ['invalidation', 'removed now; next request misses'],
            ['versioned file names', 'long TTL, never stale'],
          ],
        },
      ],
    },
    {
      id: 'policy',
      kind: 'code',
      filename: 'cloudfront.CreateCachePolicy.request.json · model-checked',
      hug: true,
      label: `{
  "CachePolicyConfig": {
    "Name": "product-pages",
    "MinTTL": 0, "DefaultTTL": 60, "MaxTTL": 300,
    "ParametersInCacheKeyAndForwardedToOrigin": {
      "EnableAcceptEncodingGzip": true,
      "EnableAcceptEncodingBrotli": true,
      "HeadersConfig": { "HeaderBehavior": "none" },
      "CookiesConfig": { "CookieBehavior": "none" },
      "QueryStringsConfig": {
        "QueryStringBehavior": "whitelist",
        "QueryStrings": { "Quantity": 1, "Items": ["lang"] }
      }
    }
  }
}`,
    },
  ],
  edges: [],
}
