import type { Section } from '../types'

export const transactionsAndConnections: Section = {
  id: 'transactions-and-connections',
  title: 'Transactions, connection management, credentials, and application failure handling',
  scene: 'order-transaction',
  focus: 'order-out',
  slide: `## Transactions and connections

**Objective:** keep orders correct, and the database reachable.

### Mental model
- A **transaction** commits all its changes, or none
- A **constraint** turns a bad change into an error, not bad data
- Every pooled **connection** counts against the server's limit

### Worked example: run in PostgreSQL 16
- Order 501 wants 2 × p-1002; only **1** left
- CHECK fails → whole order **rolled back**: stock 40 / 1, **0** orders
- 12 servers × 20-pool = 240 > 190 free → **50 refused**

### Misconception
- "Retry fixes it" — a retried order without an idempotency key duplicates

### Explanation summary
- Let the database enforce rules; budget connections`,
  narration:
    "Now the order itself, run for real in PostgreSQL sixteen. The script creates products, orders and order items, with one rule on products: stock must never go below zero. Order five hundred and one asks for two of product p one thousand and one, and two of p one thousand and two, of which only one is left. All of it runs inside one transaction. The first stock update succeeds. The second would make stock negative, so the check constraint raises an error, and the database aborts the whole transaction. The output proves it: stock is still forty and one, and there are zero orders. No half order exists anywhere. That is what a transaction buys: the database, not our code, guarantees all or nothing. The right side is a different kind of failure. Every app server keeps a pool of connections, here twenty each, and every connection counts against the database's maximum, two hundred in our assumed parameter group, minus ten reserved for administration. Three, six or nine servers fit. Scale to twelve for a sale and two hundred and forty connections are wanted, so fifty are refused with too many clients, exactly when traffic is highest. R D S Proxy addresses this by pooling and sharing connections in front of the database, and the credentials come from Secrets Manager, not from code. The misconception is that retrying fixes a failure. If the order committed but the reply was lost, a blind retry creates a second order. Retries need an idempotency key, which chapter seven builds. Let the database enforce the rules, and budget connections like any other capacity.",
}
