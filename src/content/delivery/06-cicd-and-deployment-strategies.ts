import type { Section } from '../types'

export const cicdAndDeploymentStrategies: Section = {
  id: 'cicd-and-deployment-strategies',
  title: 'CI/CD artefacts, deployment identities, and rolling/blue-green/canary strategies',
  scene: 'deployment-strategies',
  focus: 'strategy-out',
  slide: `## CI/CD and deployment strategies

**Objective:** limit how many requests meet a bad release.

### Mental model
- **Build** an artefact once; **deploy** it with a pipeline role
- **Blue/green**: run the new version beside the old, shift traffic
- **Canary / linear**: shift a slice first; alarms roll back

### Worked example: 1.5.0 fails 2% of requests
- All at once: **1,344** failed before rollback
- Linear 10%/min: **202** · canary 10%: **134**
- Blue stays warm, so rollback is a traffic switch
- The pipeline deploys with **its own role**, not a person's

### Misconception
- "Test well and deploy all at once" — production finds what tests miss

### Explanation summary
- Shift gradually, watch alarms, keep the old version ready`,
  narration:
    "Infrastructure is one half of delivery; releasing new application versions is the other. A pipeline builds an artefact once, here a container image, and deploys it using its own role, never a person's credentials, so every change is attributable and repeatable. How the new version meets traffic is a strategy. With blue green, the new version, green, runs beside the old one, blue, and the load balancer shifts traffic between them. Canary shifts a small slice first and the rest later; linear shifts in equal steps. Combined with an alarm on errors, each limits how much traffic a bad release can reach. The program puts numbers on it. Version one point five point zero, unknown to us, fails two percent of requests. An error alarm fires two minutes into the deployment and triggers a rollback. At five hundred and sixty requests a second, shifting everything at once fails one thousand three hundred and forty four requests before the rollback. Linear, ten percent every minute, fails two hundred and two. A ten percent canary fails one hundred and thirty four. And because blue was never stopped, rollback is just moving traffic back. The command starts such a deployment with CodeDeploy, using the predefined configuration that shifts ten percent every minute. The misconception is that good testing makes an all at once deployment safe. Production traffic finds what tests miss. Shift gradually, watch the alarms, and keep the old version ready.",
}
