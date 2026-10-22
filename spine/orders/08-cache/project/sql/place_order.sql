-- Order 501: two of p-1001 and two of p-1002. All of it, or none of it.
BEGIN;
INSERT INTO orders VALUES (501, 'c-17', 29.00);
INSERT INTO order_lines VALUES (501, 'p-1001', 2), (501, 'p-1002', 2);
UPDATE products SET stock = stock - 2 WHERE id = 'p-1001';
UPDATE products SET stock = stock - 2 WHERE id = 'p-1002';  -- only 1 left
COMMIT;
