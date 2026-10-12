import type { Section } from '../types'

export const regionsAndAvailabilityZones: Section = {
  id: 'regions-and-availability-zones',
  title: 'Regions, Availability Zones, global services, and failure boundaries',
  scene: 'region-boundaries',
  focus: 'region',
  slide: `## Regions and failure boundaries

**Objective:** place each part; say what survives.

### Mental model
- **Region** — a geographic area: eu-west-2, London
- **Availability Zone** — isolated data centres; **three** here
- **Regional** services span AZs (S3); **zonal** ones live in one
- **Global** services: IAM, Route 53, CloudFront

### Worked example: surviving an AZ
- The peak needs **4** app servers
- One per AZ = **3**; lose an AZ → **2** remain ✗
- Two per AZ = **6**; lose an AZ → **4** remain ✓

### Misconception
- "Multi-AZ means unstoppable" — a Region fault or bad deploy hits every AZ

### Explanation summary
- Survive a chosen boundary; pay for its spare`,
  narration:
    "Every resource you create lives somewhere, and where it lives decides what can take it down. A Region is a geographic area with its own copy of the services and its own endpoints. Our shop runs in E U west two, which is London. Inside a Region are Availability Zones, groups of data centres with separate power, cooling and networking, close enough for fast links but far enough apart that one local failure should not reach the others. E U west two has three. One small trap: the names A, B and C can point at different physical zones in different accounts in some Regions, so when accounts must agree, they compare zone I Ds instead. Now place the parts of our app. An app server is zonal; it lives in exactly one zone. An S three bucket is Regional; A W S spreads it across zones for us. Our single orders database is placed in one zone, which matters later. And some services are global, outside any one Region: I A M, Route fifty three, and CloudFront. Now the arithmetic. At the evening peak we need four app servers. If we run one per zone, that is three, which is already short, and if a zone fails only two remain. If we run two per zone, that is six. Lose a zone and four remain, which carries the peak. Those two extra servers are the price of surviving a zone failure, and you pay it every hour. The misconception is that multi A Z makes you unstoppable. A Region-wide problem, a bad deployment, or deleted data reaches every zone at once. So decide which boundary you must survive, and pay for exactly the spare capacity that survival needs.",
}
