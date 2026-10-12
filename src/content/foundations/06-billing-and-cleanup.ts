import type { Section } from '../types'

export const billingAndCleanup: Section = {
  id: 'billing-and-cleanup',
  title: 'Billing awareness, budgets, resource tags, and cleanup responsibilities',
  scene: 'cost-ledger',
  focus: 'ledger-out',
  slide: `## Billing, budgets, tags and cleanup

**Objective:** predict what a resource costs, even when "off".

### Mental model
- Charges follow **what exists**, not only what runs
- **Tags** (\`Project=shop\`) group cost once activated
- A **budget** alerts; it does not stop spending

### Worked example: the dev month
- Hypothetical rates, 730 h: running **$36.21**
- Stop the instance: −$29.20 → **$7.01** remains
- Volume, Elastic IP, snapshot, objects still exist

### Misconception
- "A budget caps my spend" — data updates up to **3×/day**; alerts lag

### Explanation summary
- Tag on creation, alert early, delete what you no longer need`,
  narration:
    "The last foundation is money, because in the cloud every resource you create is a charge until you delete it. The core rule is that charges follow what exists, not only what is running. Look at the ledger for the shop's development environment. The rates here are hypothetical, chosen to make the arithmetic clear, so check the current pricing pages before you rely on any number. With seven hundred and thirty hours in a month, the running environment costs thirty six dollars and twenty one cents. Now stop the app instance. The compute charge, twenty nine dollars twenty, disappears. But seven dollars and one cent remains, because the thirty gigabyte volume still exists, the Elastic I P is still reserved, the snapshot is still stored, and the product images are still in S three. Stopping is not deleting. To see costs by purpose, we tag resources: project equals shop, environment equals dev, owner equals alex. A tag only appears in cost reports once it is activated as a cost allocation tag, so do that early. Then a budget. Set one for the account, with an alert when actual spending passes eighty percent, and another when the forecast passes one hundred. Here is the misconception. A budget is not a spending cap. Budget data is updated up to three times a day, so an alert can arrive after the money is spent. Budget actions can apply a restrictive policy or stop specific E C two or R D S instances, but they only touch what you configured, and charges like storage keep accruing. So: tag on creation, alert early, and delete what you no longer need. With safe access, a request path, and a ledger, we are ready to make identities and permissions explicit, which is the next chapter.",
}
