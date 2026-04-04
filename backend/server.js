require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

// ── Route imports ────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const questionRoutes  = require('./routes/questions');
const articleRoutes   = require('./routes/articles');
const userRoutes      = require('./routes/users');
const statsRoutes     = require('./routes/stats');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api',           authRoutes);      // POST /api/login, /api/register, PUT /api/users/:id/verify
app.use('/api/questions', questionRoutes);  // CRUD for questions
app.use('/api/articles',  articleRoutes);   // GET, approve, delete articles
app.use('/api/users',     userRoutes);      // GET all, DELETE user
app.use('/api',           statsRoutes);     // GET /api/stats, /api/quizzes

// ── Start ────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => console.log(`\nMindBloom API → http://localhost:${PORT}\n`));
});
