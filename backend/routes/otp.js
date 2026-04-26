const express    = require('express');
const router     = express.Router();
const db         = require('../db');
const nodemailer = require('nodemailer');
const crypto     = require('crypto');
const bcrypt     = require('bcrypt');

// ── Email transporter ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adopto.admin@gmail.com',
    pass: 'ptwilhblworqhgt' // created app password
  }
});

// Store OTPs temporarily in memory { email: { otp, expiry } }
const otpStore = {};

// ── POST /api/otp/send ── 
// User enters email → validate it exists → send OTP
router.post('/send', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Check if email exists in users table
    const [rows] = await db.execute(
      'SELECT id, username FROM users WHERE email = ? AND role = "user"',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No user account found with this email' });
    }

    // Generate 6-digit OTP
    const otp    = crypto.randomInt(100000, 999999).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore[email] = { otp, expiry };

    // Send email
    await transporter.sendMail({
      from:    '"Adopto 🐾" <adopto.admin@gmail.com>',
      to:      email,
      subject: 'Your Adopto Password Reset OTP',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:30px;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#f9a826;">🐾 Adopto Password Reset</h2>
          <p>Hi <strong>${rows[0].username}</strong>,</p>
          <p>Your OTP for password reset is:</p>
          <div style="font-size:2.5rem;font-weight:700;letter-spacing:10px;color:#f9a826;text-align:center;padding:20px;background:#fdf8f0;border-radius:10px;margin:20px 0;">
            ${otp}
          </div>
          <p style="color:#999;font-size:0.9rem;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#999;font-size:0.9rem;">If you didn't request this, ignore this email.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="color:#ccc;font-size:0.8rem;text-align:center;">Adopto — Find Your Forever Friend 🐾</p>
        </div>
      `
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// ── POST /api/otp/verify ──
// Verify the OTP entered by user
router.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ error: 'No OTP requested for this email' });
  }

  if (Date.now() > record.expiry) {
    delete otpStore[email];
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (record.otp !== otp.toString()) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  // OTP verified — mark as verified so reset can proceed
  otpStore[email].verified = true;
  res.json({ message: 'OTP verified successfully' });
});

// ── POST /api/otp/reset-password ──
// Reset password after OTP verified
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password required' });
  }

  const record = otpStore[email];
  if (!record || !record.verified) {
    return res.status(400).json({ error: 'OTP not verified. Please verify OTP first.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
await db.execute(
  'UPDATE users SET password = ? WHERE email = ? AND role = "user"',
  [hashed, email]
);

    // Clear OTP after successful reset
    delete otpStore[email];

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;