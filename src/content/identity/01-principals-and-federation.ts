import type { Section } from '../types'

export const principalsAndFederation: Section = {
  id: 'principals-and-federation',
  title: 'Principals, authentication, federation, and IAM Identity Center',
  scene: 'identity-center-map',
  focus: 'assignments',
  slide: `## Principals and federation

**Objective:** say who is asking, and how they proved it.

### Mental model
- A **principal** makes requests: a user, a role session, a service
- **Authentication** proves who; **authorisation** decides what
- **Federation**: AWS trusts your identity provider's sign-in
- **Identity Center** turns one sign-in into roles in many accounts

### Worked example: the shop's assignments
- Developers → dev as **ShopDeveloper**, prod as **ShopReadOnly**
- Operators → prod as **ShopOperator**
- Each assignment creates an **AWSReservedSSO** role in that account

### Misconception
- "One IAM user per person per account" — keys multiply

### Explanation summary
- People sign in once; accounts see roles`,
  narration:
    "Every request to A W S is made by a principal, and the first question is always who that principal is. A principal can be the root user, an I A M user with long-term credentials, a session of an I A M role holding temporary credentials, or an A W S service acting for you, such as E C two. Two words get confused here. Authentication proves who you are: a password and an M F A code. Authorisation decides what that proven identity may do, and the rest of this chapter is about authorisation. For people, the modern pattern is federation. A W S does not keep its own password for alex; it trusts the sign-in of the shop's workforce identity provider, through I A M Identity Center. Look at the board. Alex and sam live in the identity source, in groups. Identity Center holds assignments, and an assignment is three things: a group, an account, and a permission set, which is a template of policies. Developers get ShopDeveloper in the dev account, but only ShopReadOnly in production. Operators get ShopOperator in production. When you make an assignment, Identity Center creates a real I A M role in that account, named A W S Reserved S S O followed by the permission set's name and a suffix, and attaches the set's policies. So when alex signs in, alex is not an I A M user anywhere; alex becomes a session of one of those roles. The misconception is that every person needs an I A M user in every account. That multiplies long-term keys, and when someone leaves, every one of those keys must be found. With federation, people sign in once, and accounts only ever see roles.",
}
