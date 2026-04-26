const express  = require('express');
const router   = express.Router();
const db       = require('../db');
const bcrypt   = require('bcrypt');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

// ── Multer for pet images ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../frontend/images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ── POST /api/ngo/login ──
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM ngos WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ error: 'NGO not found' });
    const ngo   = rows[0];
    const match = await bcrypt.compare(password, ngo.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });
    res.json({ id: ngo.id, name: ngo.name, email: ngo.email, phone: ngo.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/ngo/reports ── get all animal reports
router.get('/reports', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM animal_reports ORDER BY reported_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/ngo/reports/:id/acknowledge ── NGO acknowledges a report
router.put('/reports/:id/acknowledge', async (req, res) => {
  const { ngo_id, ngo_message } = req.body;
  try {
    await db.execute(
      `UPDATE animal_reports 
       SET status = 'acknowledged', ngo_id = ?, ngo_message = ?, acknowledged_at = NOW()
       WHERE id = ?`,
      [ngo_id, ngo_message || 'We have received your report and will look into it shortly.', req.params.id]
    );
    res.json({ message: 'Report acknowledged' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/ngo/reports/:id/resolve ── mark as resolved
router.put('/reports/:id/resolve', async (req, res) => {
  try {
    await db.execute(
      "UPDATE animal_reports SET status = 'resolved' WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: 'Report resolved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/ngo/pets ── get NGO pet submissions
router.get('/pets', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM ngo_pets ORDER BY submitted_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/ngo/pets ── NGO submits a pet for adoption
router.post('/pets', upload.single('image'), async (req, res) => {
  const {
    ngo_id, ngo_name, name, type, breed, age, temperament, description,
    vaccinated_rabies, vaccinated_distemper, vaccinated_parvovirus, report_id
  } = req.body;

  if (!name || !req.file) {
    return res.status(400).json({ error: 'Pet name and image are required' });
  }

  const image_url = 'images/' + req.file.filename;

  try {
    await db.execute(
      `INSERT INTO ngo_pets 
        (ngo_id, ngo_name, name, type, breed, age, temperament, description,
         vaccinated_rabies, vaccinated_distemper, vaccinated_parvovirus, image_url, report_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ngo_id, ngo_name, name, type || null, breed || null,
        age ? parseInt(age) : null, temperament || null, description || null,
        vaccinated_rabies === 'true' ? 1 : 0,
        vaccinated_distemper === 'true' ? 1 : 0,
        vaccinated_parvovirus === 'true' ? 1 : 0,
        image_url, report_id || null
      ]
    );
    res.status(201).json({ message: 'Pet submitted for admin approval' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/ngo/pets/:id/approve ── admin approves NGO pet → adds to pets table
router.put('/pets/:id/approve', async (req, res) => {
  const { admin_note } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM ngo_pets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Submission not found' });

    const p = rows[0];

    // Add to main pets table
    await db.execute(
      `INSERT INTO pets 
        (name, breed, type, age, temperament, description, image_url,
         vaccinated_rabies, vaccinated_distemper, vaccinated_parvovirus, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [p.name, p.breed, p.type, p.age, p.temperament, p.description,
       p.image_url, p.vaccinated_rabies, p.vaccinated_distemper, p.vaccinated_parvovirus]
    );

    // Update ngo_pets status
    await db.execute(
      "UPDATE ngo_pets SET status = 'approved', admin_note = ? WHERE id = ?",
      [admin_note || null, req.params.id]
    );

    res.json({ message: 'Pet approved and added to adoption page' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/ngo/pets/:id/reject ── admin rejects NGO pet submission
router.put('/pets/:id/reject', async (req, res) => {
  const { admin_note } = req.body;
  try {
    await db.execute(
      "UPDATE ngo_pets SET status = 'rejected', admin_note = ? WHERE id = ?",
      [admin_note || null, req.params.id]
    );
    res.json({ message: 'Submission rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//NGO
// GET /api/ngo/list — list all NGOs (admin only)
router.get('/list', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, address, created_at FROM ngos ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ngo/create — admin creates an NGO account
router.post('/create', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO ngos (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, phone || null, address || null]
    );
    res.status(201).json({ message: 'NGO created successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'An NGO with this email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;