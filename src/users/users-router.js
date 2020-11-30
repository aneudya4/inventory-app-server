const path = require('path');
const express = require('express');
const xss = require('xss');
const userService = require('./users-service');

const userRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  name: xss(user.name),
  email: xss(user.email),
});

userRouter.route('/').post(jsonParser, (req, res, next) => {
  const { name, email } = req.body;
  const newUser = {
    name,
    email,
  };
  for (const [key, value] of Object.entries(newUser))
    if (value == null)
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });

  userService
    .insertUser(req.app.get('db'), newUser)
    .then((user) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(serializeUser(user));
    })
    .catch(next);
});

userRouter
  .route('/:email')
  .all((req, res, next) => {
    userService
      .getByEmail(req.app.get('db'), req.params.email)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `user Not Found` },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  });
//   .patch(jsonParser, (req, res, next) => {
//     const { product_name, description, stock_total, provider } = req.body;
//     const productToUpdate = {
//       product_name,
//       description,
//       stock_total,
//       provider,
//     };

//     const numberOfValues = Object.values(productToUpdate).filter(Boolean)
//       .length;
//     if (numberOfValues === 0) {
//       logger.error(`Invalid update without required fields`);
//       return res.status(400).json({
//         error: {
//           message: `Request body must content either 'name' , 'description' ,'stock', or 'provider'`,
//         },
//       });
//     }

//     userService
//       .updateProduct(req.app.get('db'), req.params.productId, productToUpdate)
//       .then((numRowsAffected) => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

module.exports = userRouter;
