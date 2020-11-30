const app = require('../src/app');
const knex = require('knex');
const { makeProductsArray, makeOrdersArray } = require('./inventory.fixtures');

describe('App', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });
    app.set('db', db);
  });
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200, 'Hello, world!');
  });

  describe('GET /api/users', () => {
    it('GET /api/users/userId ', () => {
      context(`Given no users`, () => {
        it(`responds 404 when users doesn't exist`, () => {
          return supertest(app)
            .get(`/api/users/123`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(404, {
              error: { message: `user Not Found` },
            });
        });
      });
      const expectedUser = {
        id: 8,
        name: 'John Doe',
        email: 'demoaccount@gmail.com',
      };
      return supertest(app)
        .get('/api/users/demoaccount@gmail.com')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, JSON.stringify(expectedUser));
    });

    it(`responds with 401 Unauthorized for GET /api/users/userId`, () => {
      return supertest(app)
        .get('/api/users/userId')
        .expect(401, { error: 'Unauthorized request' });
    });

    it(`responds with 401 Unauthorized for POST /api/users`, () => {
      return supertest(app)
        .post('/api/users')
        .send({ name: 'john Doe', email: 'johnDoe@gmail.com' })
        .expect(401, { error: 'Unauthorized request' });
    });
  });

  describe('GET /api/products/', () => {
    it('GET /api/products/:userId', () => {
      const demoUserProducts = makeProductsArray();
      return supertest(app)
        .get('/api/products/8')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, JSON.stringify(demoUserProducts));
    });
  });

  describe('GET /api/orders/', () => {
    it('GET /api/orders/userId', () => {
      const demoAccountOrders = makeOrdersArray();
      return supertest(app)
        .get('/api/orders/1')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, demoAccountOrders);
    });

    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get('/api/orders/12')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []);
    });
  });

  describe('DELETE /api/products/:userId/:productId', () => {
    context(`Given no products`, () => {
      it(`responds 404 when products doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/products/11111/123`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            message: `Product Not Found`,
          });
      });
    });
  });
});
