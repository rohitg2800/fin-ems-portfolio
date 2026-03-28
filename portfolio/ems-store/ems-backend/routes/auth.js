const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ensure we use the environment configuration dynamically
const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];
const knex = require('knex')(config);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  // SECURITY FIX: Removed 'role' from req.body to prevent Privilege Escalation.
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [user] = await knex('users')
      .insert({
        name: username,
        email: email.toLowerCase(), // Normalize emails
        password_hash: hashedPassword,
        role: 'customer', // Force all new signups to be standard customers
        created_at: knex.fn.now()
      })
      .returning(['id', 'name', 'email', 'role']);

    // SECURITY: Throws an error if JWT_SECRET is missing in .env
    if (!process.env.JWT_SECRET) throw new Error("FATAL: JWT_SECRET is not defined.");

    const token = jwt.sign(
      { id: user.id, username: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true, 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    if (err.code === '23505') {  // Postgres Unique constraint violation
      res.status(409).json({ success: false, message: 'Email already exists' });
    } else {
      console.error("Registration Error:", err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    const user = await knex('users').where({ email: email.toLowerCase() }).first();
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      // SECURITY FIX: Generic error message prevents username enumeration
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) throw new Error("FATAL: JWT_SECRET is not defined.");

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      success: true, 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;