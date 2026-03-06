const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);

// GET /api/employees - Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await knex('employees').select('*');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/employees/:id - Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await knex('employees').where({ id: req.params.id }).first();
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/employees - Add new employee
router.post('/', async (req, res) => {
    try {
        // Remove id from body to let DB auto-increment
        const { id, ...newEmployee } = req.body; 
        const [created] = await knex('employees').insert(newEmployee).returning('*');
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const [updated] = await knex('employees')
            .where({ id: req.params.id })
            .update(updateData)
            .returning('*');
        
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await knex('employees').where({ id: req.params.id }).del();
        if (deleted) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
