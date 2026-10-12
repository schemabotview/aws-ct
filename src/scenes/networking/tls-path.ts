import type { Scene } from '@graphlearning/flow'

// §3.7 — encryption hop by hop. TLS from the browser terminates at the load balancer, using an ACM
// certificate for shop.example.com in eu-west-2 (an ALB uses a certificate from its own Region;
// CloudFront requires one from us-east-1). The ALB → app hop is plain HTTP inside the VPC unless the
// target group uses HTTPS; the app → database hop is TLS only if the client requires it.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
// source: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html
export const tlsPath: Scene = {
  id: 'tls-path',
  title: 'Encrypted hop by hop, not end to end by default',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'path',
      label: 'Where TLS starts and stops',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'browser', label: 'Browser', sub: 'checks the cert', pattern: 'user', icon: 'globe' },
        { id: 'alb', label: 'Load balancer', sub: 'terminates TLS', pattern: 'network', icon: 'elb' },
        { id: 'app', label: 'App server', sub: ':8080', pattern: 'service', icon: 'ec2' },
        { id: 'db', label: 'Orders DB', sub: 'PostgreSQL :5432', pattern: 'storage', icon: 'rds' },
      ],
      edges: [
        { source: 'browser', target: 'alb', label: 'TLS 1.3' },
        { source: 'alb', target: 'app', label: 'HTTP!' },
        { source: 'app', target: 'db', label: 'TLS?' },
      ],
    },
    {
      id: 'config',
      label: 'The certificate, and each hop’s choice',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'listener',
          kind: 'code',
          filename: 'https-listener.sh · model-checked',
          hug: true,
          label: `aws acm request-certificate \\
  --domain-name shop.example.com --validation-method DNS
aws elbv2 create-listener \\
  --load-balancer-arn "$ALB_ARN" \\
  --protocol HTTPS --port 443 \\
  --certificates CertificateArn="$CERT_ARN" \\
  --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \\
  --default-actions Type=forward,TargetGroupArn="$TG_ARN"`,
        },
        {
          id: 'choices',
          kind: 'table',
          label: 'Each hop is a separate decision',
          sub: 'connected does not mean encrypted',
          headers: ['hop', 'encrypted when'],
          values: [
            ['browser → ALB', 'HTTPS listener + ACM cert'],
            ['ALB → app', 'target group uses HTTPS'],
            ['app → database', 'client requires TLS'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
