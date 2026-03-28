/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Create the 'orders' table
    .createTable('orders', (table) => {
      table.increments('id').primary();
      
      // Foreign Key linking to the 'users' table. 
      // 'SET NULL' means if a user deletes their account, we keep the financial order record for accounting, but anonymize it.
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      
      // Customer snapshot (so orders remain readable even if user updates profile)
      table.string('name');
      table.string('email');
      table.string('phone');
      table.text('address');

      // Store money as exact decimals to prevent floating-point math errors
      table.decimal('total', 10, 2).notNullable();
      table.string('status').notNullable().defaultTo('pending');
      
      // Automatically creates 'created_at' and 'updated_at' columns
      table.timestamps(true, true); 
    })

    // 2. Create the 'order_items' table
    .createTable('order_items', (table) => {
      table.increments('id').primary();
      
      // Foreign Key linking to 'orders'. 
      // 'CASCADE' means if an order is deleted, all its line-items are automatically deleted too (prevents orphaned data).
      table.integer('order_id').unsigned().notNullable()
        .references('id').inTable('orders').onDelete('CASCADE');
      
      // Foreign Key linking to 'products'. 
      // We use string because your product IDs look like "steth-littmann-classic".
      // 'RESTRICT' prevents you from deleting a product from the database if someone has already bought it.
      table.string('product_id').notNullable()
        .references('id').inTable('products').onDelete('RESTRICT');
      
      // Unsigned ensures quantity can never be negative (A common e-commerce hack attempt)
      table.integer('quantity').unsigned().notNullable().defaultTo(1);
      table.decimal('unit_price', 10, 2).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // Drop tables in reverse order to respect Foreign Key constraints
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders');
};
