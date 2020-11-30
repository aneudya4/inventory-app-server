BEGIN;
INSERT INTO orders (id, client,user_id,client_email,order_total)
VALUES
(1, 'Luis',1,'luigy@gmail.com',2000),
(2, 'Jean ',2,'jean@gmail.com',1199.99),
(3, 'Kevin',3,'kevin@gmail.com',1299.99);
COMMIT;