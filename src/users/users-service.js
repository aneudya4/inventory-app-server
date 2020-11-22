const userService = {
  getByEmail(knex, email) {
    return knex.from('users').select('*').where('email', email).first();
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = userService;
