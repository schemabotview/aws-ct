import type { Section } from '../types'

export const rolesAndTrust: Section = {
  id: 'roles-and-trust',
  title: 'IAM roles, trust policies, STS, and temporary workload credentials',
  scene: 'order-api-role',
  focus: 'trust',
  slide: `## Roles and temporary credentials

**Objective:** workload access with no stored key.

### Mental model
- A **role** is an identity anyone trusted can **become**
- **Trust policy:** who may assume it — the role's front door
- **Permissions policy:** what a session may then do
- **STS** issues temporary keys: 1 h by default, up to 12 h

### Worked example: the order API's role
- Trust: only **ec2.amazonaws.com** may assume OrderApi
- Permissions: read catalogue objects, send order events
- An **instance profile** hands the role to the app servers

### Misconception
- "The trust policy grants access" — it only says who may enter

### Explanation summary
- Two policies: who may become it, and what it may do`,
  narration:
    "People are not the only principals. The order A P I running on our app servers also needs to call A W S: it reads product files from S three and sends order events to a queue. The wrong way is to put an access key in a configuration file on the server. The right way is a role. A role is an identity with no password and no key of its own; instead, principals that the role trusts can become it for a while. Every role has two policies, and the board shows both. On the left is the trust policy, the role's front door. It says that only the E C two service, e c two dot amazon a w s dot com, may call s t s assume role on it. On the right is the permissions policy, which says what a session of the role may do: get objects from the catalogue bucket, and send messages to the order events queue. The commands below create the role from those two files, then wrap it in an instance profile, which is how a role is attached to E C two instances. On the server, E C two assumes the role, the instance metadata service version two serves the temporary keys, and the S D K finds them without a single key in our code. The Security Token Service issues these keys, and they expire; an assume role session lasts one hour by default and at most twelve, and on an instance fresh keys arrive before the old ones expire. The misconception is that the trust policy grants access. It does not. It only says who may walk through the front door; what they can do inside is decided by the permissions policy. A role is two policies: who may become it, and what it may then do.",
}
