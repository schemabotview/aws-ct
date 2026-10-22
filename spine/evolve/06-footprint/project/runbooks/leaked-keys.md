# Leaked role credentials

Owner: the on-call operator (Operators group). Escalate to security on step 2.

1. Detect: GuardDuty finding, or a CloudTrail call from an unknown address.
2. Lead: one person runs the incident; one writes the timeline.
3. Contain: put policies/revoke-sessions.json on the role, with the time
   of the first bad call. New sessions keep working; stolen ones stop.
4. Preserve: copy the CloudTrail logs and snapshot affected volumes.
5. Eradicate: find how the credentials leaked, fix it, rotate what they reached.
