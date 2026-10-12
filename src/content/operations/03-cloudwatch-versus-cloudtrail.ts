import type { Section } from '../types'

export const cloudwatchVersusCloudtrail: Section = {
  id: 'cloudwatch-versus-cloudtrail',
  title: 'CloudWatch versus CloudTrail: runtime evidence, API activity, and coverage choices',
  scene: 'cloudtrail-evidence',
  focus: 'coverage',
  slide: `## CloudWatch versus CloudTrail

**Objective:** know which record answers which question.

### Mental model
- **CloudWatch**: how the system behaves — metrics, logs
- **CloudTrail**: who called which API, on what, from where
- Both record only what was **switched on** beforehand

### Worked example: who changed a policy?
- PutBucketPolicy at 18:12:44 by sam (ShopOperator)
- lookup-events finds it by event name
- Event history keeps 90 days of management events
- S3 object reads are data events: off until configured
- An organization trail to S3 keeps them longer

### Misconception
- "CloudTrail logs everything" — data events are off

### Explanation summary
- Decide the questions first, then turn on the evidence`,
  narration:
    "Two services with similar names keep different evidence. CloudWatch records how the system behaves: metrics, and the logs your applications and services send it. CloudTrail records A P I activity: which principal called which operation, on which resource, from which address. Neither can produce evidence for something it was not collecting at the time. Suppose the reports bucket policy changed and someone asks who did it. The card shows the CloudTrail record. Its values are illustrative, but its fields are the real ones: event time eighteen twelve and forty four seconds, event source S three, event name PutBucketPolicy, Region E U west two, and a user identity that is an assumed role, sam's Identity Center session as ShopOperator, from a documentation address. The lookup command beside it, checked against the service model, finds such events by name. Here the collection assumptions matter. CloudTrail event history keeps ninety days of management events in each Region at no extra setup, so this question can be answered. Who read an object in the bucket cannot, unless data events were turned on in a trail or event data store before the read. The table lists the common questions: policy changes from management events, object reads from data events you enable, latency and errors from CloudWatch metrics, application messages from CloudWatch Logs if they were shipped, and a year of history from an organization trail delivering to S three, which you create. The misconception is that CloudTrail logs everything; data events are off by default. So: decide the questions first, then turn on the evidence that answers them.",
}
