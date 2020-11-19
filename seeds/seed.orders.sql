BEGIN;
INSERT INTO orders (id, client,client_email,order_total)
VALUES
(1, 'Luis','luigy@gmail.com',2000),
(2, 'Jean ','jean@gmail.com',1199.99),
(3, 'Kevin','kevin@gmail.com',1299.99);
COMMIT;