import type { Section } from '../types'

export const dataRequirements: Section = {
  id: 'data-requirements',
  title: 'Data models, access patterns, transactions, latency, and growth requirements',
  scene: 'access-patterns',
  focus: 'patterns',
  slide: `## Data requirements first

**Objective:** state what the data must do before choosing an engine.

### Mental model
- An **access pattern**: which question, how often, how fast
- **Transactions**: what must change together, or not at all
- **Latency**: how fast each answer is needed
- **Growth**: rows and bytes in three years, not today

### Worked example: the shop at peak
- Product page by id: **~450 reads/s**, cacheable
- Place an order: **~6 writes/s**, all-or-nothing with stock
- A customer's orders, newest first; nightly sales by day

### Misconception
- "Pick the database, then the queries" — the queries pick the database

### Explanation summary
- Write the patterns down; then compare models`,
  narration:
    "Databases differ less in what they can store than in which questions they answer well. So before choosing one, write down the questions. An access pattern is a question the application asks, how often it asks it, and how fast it needs the answer. Read the shop's list, at the evening peak. Product pages read one product by its I D, around four hundred and fifty times a second, and a slightly old answer is acceptable, so they are cacheable. Placing an order happens only around six times a second, but it must be all or nothing: the order, its items and the stock reduction must happen together or not at all. A customer's order history is read by customer, newest first. Stock must never go below zero. And sales by day is a nightly scan over history, which belongs to the analytics chapter. Three data models answer these differently. Relational databases hold tables you join and query flexibly with S Q L, with strong transactions. Key value databases fetch items by key at very high scale, with queries you design in advance. In memory caches hold short lived copies for speed. Finally, growth: how many rows and bytes in three years, not today, because the choice must survive success. The misconception is to pick the database first and fit the queries to it afterwards. It works the other way: the queries pick the database. So write the patterns down, then compare the models against them.",
}
