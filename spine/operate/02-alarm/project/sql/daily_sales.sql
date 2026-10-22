-- Daily sales for three days of September: only three partitions are read.
SELECT dt, count(*) AS orders, round(sum(total), 2) AS sales
FROM order_history
WHERE dt BETWEEN '2026-09-11' AND '2026-09-13'
GROUP BY dt
ORDER BY dt
