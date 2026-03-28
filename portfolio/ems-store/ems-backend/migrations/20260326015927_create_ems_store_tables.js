exports.up = function(knex) {
  return knex.schema
    .createTable('medicines', table => {
      table.increments('id').primary();
      table.string('name').notNullable().index();
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.string('category').index();
      table.string('sku').unique();
      table.string('image_url');
      table.timestamps(true, true);
    })
    .createTable('inventory', table => {
      table.increments('id').primary();
      table.integer('medicine_id').unsigned()
        .references('id').inTable('medicines').onDelete('CASCADE');
      table.integer('stock_quantity').notNullable().defaultTo(100);
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('inventory')
    .dropTable('medicines');
};
