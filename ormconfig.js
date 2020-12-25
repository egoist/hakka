require('dotenv/config')

/** @type {import('typeorm').ConnectionOptions} */
module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/orm/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  logging: process.env.NODE_ENV === 'development',
  cli: {
    migrationsDir: 'src/migrations',
  },
}
