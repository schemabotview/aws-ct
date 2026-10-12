import type { Section } from '../types'

export const resourcePoliciesCrossAccount: Section = {
  id: 'resource-policies-cross-account',
  title: 'Resource policies, cross-account access, and service-to-service authorisation',
  scene: 'cross-account-read',
  focus: 'who-must-allow',
  slide: `## Resource policies and cross-account access

**Objective:** say which side must allow.

### Mental model
- A **resource policy** sits on the resource and names a **Principal**
- Same account: one Allow is enough, from either side
- Another account: **both** sides must allow
- Exceptions: role trust and KMS key policies

### Worked example: the auditor reads reports
- Bucket policy in prod names the **Auditor** role
- Auditor's own policy allows the same read
- Remove either one → denied

### Misconception
- "Services are trusted" — S3 → SQS needs a queue policy

### Explanation summary
- Across accounts, both owners must agree`,
  narration:
    "So far every policy was attached to an identity. A resource policy is attached to the resource instead: a bucket policy, a queue policy, a key policy. Because it sits on the resource, it must say who it is talking about, so it has a principal element. Our case: the audit account, seven seven seven seven, eight eight eight eight, nine nine nine nine, has an Auditor role that must read nightly reports from a bucket in production. On the left is the bucket policy in production. It names the Auditor role's A R N and allows get object on the reports. On the right is the Auditor role's own identity policy in the audit account, allowing the same read. Now the table. Within one account, an allow from either side is enough: an identity policy alone, or a resource policy alone. Across accounts, it is different. A W S evaluates the request in both accounts, and both must allow. The bucket owner must name the caller, and the caller's account must permit its principal to make the call. Remove either policy and the auditor is denied. There are exceptions even within one account: a role can only be assumed if its trust policy allows it, and a K M S key is only usable if its key policy permits it. The same idea governs services talking to services. When S three sends event notifications to an S Q S queue, the queue's resource policy must allow the S three service, and it should be scoped to our bucket with a source A R N condition, so that no one else's bucket can use that trust. The misconception is that A W S services are trusted automatically. They are not. Across accounts, and between services, both owners must agree.",
}
