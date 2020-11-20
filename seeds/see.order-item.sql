BEGIN;
INSERT INTO order_item (id, product_id,order_id,quantity,unit_price)
VALUES
(1, 3,1,1,1099),
(2, 2,2,1,1199),
(3, 4,3,1,999);
COMMIT;