const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

// ── GET ARTICLES ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const filter = req.query.approved === 'true' ? { approved: true } : {};
    const articles = await Article.find(filter);
    res.json(articles);
  } catch (err) {
    console.error('Get articles error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── APPROVE ARTICLE ──────────────────────────────────────────────────────────
router.put('/:id/approve', async (req, res) => {
  try {
    const a = await Article.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!a) return res.status(404).json({ error: 'Not found.' });
    res.json(a);
  } catch (err) {
    console.error('Approve article error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── DELETE ARTICLE ───────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
