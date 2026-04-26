const express = require('express');
const router  = express.Router();
const db      = require('../db');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// ── Multer setup ──
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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Images only'));
  }
});

// GET /api/pets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pets ORDER BY added_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// POST /api/pets
router.post('/', upload.single('image'), async (req, res) => {
  const { name, breed, type, age, temperament, description,
          vaccinated_rabies, vaccinated_distemper, vaccinated_parvovirus } = req.body;

  if (!name || !req.file) {
    return res.status(400).json({ error: 'Name and image are required' });
  }

  const image_url = 'images/' + req.file.filename;

  try {
    const sql = `
      INSERT INTO pets 
        (name, breed, type, age, temperament, description, image_url,
         vaccinated_rabies, vaccinated_distemper, vaccinated_parvovirus, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
    `;
    const [result] = await db.execute(sql, [
      name,
      breed       || null,
      type        || null,
      age         ? parseInt(age) : null,
      temperament || null,
      description || null,
      image_url,
      vaccinated_rabies     === 'true' ? 1 : 0,
      vaccinated_distemper  === 'true' ? 1 : 0,
      vaccinated_parvovirus === 'true' ? 1 : 0
    ]);

    const [newPet] = await db.execute('SELECT * FROM pets WHERE id = ?', [result.insertId]);
    res.status(201).json(newPet[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add pet' });
  }
});

// DELETE /api/pets/:id
router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT image_url FROM pets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pet not found' });

    await db.execute('DELETE FROM pets WHERE id = ?', [req.params.id]);

    // Delete image file from disk
    const imgPath = path.join(__dirname, '../../frontend', rows[0].image_url);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete pet' });
  }
});

module.exports = router;