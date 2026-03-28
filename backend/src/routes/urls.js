const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:'\;
  } catch {
    return false;
  }
}

router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresIn } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'URL is required' });
    if (!isValidUrl(originalUrl)) return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' });

    let shortCode;
    if (customAlias) {
      const aliasClean = customAlias.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
      if (aliasClean.length < 3) return res.status(400).json({ error: 'Custom alias must be at least 3 characters' });
      const existing = await Url.findOne({ shortCode: aliasClean });
      if (existing) return res.status(409).json({ error: 'This alias is already taken' });
      shortCode = aliasClean;
    } else {
      shortCode = nanoid(7);
    }

    let expiresAt = null;
    if (expiresIn && expiresIn !== 'never') {
      const days = parseInt(expiresIn);
      if (!isNaN(days) && days > 0) expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const url = new Url({ originalUrl, shortCode, customAlias: customAlias || null, expiresAt });
    await url.save();

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.status(201).json({ success: true, shortUrl: `${baseUrl}/${shortCode}`, shortCode, originalUrl, expiresAt, clicks: 0, createdAt: url.createdAt });
  } catch (err) {
    console.error('Shorten error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'Short link not found' });
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.json({ shortUrl: `${baseUrl}/${url.shortCode}`, shortCode: url.shortCode, originalUrl: url.originalUrl, clicks: url.clicks, isActive: url.isActive, expiresAt: url.expiresAt, createdAt: url.createdAt, recentClicks: url.clickData.slice(-10).reverse() });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/links', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [urls, total] = await Promise.all([
      Url.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-clickData'),
      Url.countDocuments({ isActive: true }),
    ]);
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.json({ links: urls.map(u => ({ shortUrl: `${baseUrl}/${u.shortCode}`, shortCode: u.shortCode, originalUrl: u.originalUrl, clicks: u.clicks, expiresAt: u.expiresAt, createdAt: u.createdAt })), total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/links/:code', async (req, res) => {
  try {
    const url = await Url.findOneAndUpdate({ shortCode: req.params.code }, { isActive: false }, { new: true });
    if (!url) return res.status(404).json({ error: 'Link not found' });
    res.json({ success: true, message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
