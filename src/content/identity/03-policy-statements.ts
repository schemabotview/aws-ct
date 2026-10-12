import type { Section } from '../types'

export const policyStatements: Section = {
  id: 'policy-statements',
  title: 'Policy statements: actions, resources, effects, and conditions',
  scene: 'policy-anatomy',
  focus: 'policy',
  slide: `## Reading a policy statement

**Objective:** read any statement as four answers.

### Mental model
- **Effect** — Allow or Deny
- **Action** — API calls, as \`service:Operation\`
- **Resource** — the ARNs it covers; \`*\` matches any characters
- **Condition** — extra tests on the request

### Worked example: listing products
- **ReadProducts:** GetObject on objects under products/
- **ListProducts:** ListBucket on the **bucket** ARN, prefix products/
- **SendOrderEvents:** one action on one queue

### Misconception
- "s3:* on the bucket covers its objects" — objects have their own ARNs: bucket/*

### Explanation summary
- Match all four, or the statement does not apply`,
  narration:
    "Now let's read a policy properly, because every permission in A W S comes down to statements like these. Each statement answers four questions. Effect: is this an allow or a deny? Action: which A P I calls, written as the service prefix, a colon, and the operation name, like s three get object. Resource: which resources, named by A R N, where a star matches any run of characters. And condition: an optional extra test on the request itself. Here is the order A P I's policy after one change. The app now lists the products in the catalogue, so it needs a second statement. Read them in turn. ReadProducts allows get object on every object whose key starts with products slash. ListProducts allows list bucket, and notice its resource: it is the bucket's own A R N, with no slash and no star, because listing is an action on the bucket, not on an object. Its condition narrows it further: the request's prefix must start with products. SendOrderEvents allows one action on one queue. That difference between the bucket and its objects is the classic mistake. Granting s three star on the bucket's A R N does not reach the objects inside it; objects have their own A R Ns, the bucket name followed by slash and the key, and an object action needs a resource that matches them. So a statement applies to a request only when the action, the resource and every condition all match, and then its effect counts.",
}
