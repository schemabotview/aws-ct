import type { Scene, SceneNode } from '@graphlearning/flow'

// The console, the CLI and the SDKs are clients of the same service APIs: each sends signed HTTPS
// requests to a service endpoint, and each request names one action.
// source: https://docs.aws.amazon.com/general/latest/gr/rande.html
// source: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html
const client = (id: string, label: string, sub: string, icon: string): SceneNode => ({ id, label, sub, icon, pattern: 'user' })

export const api: Scene = {
  id: 'api-everywhere',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'clients-path',
      label: 'Three clients, one API',
      bare: true,
      children: [
        {
          id: 'clients',
          label: 'Clients',
          bare: true,
          flow: 'LR',
          children: [
            client('console', 'Console', 'web pages that call the API', 'globe'),
            client('cli', 'AWS CLI', 'a command per call', 'terminal'),
            client('sdk', 'SDK — boto3', 'calls from your own code', 'python'),
          ],
        },
        { id: 'endpoint', label: 'Service endpoint', sub: 's3.eu-west-2.amazonaws.com', icon: 'globe', pattern: 'network' },
        { id: 'service', label: 'Amazon S3', sub: 'checks the signature, the permission, then acts', icon: 's3', pattern: 'storage' },
      ],
      edges: [
        { source: 'clients', target: 'endpoint', label: 'signed HTTPS request' },
        { source: 'endpoint', target: 'service', label: 'HeadObject' },
      ],
    },
    {
      id: 'same',
      label: 'The same call',
      bare: true,
      children: [
        { id: 'call-cli', kind: 'code', filename: 'head-object.sh · model-checked', label: 'aws s3api head-object \\\n  --bucket shop-catalog-111122223333 \\\n  --key products/p-1001.json' },
        { id: 'call-sdk', kind: 'code', filename: 'head_object.py · illustrative', label: 'import boto3\n\ns3 = boto3.client("s3")\ns3.head_object(Bucket="shop-catalog-111122223333",\n               Key="products/p-1001.json")' },
        {
          id: 'which',
          kind: 'table',
          label: 'Which client, when',
          headers: ['client', 'in this course'],
          values: [
            ['console', 'to look, never to build'],
            ['CLI', 'infra/*.sh, Courses 3 to 6'],
            ['SDK', 'the app, the tools, the functions'],
            ['templates', 'CloudFormation, from Course 7'],
          ],
        },
        {
          id: 'every-call',
          kind: 'list',
          icon: 'scroll',
          label: 'Every call, whichever client',
          pattern: 'network',
          items: ['Names one action on one resource, in one Region', 'Is signed by an identity — Course 4', 'Can be recorded by CloudTrail — Course 12', 'Counts against the account’s quotas'],
        },
      ],
    },
  ],
  edges: [],
}
