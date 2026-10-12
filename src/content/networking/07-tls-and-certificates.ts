import type { Section } from '../types'

export const tlsAndCertificates: Section = {
  id: 'tls-and-certificates',
  title: 'TLS, certificates, termination points, and encryption along the path',
  scene: 'tls-path',
  focus: 'path',
  slide: `## TLS along the path

**Objective:** say which hops are encrypted, and where TLS ends.

### Mental model
- **TLS** encrypts a hop and proves the server's name with a **certificate**
- **ACM** issues and renews certificates for AWS endpoints
- **Termination**: where TLS ends and plain traffic may begin

### Worked example: the shop's hops
- Browser → ALB: TLS 1.3, ACM cert, in **eu-west-2**
- ALB → app: plain **HTTP** unless the target group uses HTTPS
- App → DB: TLS only if the client **requires** it

### Misconception
- "Inside the VPC it's encrypted anyway" — reachable is not encrypted

### Explanation summary
- Decide each hop; record where TLS terminates`,
  narration:
    "So far we have made the request reachable. That says nothing about whether anyone on the path can read it. T L S does two jobs on a single hop: it encrypts the traffic, and, with a certificate, it proves that the server really is shop dot example dot com. A W S Certificate Manager, A C M, issues certificates for A W S endpoints and renews them automatically once the domain is validated, here through D N S. Look at the path. The browser's connection uses T L S one point three and ends at the load balancer. That is the termination point. The commands request the certificate and attach it to an H T T P S listener on port four four three with a T L S one point three security policy. The certificate must live in the load balancer's own Region, E U west two; CloudFront, by contrast, only uses certificates from U S east one. After the load balancer, the request travels to the app server on port eight zero eight zero, and unless the target group is set to H T T P S, that hop is plain H T T P inside the V P C. The database hop is encrypted only if the application's database client requires T L S. The table makes each hop a separate decision. The misconception is that traffic inside a V P C is encrypted anyway. Being able to reach something tells you nothing about encryption. So decide each hop explicitly, and write down where T L S terminates.",
}
