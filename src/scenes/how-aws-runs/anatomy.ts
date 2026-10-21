import type { Scene } from '@graphlearning/flow'
import { mapFrame } from '../map'
import session from '../../../spine/how-aws-runs/04-anatomy/session.txt?raw'

// One HeadObject, replayed against the emulator (scripts/spine.py): the CLI's answer, then the same
// call through boto3 with a before-send hook printing the request's parts. The catalog bucket is lit
// on the map although the shop builds it in Course 3: this demo creates it in its own setup.
export const anatomy: Scene = mapFrame('request-anatomy', ['buckets'], {
  id: 'anatomy-side',
  label: 'side',
  bare: true,
  children: [
    { id: 'anatomy-run', kind: 'terminal', filename: 'Terminal — how-aws-runs · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'parts',
      kind: 'table',
      label: 'One request, six parts',
      headers: ['part', 'in this request'],
      values: [
        ['endpoint', 's3, in eu-west-2'],
        ['action', 'HeadObject, an HTTP HEAD'],
        ['resource', 'bucket shop-catalog-…, key products/p-1001.json'],
        ['identity', 'access key AKIAIOSFODNN7EXAMPLE'],
        ['scope', 'the day, the Region, the service'],
        ['signature', 'HMAC of the request with the secret key'],
      ],
    },
  ],
})
