import type { Scene } from '@graphlearning/flow'

// §6.3 — placing an order as ONE transaction, run in real PostgreSQL 16: the second stock update
// violates CHECK (stock >= 0), the whole transaction rolls back, and nothing changed. Beside it, the
// connection arithmetic: every app server's pool counts against max_connections (200 is an assumed
// parameter-group value) — scaling to 12 servers is refused connections, the trace RDS Proxy pools.
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html
export const orderTransaction: Scene = {
  id: 'order-transaction',
  title: 'All of the order, or none of it',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'sql',
      label: 'Placing order 501',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'order',
          kind: 'code',
          filename: 'place_order.sql · runs locally',
          hug: true,
          label: `CREATE TABLE products (
  id    text PRIMARY KEY,
  price numeric(8,2) NOT NULL,
  stock int NOT NULL CHECK (stock >= 0));
CREATE TABLE orders (
  id       int PRIMARY KEY,
  customer text NOT NULL,
  total    numeric(8,2) NOT NULL);
CREATE TABLE order_items (
  order_id int REFERENCES orders,
  product  text REFERENCES products,
  qty      int NOT NULL);
INSERT INTO products VALUES
  ('p-1001', 10.00, 40), ('p-1002', 4.50, 1);

-- order 501: 2 × p-1001, 2 × p-1002 (only 1 left)
BEGIN;
INSERT INTO orders VALUES (501, 'c-77', 29.00);
INSERT INTO order_items VALUES
  (501, 'p-1001', 2), (501, 'p-1002', 2);
UPDATE products SET stock = stock - 2 WHERE id = 'p-1001';
UPDATE products SET stock = stock - 2 WHERE id = 'p-1002';
COMMIT;

SELECT id, stock FROM products ORDER BY id;
SELECT count(*) AS orders FROM orders;`,
        },
        {
          id: 'order-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `ERROR:  new row for relation "products" violates check constraint "products_stock_check"
   id   | stock 
--------+-------
 p-1001 |    40
 p-1002 |     1
(2 rows)

 orders 
--------
      0
(1 row)`,
        },
      ],
    },
    {
      id: 'pool',
      label: 'Connections run out first',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'conn',
          kind: 'code',
          filename: 'connections.py · runs locally',
          hug: true,
          label: `MAX_CONNECTIONS = 200  # set in the DB parameter group
RESERVED = 10          # admin and monitoring sessions
POOL = 20              # connections per app server

free = MAX_CONNECTIONS - RESERVED
for servers in (3, 6, 9, 12):
    wanted = servers * POOL
    refused = max(0, wanted - free)
    note = "  <- 'too many clients'" if refused else ""
    print(f"{servers:>2} servers x {POOL} = {wanted:>3} wanted,"
          f" {refused:>2} refused{note}")`,
        },
        {
          id: 'conn-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: ` 3 servers x 20 =  60 wanted,  0 refused
 6 servers x 20 = 120 wanted,  0 refused
 9 servers x 20 = 180 wanted,  0 refused
12 servers x 20 = 240 wanted, 50 refused  <- 'too many clients'`,
        },
      ],
    },
  ],
  edges: [],
}
