import type { Scene } from '@graphlearning/flow'

// §4.8 — the plan's two failures, run: carts kept on an instance's local disk are lost when scale-in
// terminates that instance; and a worker that handles SIGTERM finishes its in-flight job and hands
// the rest back before ECS's stopTimeout (30 s default, up to 120 s) ends in SIGKILL. Spot gives a
// best-effort two-minute notice.
// source: https://aws.amazon.com/blogs/containers/graceful-shutdowns-with-ecs/
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-instance-termination-notices.html
export const statelessDesign: Scene = {
  id: 'stateless-design',
  title: 'Servers come and go; state must not',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'carts',
      kind: 'code',
      filename: 'carts.py · runs locally',
      hug: true,
      label: `import random

random.seed(7)
servers = {"app-1": {}, "app-2": {}, "app-3": {}}
shared = {}  # e.g. a cache or table every server can reach
for n in range(300):  # 300 shoppers, spread by the load balancer
    cart = {"cart": f"cart-{n}", "items": n % 5 + 1}
    random.choice(list(servers.values()))[n] = cart
    shared[n] = cart

gone = servers.pop("app-2")  # scale-in terminates app-2
print(f"on local disk: {len(gone)} of 300 carts lost")
print(f"in shared store: {300 - len(shared)} of 300 carts lost")`,
    },
    {
      id: 'carts-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `on local disk: 99 of 300 carts lost
in shared store: 0 of 300 carts lost`,
    },
    {
      id: 'drain',
      kind: 'code',
      filename: 'drain.py · runs locally',
      hug: true,
      label: `import os
import signal

draining = False


def on_sigterm(signum, frame):
    global draining
    print("SIGTERM: stop taking new work")
    draining = True


signal.signal(signal.SIGTERM, on_sigterm)
for i, job in enumerate(["order-41", "order-42", "order-43"]):
    if draining:
        print(f"{job}: left on the queue for another worker")
        continue
    print(f"{job}: finished")
    if i == 0:  # the scale-in arrives mid-batch
        os.kill(os.getpid(), signal.SIGTERM)
print("exit 0, well before the 30 s stop timeout")`,
    },
    {
      id: 'drain-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `order-41: finished
SIGTERM: stop taking new work
order-42: left on the queue for another worker
order-43: left on the queue for another worker
exit 0, well before the 30 s stop timeout`,
    },
  ],
  edges: [],
}
