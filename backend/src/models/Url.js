const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, unique: true, index: true },
  customAlias: { type: String, default: null },
  clicks: { type: Number, default: 0 },
  clickData: [{ timestamp: { type: Date, default: Date.now }, referrer: String, userAgent: String }],
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } });

module.exports = mongoose.model('Url', urlSchema);
