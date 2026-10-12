import type { Section } from '../types'

export const layeredExposureAndDetection: Section = {
  id: 'layered-exposure-and-detection',
  title: 'WAF, Shield, GuardDuty, Security Hub, and layered exposure/detection choices',
  scene: 'edge-and-detection',
  focus: 'layers',
  slide: `## Prevent, then detect

**Objective:** place each security service as a guard or an alarm.

### Mental model
- **Prevention** stops a request before it does harm
- **Detection** notices harm, or risk, and reports it
- Each layer covers gaps the others leave

### Worked example: shop-web
- WAF rule 1: block any IP over 1,000 requests
- WAF rule 2: AWS managed rules, known attacks
- Shield Standard: common DDoS, automatic
- GuardDuty, Security Hub: findings to act on

### Misconception
- "GuardDuty protects us" — it detects, blocks nothing

### Explanation summary
- Pair every detector with someone, or something, that responds`,
  narration:
    "Security services fall into two groups, and it matters which is which. Prevention stops a request before it can do harm. Detection notices harm or risk afterwards and reports it. A sound design layers both, because each layer covers gaps the others leave. The card is a web A C L for the shop's load balancer, a CreateWebACL request validated in full against the WAF service model. Its default action allows traffic. The first rule is rate-based: any single I P address that sends more than one thousand requests in the evaluation window is blocked. The second rule applies A W S's common managed rule group, which blocks well known attack patterns. Each rule publishes CloudWatch metrics and sampled requests, so you can see what it blocked. Shield Standard protects every A W S customer against common network-layer denial of service attacks automatically. The table places the rest. WAF filters H T T P requests and blocks them. Shield Standard absorbs common attacks without any configuration. GuardDuty analyses CloudTrail, V P C flow logs and D N S logs for threats, and reports findings. Security Hub collects findings and checks them against standards, and reports. Config rules flag drifted settings, and report. The misconception is that turning on GuardDuty protects the account. It detects; on its own it blocks nothing. So: pair every detector with someone, or something, that responds.",
}
