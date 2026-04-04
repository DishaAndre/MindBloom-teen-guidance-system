const express  = require('express');
const Question = require('../models/Question');
const User     = require('../models/User');

const router = express.Router();

// ── GET ALL QUESTIONS (with optional filters) ────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { userId, counselorId } = req.query;
    const filter = {};
    if (userId)     filter.userId     = userId;
    if (counselorId) filter.assignedTo = counselorId;
    const qs = await Question.find(filter).sort({ createdAt: -1 });
    res.json(qs);
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── CREATE QUESTION ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { userId, userName, title, content, category, isPrivate, isUrgent } = req.body;
    if (!title?.trim() || !content?.trim() || !category)
      return res.status(400).json({ error: 'Title, content and category are required.' });

    const q = await Question.create({
      userId,
      userName,
      title: title.trim(),
      content: content.trim(),
      category,
      isPrivate: !!isPrivate,
      isUrgent: !!isUrgent,
      status: 'Submitted',
    });

    // Award first_question badge
    const u = await User.findById(userId);
    if (u && !u.badges.includes('first_question')) {
      u.badges.push('first_question');
      await u.save();
    }

    res.status(201).json(q);
  } catch (err) {
    console.error('Create question error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── ASSIGN COUNSELOR ─────────────────────────────────────────────────────────
router.put('/:id/assign', async (req, res) => {
  try {
    const { counselorId } = req.body;
    const c = await User.findById(counselorId);
    if (!c) return res.status(404).json({ error: 'Counselor not found.' });

    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { assignedTo: counselorId, counselorName: c.name, status: 'Assigned to Counselor' },
      { new: true }
    );
    if (!q) return res.status(404).json({ error: 'Question not found.' });
    res.json(q);
  } catch (err) {
    console.error('Assign error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── UPDATE STATUS ────────────────────────────────────────────────────────────
router.put('/:id/status', async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!q) return res.status(404).json({ error: 'Not found.' });
    res.json(q);
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── REPLY TO QUESTION ────────────────────────────────────────────────────────
router.put('/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply?.trim()) return res.status(400).json({ error: 'Reply cannot be empty.' });

    const q = await Question.findByIdAndUpdate(
      req.params.id,
      { reply: reply.trim(), status: 'Answered', answeredAt: new Date() },
      { new: true }
    );
    if (!q) return res.status(404).json({ error: 'Not found.' });
    res.json(q);
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── TOGGLE FLAG ──────────────────────────────────────────────────────────────
router.put('/:id/flag', async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Not found.' });
    q.isFlagged = !q.isFlagged;
    await q.save();
    res.json(q);
  } catch (err) {
    console.error('Flag error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── DELETE QUESTION ──────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
