const path = require('path');
const express = require('express');
const xss = require('xss');
const ordersService = require('./orders-service');
const orderItemService = require('./order-item-service');

const productsService = require('../products/products-service');

const ordersRouter = express.Router();
const jsonParser = express.json();

const serializeOrder = (orders) => ({
  id: orders.id,
  user_id: xss(orders.user_id),
  client: xss(orders.client),
  client_email: xss(orders.client_email),
  order_total: xss(orders.order_total),
});

ordersRouter
  .route('/')
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db');
    ordersService
      .getAllOrders(knexInstance)
      .then((orders) => {
        res.json(orders.map(serializeOrder));
      })
      .catch(next);
  })
  .post(jsonParser, async (req, res, next) => {
    const { client, client_email, products, user_id } = req.body;
    console.log(req.body, 'jheere');
    const newOrder = {
      user_id,
      client,
      client_email,
    };
    for (const [key, value] of Object.entries(newOrder)) {
      if (!value || products.length <= 0)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
    }

    const getAllProducts = async () => {
      const allProductPromises = [];
      products.forEach((requestProduct) => {
        allProductPromises.push(
          productsService.getById(req.app.get('db'), requestProduct.id)
        );
      });
      return (await Promise.all(allProductPromises)).filter((p) => !!p);
    };
    const orderedProducts = await getAllProducts();
    if (orderedProducts.length !== products.length) {
      return res.status(401).json({
        message: 'One or more products do not exist',
      });
    }
    let totalPrice = 0;
    for (let idx = 0; idx < orderedProducts.length; idx++) {
      totalPrice +=
        parseInt(products[idx].quantity) *
        parseInt(orderedProducts[idx].unit_price);
      if (orderedProducts[idx].stock_total < products[idx].quantity) {
        return res.status(401).json({
          message: `product ${products[idx].id} is not  enough to sastisfy order`,
        });
      }
    }

    newOrder.order_total = totalPrice;
    ordersService
      .insertOrder(req.app.get('db'), newOrder)
      .then((order) => {
        orderedProducts.forEach((product, idx) => {
          const orderItem = {
            product_id: product.id,
            order_id: parseInt(order.id),
            quantity: parseInt(products[idx].quantity),
            unit_price: product.unit_price,
          };
          orderItemService.insertOrder(req.app.get('db'), orderItem);
        });
        return order;
      })
      .then(async (order) => {
        for (let i = 0; i < orderedProducts.length; i++) {
          const newStock =
            parseInt(orderedProducts[i].stock_total) -
            parseInt(products[i].quantity);
          orderedProducts[i].stock_total = newStock;

          await productsService.updateProduct(
            req.app.get('db'),
            orderedProducts[i].id,
            orderedProducts[i]
          );
        }
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${order.id}`))
          .json(serializeOrder(order));
      })

      .catch(next);
  });

ordersRouter
  .route('/:userId')
  .all((req, res, next) => {
    ordersService
      .getById(req.app.get('db'), req.params.userId)
      .then((order) => {
        if (!order || order.length === 0) {
          res.order = order;
          res.json(res.order);
        }
        return order;
      })
      .then((order) => {
        orderItemService
          .getById(req.app.get('db'), req.params.userId)
          .then((orderItems) => {
            //   send order with order items
            res.order = order;
            next();
          });
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.order);
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
