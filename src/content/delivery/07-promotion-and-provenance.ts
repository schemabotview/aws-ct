import type { Section } from '../types'

export const promotionAndProvenance: Section = {
  id: 'promotion-and-provenance',
  title: 'Environment promotion, provenance, and CloudFormation/CDK/Terraform boundaries',
  scene: 'promotion-and-tools',
  focus: 'path',
  slide: `## Promotion, provenance and tool choices

**Objective:** move one artefact from dev to prod with separate identities.

### Mental model
- **Promote** the same artefact; never rebuild for production
- **Provenance**: which commit built which digest, recorded
- Each environment's deploy role trusts **only** the pipeline

### Worked example: commit 9f3c2e1
- Built once; the same **image digest** to dev, then prod
- Prod's deploy role trusts only **ShopPipeline**
- People in Developers cannot deploy to prod at all

### Misconception
- "Rebuild for prod, it's the same code" — builds aren't repeatable

### Explanation summary
- Build once, record it, promote it with narrow roles`,
  narration:
    "The last step is getting a change from development to production without letting anything slip in between. The rule is to promote the artefact, not the build. Commit nine f three c two e one is built once into an image with a fixed digest, a hash of its exact contents. That same digest is deployed to dev, tested, and then deployed to prod. Rebuilding for production would pull dependencies again and could produce a different image from the same code. Provenance is the record that links them: which commit, which build, which digest, deployed where and when. Identities are separated too. The pipeline runs in the development account with its own role. In production, a deploy role trusts only that pipeline role, and the trust policy on the board, checked against the I A M reference, says exactly that. The Developers group from chapter two has read only access in production, so no person deploys there directly; every change to production arrives through the pipeline. Finally, the tools. CloudFormation, which we used, takes Y A M L or J S O N. The A W S C D K lets you write the same stacks in a programming language and synthesises CloudFormation from them. Terraform uses its own language and keeps its state in a file you must store and protect. Each is a reasonable choice; mixing them for the same resources is not. The misconception is that rebuilding for production is harmless because the code is the same. Builds are not perfectly repeatable. Build once, record it, and promote it with narrow roles. Reproducibility supports operations but does not establish health; next we connect telemetry, incident response, and recovery evidence.",
}
