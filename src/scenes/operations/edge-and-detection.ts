import type { Scene } from '@graphlearning/flow'

// §10.6 — layered controls, each placed as prevention or detection. WAF (validated CreateWebACL:
// a per-IP rate limit plus AWS's common managed rules) blocks requests; Shield Standard protects
// against common network-layer DDoS automatically; GuardDuty and Security Hub DETECT and report —
// they block nothing on their own.
// source: https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html
// source: https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html
export const edgeAndDetection: Scene = {
  id: 'edge-and-detection',
  title: 'Prevent at the edge, detect everywhere',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'waf',
      kind: 'code',
      filename: 'wafv2.CreateWebACL.request.json · model-checked',
      hug: true,
      label: `{
  "Name": "shop-web",
  "Scope": "REGIONAL",
  "DefaultAction": { "Allow": {} },
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "shop-web"
  },
  "Rules": [{
    "Name": "limit-per-ip",
    "Priority": 0,
    "Action": { "Block": {} },
    "Statement": { "RateBasedStatement": {
      "Limit": 1000, "AggregateKeyType": "IP" } },
    "VisibilityConfig": {
      "SampledRequestsEnabled": true,
      "CloudWatchMetricsEnabled": true,
      "MetricName": "limit-per-ip" }
  }, {
    "Name": "aws-common",
    "Priority": 1,
    "OverrideAction": { "None": {} },
    "Statement": { "ManagedRuleGroupStatement": {
      "VendorName": "AWS",
      "Name": "AWSManagedRulesCommonRuleSet" } },
    "VisibilityConfig": {
      "SampledRequestsEnabled": true,
      "CloudWatchMetricsEnabled": true,
      "MetricName": "aws-common" }
  }]
}`,
    },
    {
      id: 'layers',
      kind: 'table',
      label: 'Prevents or detects?',
      sub: 'a detector without a responder is a log',
      headers: ['service', 'does', 'acts?'],
      values: [
        ['WAF', 'filters HTTP requests', 'blocks'],
        ['Shield Standard', 'absorbs common DDoS', 'automatic'],
        ['GuardDuty', 'finds threats in logs', 'reports'],
        ['Security Hub', 'collects findings, checks', 'reports'],
        ['Config rules', 'flags drifted settings', 'reports'],
      ],
    },
  ],
  edges: [],
}
