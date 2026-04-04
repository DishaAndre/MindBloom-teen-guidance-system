const express = require('express');
const User    = require('../models/User');

const router = express.Router();

// ── GET ALL USERS (passwords excluded) ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── DELETE USER ──────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
