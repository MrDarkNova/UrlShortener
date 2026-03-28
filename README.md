# 🔗 DarkNova URL Shortener

A full-stack URL shortener SaaS built by **Victor Kumba (Mr. Darknova)**.

**Stack:** React · Node.js · Express · MongoDB  
**Features:** Link shortening · Custom aliases · Click analytics · Expiry dates · Dashboard

---

## 📁 Project Structure

```
darknova-url/
├── backend/          ← Node.js + Express API
│   ├── src/
│   │   ├── index.js          ← Entry point / Express server
│   │   ├── models/Url.js     ← MongoDB schema
│   │   └── routes/urls.js    ← API route handlers
│   ├── .env.example
│   └── package.json
│
└── frontend/         ← React + Vite UI
    ├── src/
    │   ├── App.jsx           ← Main component (all UI)
    │   ├── index.css         ← Global styles
    │   └── main.jsx          ← React entry
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://mongodb.com/atlas))

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/darknova-urls
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/darknova-urls

BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

```bash
# Start the backend
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a short URL |
| GET | `/api/links` | Get all links (dashboard) |
| GET | `/api/stats/:code` | Get click stats for a link |
| DELETE | `/api/links/:code` | Delete a link |
| GET | `/:code` | Redirect to original URL |

### Example: Shorten a URL

```http
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com/very-long-url",
  "customAlias": "my-link",    // optional
  "expiresIn": "7"             // optional: days (or "never")
}
```

Response:
```json
{
  "success": true,
  "shortUrl": "http://localhost:5000/my-link",
  "shortCode": "my-link",
  "originalUrl": "https://example.com/very-long-url",
  "clicks": 0,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## ☁️ Deployment

### Backend → Railway / Render / Fly.io
1. Push `backend/` to GitHub
2. Connect to Railway or Render
3. Add environment variables (PORT, MONGODB_URI, BASE_URL, FRONTEND_URL)
4. Deploy

### Frontend → Vercel / Netlify
1. Push `frontend/` to GitHub
2. Import into Vercel/Netlify
3. Add `VITE_API_URL=https://your-backend-url.com/api` as env variable
4. Deploy

---

## ✨ Features

- ✅ URL shortening with 7-char nanoid codes
- ✅ Custom alias support
- ✅ Link expiry (1 / 7 / 30 / 90 days)
- ✅ Click tracking with timestamps & referrers
- ✅ Link dashboard with stats
- ✅ Delete links
- ✅ Rate limiting (security)
- ✅ Helmet.js security headers
- ✅ MongoDB TTL index for auto-expiry
- ✅ Matching DarkNova portfolio aesthetic

---

## 👤 Author

**Victor Kumba** — Mr. Darknova  
GitHub: [@MrDarkNova](https://github.com/MrDarkNova)  
Portfolio: [mrdarknova.indevs.in](https://mrdarknova.indevs.in)
