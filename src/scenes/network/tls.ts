import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// TLS terminates where the certificate is: the ALB's HTTPS listener, with an ACM certificate in the
// LB's own Region and a TLS 1.3 security policy. Behind it the shop sends plain HTTP inside the VPC;
// RDS supports TLS on connections. CloudFront needs its certificate in us-east-1. ACM renews
// DNS-validated certificates automatically.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/describe-ssl-policies.html
// source: https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html
export const tls: Scene = mapFrame('tls-path', [...BUILT_BY[4], 'dns'], {
  id: 'tls-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'hops',
      kind: 'table',
      label: 'Encryption, hop by hop',
      headers: ['hop', 'protocol', 'certificate', 'who can read it'],
      values: [
        ['shopper → ALB', 'HTTPS, TLS 1.3', 'ACM, shop.example.com', 'nobody on the way'],
        ['ALB → app server', 'HTTP, port 8080', 'none', 'anything inside the VPC path'],
        ['app → orders DB', 'PostgreSQL over TLS', 'the RDS CA', 'nobody on the way'],
      ],
    },
    {
      id: 'listener',
      kind: 'table',
      label: 'The HTTPS listener',
      headers: ['setting', 'value'],
      values: [
        ['port', '443'],
        ['certificate', 'ACM, requested in eu-west-2'],
        ['validation', 'a DNS record in example.com; renewed automatically'],
        ['security policy', 'ELBSecurityPolicy-TLS13-1-2-2021-06'],
      ],
    },
    {
      id: 'tls-rules',
      kind: 'list',
      icon: 'lock',
      label: 'What TLS does and does not mean',
      pattern: 'warn',
      items: [
        'Encryption ends where the certificate is: here, at the ALB',
        'Reaching the server is not the same as the path being encrypted',
        'A load balancer’s certificate lives in its own Region; CloudFront’s in us-east-1',
        'Encrypting the last hop too is a choice with a cost: certificates on every server',
      ],
    },
  ],
})
