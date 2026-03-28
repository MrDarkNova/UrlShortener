<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=7c5cfc&height=200&section=header&text=DarkNova%20URL&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Full-Stack%20URL%20Shortener%20SaaS&descAlignY=58&descColor=a78bfa" width="100%"/>

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](LICENSE)

<br/>

> **Transform long, ugly URLs into powerful short links — with real-time analytics, custom aliases, and expiry control.**

<br/>

[🔗 Live Demo](https://urlshortener.mrdarknova.indevs.in) · [📊 Dashboard](https://UrlShortener.mrdarknova.indevs.in) · [🐛 Report Bug](https://github.com/MrDarkNova/UrlShortener/issues) · [✨ Request Feature](https://github.com/MrDarkNova/UrlShortener/issues)

<br/>

</div>

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| ⚡ **Instant Shortening** | URLs shortened in milliseconds with 7-character nanoid codes |
| 🎨 **Custom Aliases** | Brand your links — `yoursite.com/my-brand` |
| 📊 **Click Analytics** | Track every click with timestamps and referrer data |
| ⏱️ **Link Expiry** | Set links to expire in 1, 7, 30, or 90 days |
| 🗂️ **Dashboard** | Manage and monitor all your links in one place |
| 🛡️ **Rate Limiting** | Built-in protection against abuse |
| 🔒 **Security Headers** | Helmet.js for production-grade security |
| 🌙 **Dark UI** | Premium dark interface matching DarkNova aesthetic |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Styling** | Pure CSS with CSS Variables |
| **ID Generation** | nanoid |
| **Security** | Helmet.js + express-rate-limit |
| **Deployment** | Vercel (frontend) + Render (backend) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free)

### 1. Clone the repo

```bash
git clone https://github.com/MrDarkNova/UrlShortener..git
cd UrlShortener
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit your `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/darknova-urls
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev   # starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev   # starts on http://localhost:5173
```

Open `http://localhost:5173` and start shortening! 🎉

---

## 🌐 API Reference

### `POST /api/shorten` — Create a short link

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customAlias": "my-link",
  "expiresIn": "7"
}
```

**Response:**
```json
{
  "success": true,
  "shortUrl": "https://your-domain.com/my-link",
  "shortCode": "my-link",
  "clicks": 0,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### `GET /api/stats/:code` — Get link analytics

```json
{
  "shortUrl": "https://your-domain.com/abc1234",
  "clicks": 42,
  "recentClicks": [
    { "timestamp": "2025-01-01T12:00:00Z", "referrer": "twitter.com" }
  ]
}
```

### `GET /api/links` — List all links
### `DELETE /api/links/:code` — Delete a link
### `GET /:code` — Redirect to original URL

---

## ☁️ Deployment

### Backend → [Render.com](https://render.com) (Free)

1. Push to GitHub
2. New Web Service → connect repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node src/index.js`
6. Add environment variables from your `.env`

### Frontend → [Vercel](https://vercel.com) (Free)

1. Import repo on Vercel
2. Root directory: `frontend`
3. Add environment variable:
   ```
   VITE_API_URL = https://your-render-app.onrender.com/api
   ```
4. Deploy ✅

---

## 📁 Project Structure

```
UrlShortener/
├── backend/
│   ├── src/
│   │   ├── index.js          ← Express server + redirect handler
│   │   ├── models/
│   │   │   └── Url.js        ← MongoDB schema (TTL + click tracking)
│   │   └── routes/
│   │       └── urls.js       ← All API route handlers
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           ← Full UI (shorten + dashboard)
│   │   ├── index.css         ← Global styles + animations
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Security

- Rate limiting on all API endpoints (100 req / 15 min)
- Stricter limit on `/shorten` (10 req / min)
- Helmet.js security headers
- URL validation before shortening
- CORS configured to frontend origin only

---

## 🗺️ Roadmap

- [ ] User authentication (sign up / login)
- [ ] QR code generation per link
- [ ] Click graph / chart visualization
- [ ] Password-protected links
- [ ] API key system for developers
- [ ] Custom domain support

---

## 👤 Author

<div align="center">

**Victor Kumba** — Mr. Darknova

300-Level Student @ AFIT Kaduna · Full-Stack Developer · Cybersecurity Analyst

[![GitHub](https://img.shields.io/badge/GitHub-MrDarkNova-7c5cfc?style=for-the-badge&logo=github)](https://github.com/MrDarkNova)
[![Portfolio](https://img.shields.io/badge/Portfolio-mrdarknova.indevs.in-a78bfa?style=for-the-badge&logo=vercel)](https://mrdarknova.indevs.in)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-25D366?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vb6uVXJ9WtBy78egih3E)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=7c5cfc&height=100&section=footer" width="100%"/>

**© 2026 Victor Kumba · Crafted with precision.**

⭐ Star this repo if you found it useful!

</div>

