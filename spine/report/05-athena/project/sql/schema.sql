-- The orders schema. A product's stock may never go below zero.
CREATE TABLE products (
  id    text PRIMARY KEY,
  price numeric(10,2) NOT NULL,
  stock integer NOT NULL CHECK (stock >= 0)
);
CREATE TABLE orders (
  id       integer PRIMARY KEY,
  customer text NOT NULL,
  total    numeric(10,2) NOT NULL
);
CREATE TABLE order_lines (
  order_id   integer REFERENCES orders,
  product_id text REFERENCES products,
  qty        integer NOT NULL CHECK (qty > 0),
  PRIMARY KEY (order_id, product_id)
);
INSERT INTO products VALUES ('p-1001', 10.00, 40), ('p-1002', 4.50, 1);
