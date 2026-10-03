const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

router.post('/shorten', async (req, res) => {
  try {
    const body = req.body || {};
    const rawUrl = typeof body.originalUrl === 'string' ? body.originalUrl.trim() : '';
    const customAlias = body.customAlias;
    const expiresIn = body.expiresIn;

    if (!rawUrl) return res.status(400).json({ error: 'URL is required' });
    if (!isValidUrl(rawUrl)) return res.status(400).json({ error: 'Invalid URL' });
    if (customAlias != null && typeof customAlias !== 'string') {
      return res.status(400).json({ error: 'Custom alias must be text' });
    }

    const aliasText = typeof customAlias === 'string' ? customAlias.trim().toLowerCase() : '';
    const hasCustomAlias = aliasText.length > 0;
    if (hasCustomAlias && !/^[a-z0-9_-]{3,32}$/.test(aliasText)) {
      return res.status(400).json({ error: 'Custom alias must be 3–32 characters using letters, numbers, hyphens, or underscores.' });
    }

    const shortCode = hasCustomAlias ? aliasText : nanoid(7);
    if (hasCustomAlias) {
      const existing = await Url.findOne({ shortCode });
      if (existing) return res.status(409).json({ error: 'Alias taken' });
    }

    let expiresAt = null;
    if (expiresIn != null && expiresIn !== '' && expiresIn !== 'never') {
      const days = Number(expiresIn);
      if (!Number.isInteger(days) || days < 1 || days > 3650) {
        return res.status(400).json({ error: 'Expiry must be a whole number of days between 1 and 3650' });
      }
      expiresAt = new Date(Date.now() + days * 86400000);
    }

    const url = new Url({ originalUrl: rawUrl, shortCode, customAlias: hasCustomAlias ? shortCode : null, expiresAt });
    try {
      await url.save();
    } catch (err) {
      if (err && err.code === 11000) return res.status(409).json({ error: 'Alias taken' });
      throw err;
    }

    const base = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    res.status(201).json({ success: true, shortUrl: base + '/' + shortCode, shortCode, originalUrl: rawUrl, expiresAt, clicks: 0, createdAt: url.createdAt });
  } catch (err) {
    console.error('Shorten error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code, isActive: true });
    if (!url) return res.status(404).json({ error: 'Not found' });
    const base = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    res.json({ shortUrl: base + '/' + url.shortCode, shortCode: url.shortCode, originalUrl: url.originalUrl, clicks: url.clicks, expiresAt: url.expiresAt, createdAt: url.createdAt, recentClicks: url.clickData.slice(-10).reverse() });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/links', async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 12;
    const skip = (page - 1) * limit;
    const [urls, total, clickTotals] = await Promise.all([
      Url.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-clickData'),
      Url.countDocuments({ isActive: true }),
      Url.aggregate([{ $match: { isActive: true } }, { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }]),
    ]);
    const base = (process.env.BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const totalClicks = clickTotals.length ? clickTotals[0].totalClicks : 0;
    res.json({
      links: urls.map((url) => ({ shortUrl: base + '/' + url.shortCode, shortCode: url.shortCode, originalUrl: url.originalUrl, clicks: url.clicks, expiresAt: url.expiresAt, createdAt: url.createdAt })),
      total,
      totalClicks,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error('Links error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/links/:code', async (req, res) => {
  try {
    const url = await Url.findOneAndUpdate({ shortCode: req.params.code, isActive: true }, { isActive: false }, { new: true });
    if (!url) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete link error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
