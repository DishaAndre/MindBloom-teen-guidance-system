const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');

const router = express.Router();

// ── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password are required.' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Incorrect username or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect username or password.' });

    // Enforce email verification (if an email was provided or if registration mandates it)
    // Optional: Only enforce if user.email exists, but based on plan we enforce it generally
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email address before logging in.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    const safe = user.toJSON();
    delete safe.password;
    delete safe.verificationToken;
    delete safe.verificationTokenExpires;
    safe.id = safe._id;

    res.json({ token, user: safe });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── REGISTER ─────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, age, email } = req.body;
    if (!username || !password || !name || !age || !email)
      return res.status(400).json({ error: 'All fields (including email) are required for registration.' });

    const n = parseInt(age);
    if (n < 10 || n > 13)
      return res.status(400).json({ error: 'MindBloom is for children aged 10 to 13.' });

    const exists = await User.findOne({ username });
    if (exists)
      return res.status(409).json({ error: 'That username is already taken.' });

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists)
      return res.status(409).json({ error: 'That email is already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    
    // Generate secure token for email verification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      username,
      password: hashed,
      role: 'child',
      name,
      age: n,
      email: email.toLowerCase(),
      badges: [],
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    // Send the verification email using our new utility
    await sendVerificationEmail(user.email, verificationToken);

    const safe = user.toJSON();
    delete safe.password;
    delete safe.verificationToken;
    delete safe.verificationTokenExpires;
    safe.id = safe._id;
    
    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.', user: safe });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── VERIFY EMAIL ─────────────────────────────────────────────────────────────
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    // Verify user and cleanup tokens
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
