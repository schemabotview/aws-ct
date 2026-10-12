import type { Section } from '../types'

export const apiRequestWalkthrough: Section = {
  id: 'api-request-walkthrough',
  title: 'Console, CLI, SDK, APIs, ARNs, and an annotated request-to-response walkthrough',
  scene: 'api-call-anatomy',
  focus: 'cli',
  slide: `## One API call, request to response

**Objective:** read any call: who, where, what.

### Mental model
- Console, CLI, SDKs: the same signed **API** calls
- **Who** = credentials · **where** = Region · **what** = resource
- An **ARN** names a resource; some omit Region or account
- S3 bucket ARNs carry **no Region and no account**

### Worked example: is p-1001's JSON there?
- \`head-object\`: metadata only, no body
- Signed, sent to the London endpoint
- IAM must allow \`s3:GetObject\` on the object
- 200 OK: 1,834 bytes of JSON, encrypted at rest

### Misconception
- "The console is separate" — same **APIs**, same checks

### Explanation summary
- Who, where, what, action → response or error`,
  narration:
    "Whether you click in the console, type in the C L I, or call an S D K from code, the same thing happens underneath: a signed H T T P S request to an A W S service A P I. Learn to read one, and you can read them all. Take this command. It asks S three, using head object, whether the product file for p one thousand and one exists, and for its metadata, without downloading the body. Read it in three parts. Who: the shop dev profile, which supplies the temporary credentials from our last section. Where: the Region, E U west two, which selects the London endpoint. What: one key in one bucket. Now follow the list. The C L I finds the credentials for the profile. It signs the request with Signature Version four, which binds the signature to the key, the Region and the service. The request travels over H T T P S to the Regional S three endpoint. There, I A M checks whether this identity is allowed the action s three get object on that object's A R N. Head object needs the same permission as reading the object. If it is allowed, we get two hundred O K with headers only: one thousand eight hundred and thirty four bytes, J S O N, and encrypted at rest, which S three does by default for new objects. Notice the A R N shapes on the right. An A R N names a resource exactly, but not every A R N carries every field. S three bucket names are global, so their A R Ns have no Region and no account. I A M is global, so its A R Ns have no Region. A DynamoDB table carries both. The misconception is that the console is a separate system. It calls the same A P Is, under the same permission checks. So every call reduces to identity, Region, resource and action, and the answer is a response or an error that tells you which of the four went wrong.",
}
