import type { Section } from '../types'

export const keysSecretsAndRotation: Section = {
  id: 'keys-secrets-and-rotation',
  title: 'KMS key policies, application encryption, secrets, and rotation dependencies',
  scene: 'keys-and-rotation',
  focus: 'rotation-out',
  slide: `## Keys, secrets and rotation

**Objective:** who can use a key; what rotation can break.

### Mental model
- **Key policy**: every KMS key has one, naming its users
- **Secrets Manager**: stores the DB password and rotates it
- Rotation works only if every **reader** picks it up

### Worked example: rotation at 09:30
- Key policy: account administers, Auditor decrypts
- App read the password once, at start-up, and cached it
- Single-user rotation → new connections: auth failed
- Open connections carry on; only new ones fail
- Fix: re-read the secret on failure, then retry

### Misconception
- "Rotation is a setting" — every client must survive it

### Explanation summary
- Rotate on a schedule, and test the clients' recovery`,
  narration:
    "Encryption in A W S rests on K M S keys, and every key has a key policy that decides who can use it. The card on the left is the policy on the reports key. The first statement lets the production account, one one one one, two two two two, three three three three, administer the key, which is what allows I A M policies in that account to grant access at all. The second lets the Auditor role in the audit account decrypt and describe it, which is why the cross-account reads from the identity chapter also need the key, not just the bucket. Parliament checks the policy's actions and A R Ns. Secrets work alongside keys. The order A P I's database password lives in Secrets Manager, encrypted with a K M S key, and Secrets Manager can rotate it on a schedule. Rotation has dependencies, and the program shows the classic one. At nine o'clock the app reads the password once and caches it. At nine thirty a single-user rotation changes the password in both the database and the secret. Existing connections carry on, but the next new connection uses the cached value and fails authentication. The fix in the program is to re-read the secret once on an authentication failure and retry, and at nine thirty one the connection succeeds. The alternating-users strategy, which switches between two database users, avoids the gap too. The misconception is that rotation is just a setting; it is a change that every client must be built to survive. So: rotate on a schedule, and test that the clients recover.",
}
