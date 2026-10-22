import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/evolve/02-cdn/session.txt?raw'

// CloudFront caches at edge locations; the cache key is what makes two requests the same object
// (here path + the lang query string); TTLs bound freshness; cache policies are the current way
// to configure keys and TTLs (moto supports only the legacy ForwardedValues settings used here);
// invalidations remove objects early. Round-trip times are assumptions (labelled model).
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-the-cache-key.html
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html
export const cdn: Scene = mapFrame('edge-caching', [...BUILT_BY[12], 'cdn'], {
  id: 'cdn-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'cdn-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'cache-key',
      kind: 'table',
      label: 'What makes two requests the same page',
      headers: ['part of the request', 'in the cache key?', 'why'],
      values: [
        ['path /products/p-1001', 'yes', 'a different product is a different page'],
        ['?lang=fr', 'yes', 'the page is translated'],
        ['?utm_source=…', 'no', 'tracking would split the cache'],
        ['cookies', 'no', 'a cart must never be cached'],
      ],
    },
    {
      id: 'fresh',
      kind: 'list',
      icon: 'cloudfront',
      label: 'Freshness',
      pattern: 'network',
      items: [
        'Default TTL 60 s, max 300 s: a price change shows within a minute',
        'An urgent change: an invalidation of /products/p-1001',
        'Checkout and the cart are never cached: they go to the origin',
      ],
    },
  ],
})
