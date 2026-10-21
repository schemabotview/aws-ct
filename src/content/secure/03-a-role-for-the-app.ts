import type { Section } from '../types'

export const aRoleForTheApp: Section = {
  id: 'a-role-for-the-app',
  title: 'A role for the app',
  scene: 'role-trust',
  narration:
    "The app servers need to read products and send order events, and they must do it without a key stored on disk. The answer is a role, and a role is two documents. The file open in the editor is the first: the trust policy, in the policies folder. It has one statement, called AppServersOnly. Its effect is allow, its action is s t s assume role, and its principal is the E C two service. In words: the only thing allowed to become this role is E C two, acting for a server. Not alex, not sam, not another account. In the terminal, the new script infra zero four roles creates the role from that document and prints its A R N, in the production account. It then creates an instance profile with the same name and puts the role inside it, because an instance profile is the container E C two uses to hand a role to a server. The last command reads the trust policy back from I A M, and the principal is the E C two service, as written. The table on the right separates the two questions a role answers. The trust policy asks, who may be me, and names a principal. The permissions policy asks, what may I do, and names actions and resources. For OrderApi, the answer to the first is E C two only. The answer to the second does not exist yet, which the list makes explicit. Trust alone grants nothing. Right now OrderApi can be assumed by a server, and the server can then do nothing at all, because nothing allows anything. That is the right default, and the next two sections build on it: first what assuming the role produces, then the permissions. Next, assuming the role, and the credentials it hands back.",
}
