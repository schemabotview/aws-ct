import type { Section } from '../types'

export const dynamodbConditionsAndConsistency: Section = {
  id: 'dynamodb-conditions-and-consistency',
  title: 'Conditional writes, transactions, and read-consistency choices in DynamoDB',
  scene: 'dynamodb-conditions',
  focus: 'stock-out',
  slide: `## Conditions, transactions, consistency

**Objective:** keep stock correct, and know which reads are current.

### Mental model
- A **condition expression** makes a write refuse bad states
- **TransactWriteItems**: several writes, all or none
- Consistency depends on **where** you read: table, index, global table

### Worked example: the last p-1002, emulated
- o-601: order written **and** stock 1 → 0
- o-602: **ConditionalCheckFailed**; no order left behind
- Stock read with **ConsistentRead**: 0; orders: 1

### Misconception
- "DynamoDB reads are always current" — indexes and default reads aren't

### Explanation summary
- Conditions guard rules; name the variant before promising`,
  narration:
    "The relational database enforced stock with a check constraint inside a transaction. DynamoDB has its own tools for the same rule. A condition expression attaches a test to a write, and the write is refused if the test fails. A transaction groups several writes so they all succeed or none do. The program, run in an emulator, sells the last unit of product p one thousand and two twice. Each attempt is one transaction with two parts: put the order item, and decrement stock on the condition that stock is at least one. Order six oh one succeeds: the order is written and stock goes from one to zero. Order six oh two fails with conditional check failed, and because it was a transaction, its order item was not written either. The final line reads stock with a strongly consistent read: zero, and one order. Consistency in DynamoDB depends on where you read, which is why the plan asks us to name the variant. On a table, a default read is eventually consistent and may briefly miss a recent write; asking for a consistent read returns the latest. A global secondary index offers only eventually consistent reads. Global tables, replicated across Regions, come in two variants: with multi Region eventual consistency, concurrent writes in different Regions resolve as last writer wins and strong reads are only current for writes made in your Region; with multi Region strong consistency, writes are confirmed in another Region before they succeed. The misconception is that DynamoDB reads are always current. Indexes and default reads are not. Use conditions to guard rules, and name the variant before promising consistency.",
}
