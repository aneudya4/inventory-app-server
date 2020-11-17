const path = require('path');
const express = require('express');
const xss = require('xss');
const productsService = require('./products-service');

const productsRouter = express.Router();
const jsonParser = express.json();

const serializeProduct = (product) => ({
  id: product.id,
  name: xss(product.name),
  description: product.description,
  inStock: xss(product.inStock),
  seller: xss(product.seller),
});

productsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    productsService
      .getAllProducts(knexInstance)
      .then((products) => {
        res.json(products.map(serializeProduct));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, productId, description, seller } = req.body;
    const newProduct = { name, productId, description, seller };

    for (const [key, value] of Object.entries(newProduct))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    productsService
      .insertProduct(req.app.get('db'), newProduct)
      .then((product) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${product.id}`))
          .json(serializeProduct(product));
      })
      .catch(next);
  });

productsRouter
  .route('/:productId')
  .all((req, res, next) => {
    productsService
      .getById(req.app.get('db'), req.params.productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            error: { message: `Product doesn't exist` },
          });
        }
        res.product = product;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeProduct(res.product));
  })
  .delete((req, res, next) => {
    productsService
      .deleteProduct(req.app.get('db'), req.params.productId)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = productsRouter;
