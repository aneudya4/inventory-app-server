
BEGIN;
INSERT INTO products (id, product_name,user_id,unit_price,description,stock_total,provider)
VALUES
(1, 'Iphone 12 Pro',1,999.99,'New Iphone 12 Pro 64 GB',50,'Apple'),
(2, 'Iphone 12 Pro',1,1199.99,'New Iphone 12 Pro 128 GB',30,'Apple'),
(3, 'Iphone 12 Pro',1,1299.99,'New Iphone 12 Pro 512 GB',20,'Apple');
COMMIT;