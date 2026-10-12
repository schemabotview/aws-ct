import type { Section } from '../types'

export const s3AccessPaths: Section = {
  id: 's3-access-paths',
  title: 'S3 buckets, object keys, requests, policies, and controlled upload/download paths',
  scene: 'presigned-upload',
  focus: 'presign-out',
  slide: `## S3 access paths and presigned URLs

**Objective:** direct uploads, tightly limited.

### Mental model
- **Bucket** holds objects; **key** = full name
- Every request is authorised: IAM, bucket policy
- **Presigned URL**: one signed request, for a while

### Worked example: review photos
- API signs a **PUT** to photo-77.jpg for **300 s**
- Browser uploads straight to S3
- **Block Public Access** stays on for the bucket
- Dies at 300 s **or** when the signer's keys expire

### Misconception
- "Uploads need a public bucket" — sign requests

### Explanation summary
- Keep buckets private; grant single requests`,
  narration:
    "Shoppers can attach a photo to a product review, and those bytes should not travel through our app servers. S three can take them directly, without making anything public. First the vocabulary. A bucket holds objects, and an object's key is its full name, such as reviews slash p one thousand and one slash photo seventy seven dot j p g; the slashes are part of the name, not real folders. Every request to S three is authorised, by I A M policies, bucket policies, and the account's block public access settings. The trick is a presigned U R L. Follow the sequence on the left. The browser asks the order A P I for permission to upload. The A P I, whose role is allowed to put objects under reviews, signs a single request: a put to that exact key, for three hundred seconds. The browser then sends the photo straight to S three, which checks the signature, the expiry and the policies. The code on the right really signs such a U R L with placeholder credentials. It prints only the parameter names, because the date and signature change on every run: the algorithm, the credential scope, the expiry of three hundred seconds, a security token, because the signer used temporary credentials, and the signature. That token matters. A presigned U R L stops working at its expiry or when the signing credentials expire, whichever comes first. The misconception is that uploads need a public bucket. They do not; keep every bucket private and grant single, short-lived requests instead.",
}
