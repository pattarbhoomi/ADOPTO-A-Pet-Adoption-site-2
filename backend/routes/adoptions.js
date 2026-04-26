const express = require('express');
const router  = express.Router();
const db      = require('../db');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../frontend/uploads/documents');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('document'), async (req, res) => {
  const {
    user_id, pet_id, name, email, phone, address,
    pet_name, pet_breed, pet_age, pet_type,
    reason, pet_stay, caretaker_name, caretaker_contact,
    home_condition, people_count, interview_method,
    interview_contact, agreed_interview
  } = req.body;

  const document_url = req.file ? 'uploads/documents/' + req.file.filename : null;

  try {
    const sql = 'INSERT INTO adoptions (user_id, pet_id, name, email, phone, address, pet_name, pet_breed, pet_age, pet_type, reason, pet_stay, caretaker_name, caretaker_contact, home_condition, people_count, document_url, interview_method, interview_contact, agreed_interview, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")';
    await db.execute(sql, [
      user_id, pet_id, name, email, phone, address,
      pet_name, pet_breed, pet_age || null, pet_type,
      reason, pet_stay, caretaker_name, caretaker_contact,
      home_condition, people_count || null, document_url,
      interview_method, interview_contact,
      agreed_interview === 'true' ? 1 : 0
    ]);
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM adoptions ORDER BY application_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch adoptions' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM adoptions WHERE user_id = ? ORDER BY application_date DESC',
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user adoptions' });
  }
});

router.put('/:id', async (req, res) => {
  const { status, admin_note } = req.body;
  if (!['approved','rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    await db.execute(
      'UPDATE adoptions SET status = ?, admin_note = ? WHERE id = ?',
      [status, admin_note || null, req.params.id]
    );
    if (status === 'approved') {
      const [rows] = await db.execute('SELECT pet_id FROM adoptions WHERE id = ?', [req.params.id]);
      if (rows.length > 0) {
        await db.execute('UPDATE pets SET status = "adopted" WHERE id = ?', [rows[0].pet_id]);
      }
    }
    res.json({ message: 'Application ' + status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
