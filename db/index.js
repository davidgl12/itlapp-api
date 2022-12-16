const { Client, Pool } = require("pg");

module.exports = {
  query: async (text, params, callback) => {
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    const start = Date.now();
    client.query(text, params, (err, res) => {
      if (err) throw err;
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res })
      callback(err, res)
      client.end();
    });
  },
}