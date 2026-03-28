/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  const email = process.env.ADMIN_EMAIL || 'admin@emsluxe.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'EMS Admin';

  const password_hash = await bcrypt.hash(password, 12);

  await knex('users').where({ email }).del();
  await knex('users').insert({
    name,
    email: email.toLowerCase(),
    password_hash,
    role: 'admin',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });
};
