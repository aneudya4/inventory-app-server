const path = require('path');
const express = require('express');
const xss = require('xss');
const ordersService = require('./orders-service');

const ordersRouter = express.Router();
const jsonParser = express.json();

const serializeOrder = (orders) => ({
  id: orders.id,
  client: xss(orders.client),
  client_email: xss(orders.client_email),
  order_total: xss(orders.order_total),
});

ordersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ordersService
      .getAllOrders(knexInstance)
      .then((orders) => {
        res.json(orders.map(serializeOrder));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { client, client_email, order_total } = req.body;
    const newOrder = {
      client,
      client_email,
      order_total,
    };

    for (const [key, value] of Object.entries(newOrder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    ordersService
      .insertOrder(req.app.get('db'), newOrder)
      .then((order) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${order.id}`))
          .json(serializeOrder(order));
      })
      .catch(next);
  });

ordersRouter
  .route('/:orderId')
  .all((req, res, next) => {
    ordersService
      .getById(req.app.get('db'), req.params.orderId)
      .then((order) => {
        if (!order) {
          return res.status(404).json({
            error: { message: `order doesn't exist` },
          });
        }
        res.order = order;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeProduct(res.order));
  })
  .delete((req, res, next) => {
    ordersService
      .deleteOrder(req.app.get('db'), req.params.orderId)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = ordersRouter;
