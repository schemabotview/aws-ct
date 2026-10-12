import type { Section } from '../types'

export const cloudfrontAndCaching: Section = {
  id: 'cloudfront-and-caching',
  title: 'CloudFront and caching: edge delivery, origins, access controls, and freshness',
  scene: 'edge-caching',
  focus: 'edge-out',
  slide: `## CloudFront and edge caching

**Objective:** shorten the path; keep cached copies correct.

### Mental model
- **Edge location**: a CloudFront site near the shopper
- **Origin**: where a miss is fetched — the ALB, or S3
- **Cache key**: what makes two requests the same object

### Worked example: Sydney (assumed RTTs)
- Direct 952 ms; edge hit 38 ms; edge miss 428 ms
- At a 90% hit ratio: 77 ms on average
- Cache key: path + lang only; cookies left out
- TTL 60 s or invalidation; S3 images behind OAC

### Misconception
- "Caching is free speed" — a wrong key serves wrong data

### Explanation summary
- Cache shared content, key it narrowly, bound staleness`,
  narration:
    "The first optimisation is distance. CloudFront serves content from edge locations near the shopper. On a miss, the edge fetches from the origin, which for the shop is the load balancer in E U west two, or an S three bucket for images. Whether two requests can share one cached copy is decided by the cache key. The program models a shopper in Sydney, with assumed round trip times: two hundred and eighty milliseconds to London, twelve to a nearby edge. Opening a connection, the T L S handshake and the request each take a round trip. Going directly to London costs nine hundred and fifty two milliseconds. An edge hit costs thirty eight. A miss costs four hundred and twenty eight, still less than direct, because the edge keeps a warm connection to the origin. So the average depends on the hit ratio: two hundred and thirty three milliseconds at fifty percent, seventy seven at ninety percent, forty six at ninety eight. The hit ratio depends on the cache key. The cache policy request, validated against the CloudFront service model, keys product pages on the path and the lang query string only, with no headers or cookies, and a default T T L of sixty seconds. The table contrasts the choices. Keying on path and language gives three copies per product and a high hit ratio; adding every cookie gives one copy per shopper and almost no hits. A sixty second T T L means a new price appears within a minute; an invalidation removes a copy now, and the next request misses; versioned file names allow long T T Ls that are never stale. Access control matters too: the image bucket stays private, readable only by CloudFront through origin access control. The misconception is that caching is free speed; a wrong key or T T L serves the wrong data. So: cache what is shared, key it narrowly, and bound how stale it can be.",
}
