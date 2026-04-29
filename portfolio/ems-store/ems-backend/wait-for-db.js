#!/usr/bin/env node
/**
 * wait-for-db.js
 * Retries PostgreSQL connection until the DB is ready, then runs migrations.
 * Solves Render ECONNREFUSED race condition where DB is still provisioning.
 */
require('dotenv').config();
const { execSync } = require('child_process');
const { Client } = require('pg');

const MAX_RETRIES = 20;
const RETRY_DELAY_MS = 3000;

async function waitForDb() {
  const connectionString = process.env.DATABASE_URL;
  const envSsl = (process.env.DB_SSL || process.env.DATABASE_SSL || '').toLowerCase();

  if (!connectionString) {
    console.error('[wait-for-db] ERROR: DATABASE_URL is not set!');
    process.exit(1);
  }

  let host = 'unknown';
  try {
    const parsed = new URL(connectionString);
    host = parsed.hostname || host;
  } catch (err) {
    host = connectionString.split('@').pop()?.split(':')[0] || host;
  }

  const useSSL = envSsl === 'true' || (!envSsl && host !== 'localhost' && host !== '127.0.0.1');
  const redactedConnectionString = connectionString.replace(/:\/\/.+?:.+?@/, '://[REDACTED]@');

  console.log('[wait-for-db] Waiting for PostgreSQL to be ready...');
  console.log(`[wait-for-db] DB host: ${host}`);
  console.log(`[wait-for-db] DB SSL enabled: ${useSSL}`);
  console.log(`[wait-for-db] DB connection string: ${redactedConnectionString}`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const client = new Client({
      connectionString,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      console.log(`[wait-for-db] ✅ Database ready on attempt ${attempt}`);
      return true;
    } catch (err) {
      console.log(`[wait-for-db] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      await client.end().catch(() => {});

      if (attempt === MAX_RETRIES) {
        console.error('[wait-for-db] ❌ Database never became ready. Exiting.');
        process.exit(1);
      }

      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
    }
  }
}

async function main() {
  await waitForDb();

  console.log('[wait-for-db] Running migrations...');
  try {
    execSync('npx knex migrate:latest', { stdio: 'inherit' });
    console.log('[wait-for-db] ✅ Migrations complete.');
  } catch (err) {
    console.error('[wait-for-db] ❌ Migration failed:', err.message);
    process.exit(1);
  }

  console.log('[wait-for-db] Starting server...');
  require('./server.js');
}

main();
