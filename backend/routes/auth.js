const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  const { username, email, phone, password, role } = req.body;
  try {
    if (role === 'admin') {
      if (username !== 'admin@1' || password !== 'adopto_adm') {
        return res.status(400).json({ error: 'Invalid admin signup credentials' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, phone, hashedPassword, role]
    );
    res.json({ id: result.insertId, username, email, phone, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    if (user.role === 'admin' && user.username === 'admin@1') {
      if (password === 'adopto_adm') {
        return res.json({ role: 'admin', redirect: '/frontend/admin.html' });
      } else {
        return res.status(400).json({ error: 'Invalid admin credentials' });
      }
    }

    return res.json({
      role: 'user',
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      redirect: '/frontend/index.html'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
