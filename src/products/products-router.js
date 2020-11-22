const path = require('path');
const express = require('express');
const xss = require('xss');
const productsService = require('./products-service');
const { Console } = require('console');

const productsRouter = express.Router();
const jsonParser = express.json();

const serializeProduct = (product) => ({
  id: product.id,
  product_name: xss(product.product_name),
  user_id: xss(product.user_id),
  description: xss(product.description),
  stock_total: xss(product.stock_total),
  provider: xss(product.provider),
  unit_price: xss(product.unit_price),
});

productsRouter.route('/').post(jsonParser, (req, res, next) => {
  const {
    product_name,
    user_id,
    stock_total,
    description,
    provider,
    unit_price,
  } = req.body;
  const newProduct = {
    product_name,
    user_id,
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
  .route('/:userId')
  .all((req, res, next) => {
    productsService
      .getAllProductByUserId(req.app.get('db'), req.params.userId)
      .then((product) => {
        if (!product || product.length === 0) {
          res.product = product;
          return res.json(res.product);
        }
        res.product = product;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(res.product);
  })
  .patch(jsonParser, (req, res, next) => {
    const {
      product_name,
      description,
      stock_total,
      provider,
      id,
      user_id,
      unit_price,
    } = req.body;

    const productToUpdate = {
      product_name,
      description,
      stock_total,
      provider,
      unit_price,
      id,
      user_id,
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
      .updateProduct(req.app.get('db'), parseInt(id), productToUpdate)
      .then((numRowsAffected) => {
        return res.json(productToUpdate);
        // res.status(204).end();
      })
      .catch(next);
  });

productsRouter.route('/:userId/:productId').delete((req, res, next) => {
  productsService
    .deleteProduct(req.app.get('db'), req.params.productId)
    .then(() => {
      productsService
        .getAllProductByUserId(req.app.get('db'), req.params.userId)
        .then((products) => {
          return res.json(products);
        });
    })
    .catch(next);
});

module.exports = productsRouter;
