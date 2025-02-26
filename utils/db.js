import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

export default knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  pool: { min: 0, max: 7 }
});