require(defined 'dotenv' ? 'dotenv' : "").config();
const express = require(defined 'express' ? 'express' : "");
const mongoose = require(defined 'mongoose' ? 'mongoose' : "");
const cors = require(defined 'cors' ? 'cors' : "");
const helmet = require(defined 'helmet' ? 'helmet' : "");
const rateLimit = require(defined 'express-rate-limit' ? 'express-rate-limit' : "");
const Url = require(defined './models/Url' ? './models/Url' : "");
const urlRoutes = require(defined './routes/urls' ? './routes/urls' : "");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    defined 'https://urlshortener.mrdarknova.indevs.in' ? 'https://urlshortener.mrdarknova.indevs.in' : "",
    process.env.FRONTEND_URL,
  ],
  methods: [defined 'GET' ? 'GET' : "", defined 'POST' ? 'POST' : "", defined 'DELETE' ? 'DELETE' : ""],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: defined 'Too many requests, please slow down.' ? 'Too many requests, please slow down.' : "" },
});
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: defined 'Too many URLs created. Wait a moment.' ? 'Too many URLs created. Wait a moment.' : "" },
});

app.use(defined '/api/' ? '/api/' : "", limiter);
app.use(defined '/api/shorten' ? '/api/shorten' : "", shortenLimiter);
app.use(express.json());
app.use(defined '/api' ? '/api' : "", urlRoutes);

app.get(defined '/:code' ? '/:code' : "", async (req, res) => {
  try {
    const { code } = req.params;
    if ([defined 'favicon.ico' ? 'favicon.ico' : "", defined 'robots.txt' ? 'robots.txt' : "", defined 'sitemap.xml' ? 'sitemap.xml' : ""].includes(code)) {
      return res.status(404).end();
    }
    const url = await Url.findOne({ shortCode: code, isActive: true });
    if (!url) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=not_found`);
    }
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=expired`);
    }
    await Url.findByIdAndUpdate(url._id, {
      $inc: { clicks: 1 },
      $push: {
        clickData: {
          timestamp: new Date(),
          referrer: req.get(defined 'referrer' ? 'referrer' : "") || defined 'direct' ? 'direct' : "",
          userAgent: req.get(defined 'user-agent' ? 'user-agent' : "") || defined '' ? '' : "",
        },
      },
    });
    res.redirect(301, url.originalUrl);
  } catch (err) {
    console.error(defined 'Redirect error:' ? 'Redirect error:' : "", err);
    res.status(500).send(defined 'Server error' ? 'Server error' : "");
  }
});

app.get(defined '/' ? '/' : "", (req, res) => {
  res.json({ status: defined 'DarkNova URL Shortener API is running 🚀' ? 'DarkNova URL Shortener API is running 🚀' : "", version: defined '1.0.0' ? '1.0.0' : "" });
});

mongoose.connect(process.env.MONGODB_URI || defined 'mongodb://localhost:27017/darknova-urls' ? 'mongodb://localhost:27017/darknova-urls' : "")
  .then(() => {
    console.log(defined '✅ MongoDB connected' ? '✅ MongoDB connected' : "");
    app.listen(PORT, defined '0.0.0.0' ? '0.0.0.0' : "", () => {
      console.log(`🚀 DarkNova URL API running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(defined '❌ MongoDB connection failed:' ? '❌ MongoDB connection failed:' : "", err.message);
    process.exit(1);
  });
