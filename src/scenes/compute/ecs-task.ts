import type { Scene } from '@graphlearning/flow'

// §4.6 — the same order API as a container: image in ECR, a Fargate task definition validated in full
// against the ECS RegisterTaskDefinition request. 512 CPU units with 1024 MiB is a valid Fargate
// combination. The EXECUTION role lets ECS pull the image and write logs; the TASK role is what the
// app's own AWS calls use (least privilege, Ch. 2). Logs go to CloudWatch via awslogs from day one.
// source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
// source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
export const ecsTask: Scene = {
  id: 'ecs-task',
  title: 'The order API as a Fargate task',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'taskdef',
      kind: 'code',
      filename: 'ecs.RegisterTaskDefinition.request.json · model-checked',
      hug: true,
      label: `{
  "family": "order-api",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024",
  "runtimePlatform": {
    "cpuArchitecture": "ARM64",
    "operatingSystemFamily": "LINUX"
  },
  "executionRoleArn":
    "arn:aws:iam::111122223333:role/OrderApiExecution",
  "taskRoleArn": "arn:aws:iam::111122223333:role/OrderApi",
  "containerDefinitions": [{
    "name": "app",
    "image": "111122223333.dkr.ecr.eu-west-2.amazonaws.com/order-api:1.4.2",
    "portMappings": [{ "containerPort": 8080 }],
    "stopTimeout": 30,
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/shop/order-api",
        "awslogs-region": "eu-west-2",
        "awslogs-stream-prefix": "app"
      }
    }
  }]
}`,
    },
    {
      id: 'vm-vs-container',
      kind: 'table',
      label: 'Same API, VM or container?',
      sub: 'what changes for the shop',
      headers: ['', 'EC2 + ASG', 'ECS on Fargate'],
      values: [
        ['artefact', 'AMI + jar', 'image in ECR'],
        ['OS patching', 'ours', 'AWS'],
        ['unit of scale', 'instance', 'task'],
        ['start time', 'minutes', 'under a minute'],
        ['roles', 'instance profile', 'task + execution'],
        ['logs', 'agent we run', 'awslogs driver'],
      ],
    },
  ],
  edges: [],
}
