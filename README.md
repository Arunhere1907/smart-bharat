<div align="center">

# Smart Bharat
### AI-Powered Civic Companion

*Bridging citizens and municipal governance through intelligent, accessible technology*

</div>

---

## Overview

Smart Bharat is an AI-driven civic platform built for Indian citizens to navigate government services with ease. It consolidates scheme eligibility checks, document guidance, and civic complaint filing into a single, multilingual interface — removing the friction that typically stands between citizens and effective governance.

Rather than a static form-filling tool, Smart Bharat uses a multi-agent AI architecture to understand intent, classify issues from photographic evidence, and route requests intelligently — making civic engagement feel less like paperwork and more like a conversation.

---

## Core Capabilities

**Multi-Agent Intelligence**
A Gemini-powered agent router directs queries to specialized domains — Schemes, Documents, Complaints, and Tracking — ensuring each request is handled by the right logic rather than a single generalized model.

**Visual Complaint Filing**
Citizens can simply upload a photo of a civic issue (a pothole, garbage pileup, broken streetlight). Gemini Vision automatically classifies the issue type and estimates severity, cutting down manual reporting effort.

**Intelligent Deduplication**
A Haversine-based proximity engine detects and merges duplicate reports filed within 200 meters of one another, keeping the complaint database clean and actionable for municipal bodies.

**Live Civic Dashboard**
An interactive Leaflet map visualizes complaints in real time, giving both citizens and administrators a transparent view of ongoing civic issues.

**Voice-First Accessibility**
Full speech-to-text and text-to-speech support ensures the platform is usable by citizens across literacy levels and comfort with typing.

**Multilingual by Design**
Native support for English, Hindi, Hinglish, Tamil, Telugu, Kannada, and Bengali — built to reflect the linguistic diversity of the country it serves.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Vercel Serverless Functions (Node.js) |
| AI Engine | Google Gemini API (`gemini-2.5-flash`) |
| Mapping | Leaflet + OpenStreetMap |
| Deployment | Vercel (via GitHub) |

---

## Getting Started

### Deploying to Vercel (Recommended)

**Prerequisites**
- A [GitHub account](https://github.com)
- A [Vercel account](https://vercel.com) (sign in with GitHub)
- A [Gemini API key](https://aistudio.google.com/apikey) (a free tier is available)

**Steps**

1. Push the project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/smart-bharat.git
   git push -u origin main
   ```

2. Import the repository into Vercel:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Select **Import** next to your repository
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `vite build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

3. Configure environment variables:
   - Navigate to **Settings → Environment Variables**
   - Add `GEMINI_API_KEY` with your key from Google AI Studio

4. Deploy:
   - Click **Deploy** — the app will go live at `https://your-project.vercel.app`
   - Every push to `main` triggers an automatic redeployment

### Running Locally

**Prerequisites:** Node.js 18+

```bash
npm install
```

Create a `.env.local` file and add your API key:
```
GEMINI_API_KEY=your_api_key_here
```

Start the development server:
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> Note: The application remains fully functional without a Gemini API key, falling back to simulated responses for demonstration purposes.

---

## Project Structure

```
smart-bharat/
├── api/                    Vercel Serverless Functions
│   ├── _shared/store.ts    In-memory complaint store
│   ├── chat.ts             Multi-agent AI chat endpoint
│   ├── complaints.ts       Complaint CRUD + Gemini Vision
│   ├── complaints/[id]/    Upvote & status endpoints
│   ├── documents.ts        Document checklists
│   └── schemes.ts          Government schemes
├── src/                    React frontend
│   ├── components/         UI components
│   ├── App.tsx             Main app with tab navigation
│   ├── data.ts             Seed data
│   ├── translations.ts     i18n strings (7 languages)
│   └── types.ts            TypeScript interfaces
├── server.ts               Express server (local development)
├── vercel.json             Vercel deployment configuration
└── index.html              Application entry point
```

---

## Required API Keys

| Service | Purpose | Where to Get It |
|---|---|---|
| Gemini API Key | Powers AI chat and photo classification | [Google AI Studio](https://aistudio.google.com/apikey) — free tier includes 15 requests/minute |

The application degrades gracefully without a key, using mock responses so the experience remains demonstrable out of the box.

---

## License

Distributed under the Apache-2.0 License.