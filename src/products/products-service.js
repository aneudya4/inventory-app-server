const productsService = {
  getAllProductByUserId(knex, userId) {
    return knex.from('products').select('*').where('user_id', userId);
  },
  insertProduct(knex, newProduct) {
    return knex
      .insert(newProduct)
      .into('products')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from('products').select('*').where('id', id).first();
  },
  deleteProduct(knex, id) {
    console.log(id, 'JHERE MMGMGMGMGM');
    return knex('products').where({ id }).delete();
  },
  updateProduct(knex, id, newProductFields) {
    return knex('products').where({ id }).update(newProductFields);
  },
};

module.exports = productsService;
