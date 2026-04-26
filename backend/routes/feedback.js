const express = require('express');
const router  = express.Router();
const db      = require('../db'); // adjust path if your db connection file is named differently

// POST /api/feedback — submit feedback
router.post('/', async (req, res) => {
  const { name, email, message, rating, image, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const sql = `
      INSERT INTO feedbacks (name, email, message, rating, image, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    await db.execute(sql, [name, email, message, rating || null, image || null, userId || null]);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// GET /api/feedback — fetch all feedbacks for display
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM feedbacks ORDER BY createdAt DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch feedback error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// PUT /api/feedback/:id/like
router.put('/:id/like', async (req, res) => {
  try {
    await db.execute('UPDATE feedbacks SET likes = COALESCE(likes, 0) + 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/unlike', async (req, res) => {
  try {
    await db.execute('UPDATE feedbacks SET likes = GREATEST(COALESCE(likes, 0) - 1, 0) WHERE id = ?', [req.params.id]);
    res.json({ message: 'Unliked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;