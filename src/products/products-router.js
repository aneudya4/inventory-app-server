const path = require('path');
const express = require('express');
const xss = require('xss');
const productsService = require('./products-service');

const productsRouter = express.Router();
const jsonParser = express.json();

const serializeProduct = (product) => ({
  id: product.id,
  product_name: xss(product.product_name),
  description: product.description,
  stock_total: xss(product.stock_total),
  provider: xss(product.provider),
  unit_price: xss(product.unit_price),
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
    const {
      product_name,
      stock_total,
      description,
      provider,
      unit_price,
    } = req.body;
    const newProduct = {
      product_name,
      description,
      provider,
      stock_total,
      unit_price,
    };

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
  })
  .patch(jsonParser, (req, res, next) => {
    const { product_name, description, stock_total, provider } = req.body;
    const productToUpdate = {
      product_name,
      description,
      stock_total,
      provider,
    };

    const numberOfValues = Object.values(productToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'name' , 'description' ,'stock', or 'provider'`,
        },
      });
    }

    productsService
      .updateProduct(req.app.get('db'), req.params.productId, productToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = productsRouter;
