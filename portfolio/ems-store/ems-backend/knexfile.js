require('dotenv').config();

// Toggle SSL via env (DB_SSL=true). Defaults to false for hosts that reject SSL.
const useSSL = (process.env.DB_SSL || process.env.DATABASE_SSL || '').toLowerCase() === 'true';

function buildConnectionFromEnv() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: useSSL ? { rejectUnauthorized: false } : false
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'rohitraj',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ems_luxy',
    ssl: useSSL ? { rejectUnauthorized: false } : false
  };
}

module.exports = {
  development: {
    client: 'pg',
    connection: buildConnectionFromEnv(),
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' }
  },

  production: {
    client: 'pg',
    connection: buildConnectionFromEnv(),
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' }
  }
};
