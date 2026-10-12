import type { Section } from '../types'

export const dynamodbKeysAndIndexes: Section = {
  id: 'dynamodb-keys-and-indexes',
  title: 'DynamoDB partition/sort keys, indexes, capacity, and hot access patterns',
  scene: 'dynamodb-keys',
  focus: 'keys-out',
  slide: `## DynamoDB keys and indexes

**Objective:** design keys from the queries, and avoid hot keys.

### Mental model
- **Partition key** spreads items; **sort key** orders them within one
- A **GSI** re-keys the same items for another query
- Capacity: **on-demand** or provisioned; spread across key values

### Worked example: emulated
- customer + "time#order": c-77's newest orders in **one Query**
- GSI by-status: PENDING orders, **2**
- Status has 2 values: **18 of 20** items share one key

### Misconception
- "Index any attribute" — a few-valued key makes a hot partition

### Explanation summary
- Many distinct partition keys; sort keys for order`,
  narration:
    "DynamoDB is a key value and document database that serves single digit millisecond reads at almost any scale, provided the keys match the queries. Every item has a partition key, which decides where the item is stored, and optionally a sort key, which orders items that share a partition key. Our pattern was a customer's orders, newest first. So the partition key is the customer, and the sort key is the order time followed by the order number. The program, run in an emulator, writes twenty orders across eight customers and then asks for customer c seventy seven's two newest orders in a single query, reading backwards along the sort key. No scan, no join. A global secondary index, a G S I, re-keys the same items for a different question: here, orders by status. It finds the two pending orders. But look at the last line. Status has only two values, so eighteen of twenty items share one partition key value in that index, PAID. At real scale, every write lands on that same key, and a single partition key value has a throughput limit. That is a hot partition. Capacity can be on demand, paying per request, or provisioned, but either way it needs to be spread across many distinct key values. The misconception is that you can index any attribute and query it freely. An index on a low cardinality attribute concentrates load. So choose partition keys with many distinct values, and use sort keys to order within them. This was a single Region table with on demand capacity; other variants change the guarantees, as the next section shows.",
}
