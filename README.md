<div align="center">
<h1>🇮🇳 Smart Bharat — AI Civic Companion</h1>
<p><strong>AI-powered civic platform</strong> for Indian citizens to check government scheme eligibility, get document checklists, file civic complaints with AI photo classification, and track municipal issues — all in their preferred language.</p>
</div>

---

## ✨ Features

- **🤖 Multi-Agent AI Chat** — Routes queries to specialized agents (Schemes, Documents, Complaints, Tracker) powered by Gemini
- **📸 AI Photo Complaint Filing** — Upload a photo; Gemini Vision auto-classifies the issue type and severity
- **📍 Proximity Dedup** — Automatically detects duplicate reports within 200m using Haversine formula
- **🗺️ Live Dashboard** — Interactive Leaflet map with real-time complaint tracking and statistics
- **🗣️ Voice Input/Output** — Speech-to-text input and text-to-speech for responses
- **🌐 Multilingual** — English, Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Vercel Serverless Functions (Node.js) |
| AI | Google Gemini API (gemini-2.5-flash) |
| Maps | Leaflet + OpenStreetMap |
| Deployment | Vercel (via GitHub) |

---

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- [GitHub account](https://github.com)
- [Vercel account](https://vercel.com) (sign up with GitHub)
- [Gemini API Key](https://aistudio.google.com/apikey) (free tier available)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/smart-bharat.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **"Import"** next to your GitHub repository
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `vite build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

3. **Set Environment Variables**
   - In Vercel project → **Settings** → **Environment Variables**
   - Add: `GEMINI_API_KEY` = `<your key from Google AI Studio>`

4. **Deploy!**
   - Click **Deploy** — your app will be live at `https://your-project.vercel.app`
   - Every `git push` to `main` auto-deploys

---

## 💻 Run Locally

### Prerequisites
- Node.js 18+

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

> **Note:** The app works without a Gemini API key using simulated mock responses for demo purposes.

---

## 📁 Project Structure

```
smart-bharat/
├── api/                    # Vercel Serverless Functions
│   ├── _shared/store.ts    # In-memory complaint store
│   ├── chat.ts             # Multi-agent AI chat endpoint
│   ├── complaints.ts       # Complaint CRUD + Gemini Vision
│   ├── complaints/[id]/    # Upvote & status endpoints
│   ├── documents.ts        # Document checklists
│   └── schemes.ts          # Government schemes
├── src/                    # React Frontend
│   ├── components/         # UI components
│   ├── App.tsx             # Main app with tab navigation
│   ├── data.ts             # Seed data
│   ├── translations.ts     # i18n strings (7 languages)
│   └── types.ts            # TypeScript interfaces
├── server.ts               # Express server (local dev)
├── vercel.json             # Vercel deployment config
└── index.html              # Entry point
```

---

## 🔑 API Keys Required

| Service | Purpose | Get It |
|---------|---------|--------|
| **Gemini API Key** | AI chat, photo classification | [Google AI Studio](https://aistudio.google.com/apikey) (Free tier: 15 RPM) |

> The app works without an API key using mock/simulated responses.

---

## 📜 License

Apache-2.0
