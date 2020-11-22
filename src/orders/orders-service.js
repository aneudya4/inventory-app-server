const ordersService = {
  getAllOrders(knex) {
    return knex.select('*').from('orders');
  },
  insertOrder(knex, newOrder) {
    return knex
      .insert(newOrder)
      .into('orders')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, userId) {
    return knex.from('orders').select('*').where('user_id', userId);
  },
  deleteOrder(knex, id) {
    return knex('orders').where({ id }).delete();
  },
};
module.exports = ordersService;
