import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// WAF filters HTTP requests at CloudFront, an ALB or API Gateway (managed rule groups, rate-based
// rules); Shield Standard protects every account against common network DDoS, Shield Advanced adds
// response support and cost protection; GuardDuty analyses CloudTrail, VPC Flow Logs and DNS logs
// for threats; Security Hub aggregates findings and checks against standards.
// source: https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html
// source: https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html
// source: https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html
// source: https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html
export const exposure: Scene = mapFrame('edge-and-detection', [...BUILT_BY[11], 'watch', 'trail', 'keys', 'waf'], {
  id: 'exposure-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'layers',
      kind: 'table',
      label: 'Layers between the internet and an order',
      headers: ['layer', 'service', 'prevents or detects'],
      values: [
        ['network floods', 'Shield Standard, always on', 'prevents'],
        ['bad HTTP requests', 'WAF web ACL shop-web', 'prevents'],
        ['who may reach what', 'security groups (Course 5)', 'prevents'],
        ['who may call what', 'IAM, SCPs (Course 4)', 'prevents'],
        ['credentials used oddly', 'GuardDuty', 'detects'],
        ['all findings, one place', 'Security Hub', 'detects'],
      ],
    },
    {
      id: 'web-acl',
      kind: 'table',
      label: 'Web ACL shop-web, on the load balancer',
      headers: ['rule', 'does'],
      values: [
        ['AWSManagedRulesCommonRuleSet', 'blocks common exploits (OWASP-style)'],
        ['rate 1,000 per 5 min per IP', 'blocks one address flooding checkout'],
        ['default', 'allow'],
      ],
    },
    {
      id: 'detect-lesson',
      kind: 'list',
      icon: 'guardduty',
      label: 'Prevention fails quietly; detection must not',
      pattern: 'warn',
      items: [
        'Every preventing layer can be misconfigured or bypassed',
        'A detector is only useful if a finding reaches a person: route it to ops-pager',
        'GuardDuty found Section 7’s leaked keys before anyone noticed',
      ],
    },
  ],
})
