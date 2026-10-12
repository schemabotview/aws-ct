import type { Section } from '../types'

export const bootstrapAndSystemsManager: Section = {
  id: 'bootstrap-and-systems-manager',
  title: 'Bootstrap, configuration, Systems Manager access, and patch responsibilities',
  scene: 'bootstrap-and-ssm',
  focus: 'ops',
  slide: `## Bootstrap, Systems Manager and patching

**Objective:** start servers unattended, and operate them without SSH.

### Mental model
- **User data** runs once at first boot
- **Session Manager**: a shell with no open port and no key
- **Patch Manager** applies patches to fleets by tag

### Worked example: an order-api server boots
- Installs Java and the **CloudWatch agent**
- Fetches release 1.4.2 from S3 via its **role**, starts the service
- Operators connect with \`aws ssm start-session\`

### Misconception
- "AWS patches my instances" — on EC2, the OS is yours

### Explanation summary
- Bootstrap from a template; operate through IAM, not keys`,
  narration:
    "A template describes the server; something still has to turn a fresh instance into a working app server. That is the job of user data, a script that runs once, as root, on first boot. Read it top to bottom. It installs the Java runtime and the CloudWatch agent. It copies release one point four point two from the shop's release bucket, and notice there are no credentials in the script: the instance profile's role allows exactly that read. It configures the agent to ship the application's log files to CloudWatch Logs, so we have logs from the first minute. And it starts the service. Every line of this card was checked to parse as bash. Now operations. Traditionally, an operator would open port twenty two and keep an S S H key. Systems Manager removes both. With Session Manager, a w s s s m start session gives a shell through the agent on the instance; the security group needs no inbound rule, there is no key to leak, and access is decided by I A M and recorded. Patching works the same way: send command runs the A W S Run Patch Baseline document against every instance tagged as the order A P I. The list shows what remains ours on E C two: patching the operating system and the Java runtime, preferring to bake a new A M I over fixing servers by hand, keeping the log agent configured, and keeping the instance role narrow. The misconception is that A W S patches your instances. It patches the hosts underneath them; the guest operating system is yours. So bootstrap from a template, and operate through I A M, not keys.",
}
