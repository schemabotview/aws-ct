import type { Section } from '../types'

export const sharedResponsibility: Section = {
  id: 'shared-responsibility',
  title: 'Shared responsibility: infrastructure, configuration, application, and data ownership',
  scene: 'responsibility-matrix',
  focus: 'matrix',
  slide: `## Shared responsibility

**Objective:** for any service, name who owns each layer.

### Mental model
- **AWS:** security **of** the cloud — facilities, hosts
- **You:** security **in** it — config, code, access, data
- The line **moves by service**

### Worked example: the ordering app
- **EC2:** you patch the guest OS and set network rules
- **RDS:** AWS patches the engine in **your** window
- **Lambda:** AWS runs the runtime; the code is yours
- **S3:** no servers — but **who may read** stays yours

### Misconception
- "It's managed, so it's secure" — a public bucket policy is **your** setting

### Explanation summary
- Access and data are **always** yours`,
  narration:
    "Every A W S service splits the work between two owners, and the split is worth knowing before anything goes wrong. A W S is responsible for security of the cloud: the buildings, the hardware, the host operating systems, and the virtualisation layer that runs your instances. You are responsible for security in the cloud: how you configure things, the code you deploy, who you let in, and your data. The important part is that the line moves with the service. Read the matrix for our ordering app. Our app servers run on E C two, which is infrastructure as a service, so we patch the guest operating system, we install the software, and we set the network rules around each instance. The database runs on R D S. There, A W S patches the operating system and the database engine, but it does so in a maintenance window we choose, and the tables and S Q L are still ours. A Lambda function goes further: A W S runs the runtime, and we own the code and its permissions. S three has no servers for us at all. Yet look at the bottom two rows. Who may access the data, and how it is backed up, are ours for every service on the board. The list on the right turns this into incidents. An unpatched operating system on an app server is our problem. A bucket policy that allows public reads is our problem. A failed disk under the database host is A W S's problem. The misconception to avoid is that managed means secure. A managed service runs correctly, but it does exactly what you configured it to do. So the summary is simple: access and data are always yours, and everything else depends on the service you chose.",
}
