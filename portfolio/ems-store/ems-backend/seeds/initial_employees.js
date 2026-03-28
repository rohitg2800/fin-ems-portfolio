/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('employees').del();
  await knex('employees').insert([
    { id: 1, first_name: 'Ava', last_name: 'Singh', email: 'ava.singh@emsluxe.com', position: 'Paramedic', salary: 62000 },
    { id: 2, first_name: 'Noah', last_name: 'Carter', email: 'noah.carter@emsluxe.com', position: 'EMT', salary: 48000 },
    { id: 3, first_name: 'Maya', last_name: 'Patel', email: 'maya.patel@emsluxe.com', position: 'Shift Supervisor', salary: 74000 }
  ]);
};
