import type { Section } from '../types'

export const containersEcrEcs: Section = {
  id: 'containers-ecr-ecs',
  title: 'Images and registries with ECR; tasks and services with ECS/Fargate',
  scene: 'ecs-task',
  focus: 'taskdef',
  slide: `## Containers with ECR and ECS

**Objective:** describe the order API as a container task.

### Mental model
- An **image** in **ECR** is the artefact; a **task** runs it
- A **service** keeps N tasks running behind the load balancer
- **Execution role**: pull and log · **task role**: the app's calls

### Worked example: order-api:1.4.2
- Fargate, **512 CPU / 1024 MiB**, ARM64
- Port 8080, logs to **/shop/order-api**
- stopTimeout **30 s** to finish work on shutdown
- **awsvpc**: each task gets its own ENI and security group

### Misconception
- "Containers make the app stateless" — only the design does

### Explanation summary
- Image, task definition, service: the container's template`,
  narration:
    "Now the same order A P I as a container. The artefact is an image, stored in E C R, the Elastic Container Registry, and tagged with the release, one point four point two. E C S runs it as a task, from a task definition, which plays the role the launch template played for E C two. And an E C S service keeps a chosen number of tasks running, registers them with the load balancer's target group, and replaces any that fail. Read the task definition, validated against the E C S A P I. It requires Fargate, so A W S runs the hosts. It uses a v p c networking, so every task gets its own network interface in our app subnets and its own security group. It asks for five hundred and twelve C P U units, half a v C P U, with one thousand and twenty four mebibytes, a valid Fargate size, on A R M sixty four. Two roles appear, and they are easy to confuse. The execution role is used by E C S itself to pull the image and write logs. The task role is what the application's own A W S calls use, our least privilege OrderApi role. Logs go to CloudWatch through the a w s logs driver from day one. And stop timeout gives the app thirty seconds to finish work when E C S stops it. The table compares the virtual machine and container versions: the artefact, who patches the operating system, the unit of scale, start time, roles and logging. The misconception is that containers make an application stateless. They do not; only its design does, which is the last section of this chapter. Image, task definition and service together are the container's template.",
}
