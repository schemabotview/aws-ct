import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { filesTree } from './tree'
import code from '../../../spine/files/03-presigned/project/tools/presign_upload.py?raw'
import session from '../../../spine/files/03-presigned/session.txt?raw'

// A presigned URL carries a SigV4 signature in its query string; anyone holding it can make that one
// request until it expires, with the signer's permissions. The URL here is really signed by boto3;
// the emulator accepts the PUT. Expiry is at most 7 days for an IAM user, and no longer than the
// credentials that signed it.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html
export const presign: Scene = ideFrame(
  'presigned-upload',
  'shop-on-aws',
  filesTree('03', 'tools/presign_upload.py', ['tools/presign_upload.py']),
  { file: 'tools/presign_upload.py', code, show: [[10, 26]], highlight: [11, 12, 13, 21, 22, 23], terminal: session },
  {
    id: 'presign-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'steps',
        kind: 'table',
        label: 'A review photo, in four steps',
        headers: ['', 'step'],
        values: [
          ['1', 'browser asks the app'],
          ['2', 'app signs one PUT URL'],
          ['3', 'browser PUTs to S3'],
          ['4', 'S3 checks the signature'],
        ],
      },
      {
        id: 'presign-facts',
        kind: 'list',
        icon: 'key',
        label: 'What the URL carries',
        pattern: 'warn',
        items: [
          'One method, one key, one type',
          'The signer’s permission, borrowed',
          'An expiry: 300 seconds here',
          'No key or secret, only a signature',
        ],
      },
    ],
  },
)
