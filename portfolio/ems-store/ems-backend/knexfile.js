require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || 'rohitraj',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ems_luxy'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  // Staging and Production can stay here for when you deploy to Render/AWS
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // Common for Render/Heroku deployments
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
