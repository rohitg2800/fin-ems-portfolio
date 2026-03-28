/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    // We use string for ID because your IDs look like "steth-littmann-classic"
    table.string('id').primary(); 
    
    table.string('name').notNullable();
    table.string('category').notNullable();
    table.string('sku').notNullable().unique(); // UNIQUE constraint prevents duplicate SKUs
    table.decimal('price', 10, 2).notNullable();
    table.text('description'); // text instead of string for long descriptions
    table.text('image_url');
    table.integer('stock_level').unsigned().defaultTo(10); // unsigned prevents negative stock
    
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};