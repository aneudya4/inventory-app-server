const ordersService = {
  getAllProducts(knex) {
    return knex.select('*').from('orders');
  },
  insertOrder(knex, newOrder) {
    return knex
      .insert(newProduct)
      .into('orders')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from('orders').select('*').where('id', id).first();
  },
  deleteOrder(knex, id) {
    return knex('orders').where({ id }).delete();
  },
};
