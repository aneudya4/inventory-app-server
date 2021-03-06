const makeProductsArray = () => {
  return [
    {
      id: 31,
      product_name: 'headphones',
      user_id: 8,
      unit_price: '50',
      description: 'apple headphones',
      stock_total: 20,
      provider: 'apple',
    },
  ];
};

const makeOrdersArray = () => {
  return [
    {
      id: 1,
      user_id: 1,
      client: 'elvita',
      client_email: 'elvita@gmail.com',
      order_total: '5994',
      created_at: '2020-11-21T15:01:54.365Z',
    },
    {
      id: 2,
      user_id: 1,
      client: 'elvita',
      client_email: 'elvita@gmail.com',
      order_total: '3996',
      created_at: '2020-11-21T17:43:49.696Z',
    },
    {
      id: 3,
      user_id: 1,
      client: 'elvita',
      client_email: 'elvita@gmail.com',
      order_total: '4596',
      created_at: '2020-11-21T19:26:42.705Z',
    },
    {
      id: 4,
      user_id: 1,
      client: 'elvita',
      client_email: 'elvita@gmail.com',
      order_total: '4596',
      created_at: '2020-11-21T19:26:46.177Z',
    },
    {
      id: 5,
      user_id: 1,
      client: 'email',
      client_email: 'email@email.com',
      order_total: '3922',
      created_at: '2020-11-22T04:51:09.118Z',
    },
    {
      id: 6,
      user_id: 1,
      client: 'email',
      client_email: 'email@email.com',
      order_total: '2873',
      created_at: '2020-11-22T05:18:25.389Z',
    },
    {
      id: 7,
      user_id: 1,
      client: 'email@email.com',
      client_email: 'email@email.com',
      order_total: '250',
      created_at: '2020-11-22T05:20:56.822Z',
    },
    {
      id: 8,
      user_id: 1,
      client: 'mgm',
      client_email: 'mmg@mmg.com',
      order_total: '250',
      created_at: '2020-11-22T05:21:45.959Z',
    },
    {
      id: 13,
      user_id: 1,
      client: 'Aneudy Adames',
      client_email: 'rita@gmail.com',
      order_total: '1724',
      created_at: '2020-11-26T04:41:12.233Z',
    },
    {
      id: 14,
      user_id: 1,
      client: 'rita',
      client_email: 'rita@gmail.com',
      order_total: '850',
      created_at: '2020-11-26T04:42:28.295Z',
    },
    {
      id: 15,
      user_id: 1,
      client: 'Aneudy Adames',
      client_email: 'aa@gmail.com',
      order_total: '1299',
      created_at: '2020-11-26T05:39:47.540Z',
    },
    {
      id: 16,
      user_id: 1,
      client: 'aa',
      client_email: 'rita@gmail.com',
      order_total: '1200',
      created_at: '2020-11-26T05:42:43.946Z',
    },
    {
      id: 17,
      user_id: 1,
      client: 'rita',
      client_email: 'rita@gmai.com',
      order_total: '2000',
      created_at: '2020-11-30T05:49:22.287Z',
    },
    {
      id: 18,
      user_id: 1,
      client: 'rita',
      client_email: 'rita@gmai.com',
      order_total: '2000',
      created_at: '2020-11-30T05:53:18.334Z',
    },
    {
      id: 19,
      user_id: 1,
      client: 'rita',
      client_email: 'rita@gmai.com',
      order_total: '0',
      created_at: '2020-11-30T05:53:26.772Z',
    },
  ];
};
module.exports = {
  makeProductsArray,
  makeOrdersArray,
};
