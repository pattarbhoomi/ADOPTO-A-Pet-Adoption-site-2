const express = require('express');
const router  = express.Router();
const db      = require('../db');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../frontend/uploads/reports');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  const { user_id, user_name, user_email, user_phone, animal_type, description, location } = req.body;
  const image_url = req.file ? 'uploads/reports/' + req.file.filename : null;

  if (!location) return res.status(400).json({ error: 'Location is required' });

  try {
    await db.execute(
      `INSERT INTO animal_reports 
        (user_id, user_name, user_email, user_phone, animal_type, description, location, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, user_name, user_email, user_phone, animal_type || null,
       description || null, location, image_url]
    );
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/reports/user/:userId ── get reports for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM animal_reports WHERE user_id = ? ORDER BY reported_at DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;