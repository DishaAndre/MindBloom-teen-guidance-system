const express  = require('express');
const User     = require('../models/User');
const Question = require('../models/Question');
const Article  = require('../models/Article');
const Quiz     = require('../models/Quiz');

const router = express.Router();

// ── DASHBOARD STATS ──────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [children, counselors, qs, articles, pendingArticles] = await Promise.all([
      User.countDocuments({ role: 'child' }),
      User.countDocuments({ role: 'counselor' }),
      Question.find(),
      Article.countDocuments({ approved: true }),
      Article.countDocuments({ approved: false }),
    ]);

    res.json({
      children,
      counselors,
      total:    qs.length,
      answered: qs.filter(q => q.status === 'Answered').length,
      pending:  qs.filter(q => q.status !== 'Answered').length,
      urgent:   qs.filter(q => q.isUrgent && q.status !== 'Answered').length,
      flagged:  qs.filter(q => q.isFlagged).length,
      articles,
      pendingArticles,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── QUIZZES ──────────────────────────────────────────────────────────────────
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error('Get quizzes error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
