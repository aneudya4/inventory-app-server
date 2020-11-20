const orderItemService = {
  getAllOrderItems(knex) {
    return knex.select('*').from('order_item');
  },
  insertOrder(knex, newOrderItem) {
    return knex
      .insert(newOrderItem)
      .into('order_item')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from('order_item').select('*').where('order_id', id);
  },
};
module.exports = orderItemService;
