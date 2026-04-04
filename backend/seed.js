/**
 * seed.js — One-time script to migrate data.json into MongoDB
 *
 * Run:  node seed.js
 *
 * This script:
 *  1. Reads data.json
 *  2. Hashes all passwords with bcrypt
 *  3. Maps old IDs to new MongoDB ObjectIds
 *  4. Inserts Users → Questions → Articles → Quizzes in order
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const fs       = require('fs');
const path     = require('path');

const User     = require('./models/User');
const Question = require('./models/Question');
const Article  = require('./models/Article');
const Quiz     = require('./models/Quiz');

async function seed() {
  try {
    // Connect
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read source data
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8'));
    console.log(`📂 Loaded data.json — ${data.users.length} users, ${data.questions.length} questions, ${data.articles.length} articles, ${data.quizzes.length} quizzes`);

    // Clear existing collections (safe for initial seeding)
    await Promise.all([
      User.deleteMany({}),
      Question.deleteMany({}),
      Article.deleteMany({}),
      Quiz.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing collections');

    // ── 1. Seed Users ────────────────────────────────────────────────────────
    const idMap = {}; // old id → new ObjectId

    for (const u of data.users) {
      const hashed = await bcrypt.hash(u.password, 10);
      const doc = await User.create({
        username:       u.username,
        password:       hashed,
        role:           u.role,
        name:           u.name,
        age:            u.age || undefined,
        specialization: u.specialization || undefined,
        badges:         u.badges || [],
        isVerified:     true, // seed users are pre-verified
      });
      idMap[u.id] = doc._id;
      console.log(`  👤 ${u.role.padEnd(9)} ${u.username}`);
    }
    console.log(`✅ Seeded ${data.users.length} users\n`);

    // ── 2. Seed Questions ────────────────────────────────────────────────────
    for (const q of data.questions) {
      await Question.create({
        userId:        idMap[q.userId],
        userName:      q.userName,
        title:         q.title,
        content:       q.content,
        category:      q.category,
        isPrivate:     q.isPrivate,
        isUrgent:      q.isUrgent,
        status:        q.status,
        assignedTo:    q.assignedTo ? idMap[q.assignedTo] : null,
        counselorName: q.counselorName,
        reply:         q.reply,
        isFlagged:     q.isFlagged,
        answeredAt:    q.answeredAt ? new Date(q.answeredAt) : null,
        createdAt:     new Date(q.createdAt),
      });
      console.log(`  ❓ "${q.title.substring(0, 50)}"`);
    }
    console.log(`✅ Seeded ${data.questions.length} questions\n`);

    // ── 3. Seed Articles ─────────────────────────────────────────────────────
    for (const a of data.articles) {
      await Article.create({
        title:      a.title,
        category:   a.category,
        summary:    a.summary,
        tips:       a.tips,
        approved:   a.approved,
        authorName: a.authorName,
      });
      console.log(`  📄 "${a.title}"`);
    }
    console.log(`✅ Seeded ${data.articles.length} articles\n`);

    // ── 4. Seed Quizzes ──────────────────────────────────────────────────────
    for (const qz of data.quizzes) {
      await Quiz.create({
        title:     qz.title,
        questions: qz.questions,
      });
      console.log(`  🧩 "${qz.title}"`);
    }
    console.log(`✅ Seeded ${data.quizzes.length} quizzes\n`);

    console.log('🎉 Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
