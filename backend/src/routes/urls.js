const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

function isValidUrl(string) {
  try {
    const u = new URL(string);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresIn } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'URL is required' });
    if (!isValidUrl(originalUrl)) return res.status(400).json({ error: 'Invalid URL' });
    let shortCode = customAlias ? customAlias.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase() : nanoid(7);
    if (customAlias) {
      const existing = await Url.findOne({ shortCode });
      if (existing) return res.status(409).json({ error: 'Alias taken' });
    }
    let expiresAt = null;
    if (expiresIn && expiresIn !== 'never') {
      const days = parseInt(expiresIn);
      if (!isNaN(days)) expiresAt = new Date(Date.now() + days * 86400000);
    }
    const url = new Url({ originalUrl, shortCode, customAlias: customAlias || null, expiresAt });
    await url.save();
    const base = process.env.BASE_URL || 'http://localhost:5000';
    res.status(201).json({ success: true, shortUrl: base + '/' + shortCode, shortCode, originalUrl, expiresAt, clicks: 0, createdAt: url.createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'Not found' });
    const base = process.env.BASE_URL || 'http://localhost:5000';
    res.json({ shortUrl: base + '/' + url.shortCode, shortCode: url.shortCode, originalUrl: url.originalUrl, clicks: url.clicks, expiresAt: url.expiresAt, createdAt: url.createdAt, recentClicks: url.clickData.slice(-10).reverse() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/links', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const urls = await Url.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-clickData');
    const total = await Url.countDocuments({ isActive: true });
    const base = process.env.BASE_URL || 'http://localhost:5000';
    res.json({ links: urls.map(function(u) { return { shortUrl: base + '/' + u.shortCode, shortCode: u.shortCode, originalUrl: u.originalUrl, clicks: u.clicks, expiresAt: u.expiresAt, createdAt: u.createdAt }; }), total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/links/:code', async (req, res) => {
  try {
    const url = await Url.findOneAndUpdate({ shortCode: req.params.code }, { isActive: false }, { new: true });
    if (!url) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
