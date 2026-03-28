/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasOrders = await knex.schema.hasTable('orders');
  if (!hasOrders) return;

  const needsName = !(await knex.schema.hasColumn('orders', 'name'));
  const needsEmail = !(await knex.schema.hasColumn('orders', 'email'));
  const needsPhone = !(await knex.schema.hasColumn('orders', 'phone'));
  const needsAddress = !(await knex.schema.hasColumn('orders', 'address'));

  if (!needsName && !needsEmail && !needsPhone && !needsAddress) return;

  return knex.schema.table('orders', (table) => {
    if (needsName) table.string('name');
    if (needsEmail) table.string('email');
    if (needsPhone) table.string('phone');
    if (needsAddress) table.text('address');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasOrders = await knex.schema.hasTable('orders');
  if (!hasOrders) return;

  const hasName = await knex.schema.hasColumn('orders', 'name');
  const hasEmail = await knex.schema.hasColumn('orders', 'email');
  const hasPhone = await knex.schema.hasColumn('orders', 'phone');
  const hasAddress = await knex.schema.hasColumn('orders', 'address');

  if (!hasName && !hasEmail && !hasPhone && !hasAddress) return;

  return knex.schema.table('orders', (table) => {
    if (hasName) table.dropColumn('name');
    if (hasEmail) table.dropColumn('email');
    if (hasPhone) table.dropColumn('phone');
    if (hasAddress) table.dropColumn('address');
  });
};
