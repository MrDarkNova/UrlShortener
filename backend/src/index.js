require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Url = require('./models/Url');
const urlRoutes = require('./routes/urls');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
}));

// ── Rate Limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please slow down.' },
});
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many URLs created. Wait a moment.' },
});

app.use('/api/', limiter);
app.use('/api/shorten', shortenLimiter);

// ── Body Parser ───────────────────────────────────────────
app.use(express.json());

// ── API Routes ────────────────────────────────────────────
app.use('/api', urlRoutes);

// ── Redirect Route ────────────────────────────────────────
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Ignore common browser/dev requests
    if (['favicon.ico', 'robots.txt', 'sitemap.xml'].includes(code)) {
      return res.status(404).end();
    }

    const url = await Url.findOne({ shortCode: code, isActive: true });

    if (!url) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=not_found`);
    }

    // Check expiry
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=expired`);
    }

    // Track click
    await Url.findByIdAndUpdate(url._id, {
      $inc: { clicks: 1 },
      $push: {
        clickData: {
          timestamp: new Date(),
          referrer: req.get('referrer') || 'direct',
          userAgent: req.get('user-agent') || '',
        },
      },
    });

    res.redirect(301, url.originalUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    res.status(500).send('Server error');
  }
});

// ── Health Check ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    status: 'DarkNova URL Shortener API is running 🚀',
    version: '1.0.0',
  });
});

// ── MongoDB Connection ────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/darknova-urls')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0' () => {
      console.log(`🚀 DarkNova URL API running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
