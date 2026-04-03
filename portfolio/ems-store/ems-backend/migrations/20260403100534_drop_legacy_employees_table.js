/**
 * Remove legacy employee-management schema from the EMS store project.
 *
 * The original migration is kept in source control so existing Knex migration
 * history remains valid on deployed databases.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasEmployeesTable = await knex.schema.hasTable('employees');
  if (!hasEmployeesTable) return;

  await knex.schema.dropTable('employees');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasEmployeesTable = await knex.schema.hasTable('employees');
  if (hasEmployeesTable) return;

  await knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('position').notNullable();
    table.decimal('salary', 14, 2);
    table.timestamp('hired_at').defaultTo(knex.fn.now());
  });
};
