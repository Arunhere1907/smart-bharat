/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SEED_COMPLAINTS, GOVERNMENT_SCHEMES, DOCUMENT_CHECKLISTS } from "./src/data";
import { Complaint, Message } from "./src/types";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK lazily to avoid crashing on startup if the key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to simulated mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Database setup: Local JSON-based persistent database for complaints
const DB_FILE = path.join(process.cwd(), "complaints_db.json");

function readComplaintsDb(): Complaint[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Write seed data if file doesn't exist
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_COMPLAINTS, null, 2));
      return SEED_COMPLAINTS;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading complaints DB, falling back to seed data:", err);
    return SEED_COMPLAINTS;
  }
}

function writeComplaintsDb(complaints: Complaint[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(complaints, null, 2));
  } catch (err) {
    console.error("Error writing complaints DB:", err);
  }
}

// Helper: Haversine distance formula to calculate proximity in meters
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}

// Setup Express Middlewares
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// 1. Schemes Endpoint
app.get("/api/schemes", (req, res) => {
  res.json(GOVERNMENT_SCHEMES);
});

// 2. Documents Endpoint
app.get("/api/documents", (req, res) => {
  res.json(DOCUMENT_CHECKLISTS);
});

// 3. Complaints Endpoints
app.get("/api/complaints", (req, res) => {
  const complaints = readComplaintsDb();
  res.json(complaints);
});

// 4. Upvote Complaint
app.post("/api/complaints/:id/upvote", (req, res) => {
  const { id } = req.params;
  const complaints = readComplaintsDb();
  const complaint = complaints.find((c) => c.id === id);
  if (complaint) {
    complaint.upvoteCount = (complaint.upvoteCount || 0) + 1;
    writeComplaintsDb(complaints);
    res.json({ success: true, upvoteCount: complaint.upvoteCount });
  } else {
    res.status(404).json({ error: "Complaint not found" });
  }
});

// 5. Update Status (for demo)
app.post("/api/complaints/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const complaints = readComplaintsDb();
  const complaint = complaints.find((c) => c.id === id);
  if (complaint) {
    complaint.status = status;
    writeComplaintsDb(complaints);
    res.json({ success: true, status: complaint.status });
  } else {
    res.status(404).json({ error: "Complaint not found" });
  }
});

// 6. Submit Complaint (with Gemini Vision photo classification + Proximity Dedup)
app.post("/api/complaints", async (req, res) => {
  try {
    const { photo, latitude, longitude, manualCategory, manualDescription, manualSeverity } = req.body;

    if (!photo) {
      return res.status(400).json({ error: "Photo is required to file a complaint" });
    }

    const lat = latitude ? parseFloat(latitude) : 28.6139; // default to Delhi
    const lng = longitude ? parseFloat(longitude) : 77.2090;

    let category = manualCategory || "other";
    let severity = manualSeverity || "medium";
    let description = manualDescription || "Reported civic issue.";

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if we should call Gemini Vision API
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && photo.startsWith("data:")) {
      try {
        console.log("Calling Gemini Vision API for classification...");
        const ai = getGeminiClient();
        
        // Extract raw base64 data and mimeType
        const mimeTypeMatch = photo.match(/^data:([^;]+);base64,/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
        const base64Data = photo.replace(/^data:[^;]+;base64,/, "");

        const prompt = `Analyze this civic complaint photo taken in India. 
Categorize the issue into one of: 'pothole', 'garbage', 'streetlight', 'water_leak', or 'other'.
Estimate the severity of the issue as: 'low', 'medium', or 'high' based on road safety, health hazard, or public inconvenience.
Provide a clear, brief 2-sentence description of the issue in English in plain, friendly, helpful language. 
Be highly accurate. If you are not sure, guess based on visual cues.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: { 
                  type: Type.STRING, 
                  description: "One of: 'pothole' | 'garbage' | 'streetlight' | 'water_leak' | 'other'" 
                },
                severity: { 
                  type: Type.STRING, 
                  description: "One of: 'low' | 'medium' | 'high'" 
                },
                description: { 
                  type: Type.STRING, 
                  description: "Brief 2-sentence explanation of the problem." 
                },
              },
              required: ["category", "severity", "description"],
            },
          },
        });

        const resultText = response.text?.trim() || "{}";
        console.log("Gemini Vision API Raw Response:", resultText);
        const parsed = JSON.parse(resultText);

        if (parsed.category) category = parsed.category.toLowerCase();
        if (parsed.severity) severity = parsed.severity.toLowerCase();
        if (parsed.description) description = parsed.description;
      } catch (err) {
        console.error("Gemini Vision classification failed, using manual/default inputs:", err);
      }
    } else {
      console.log("No valid GEMINI_API_KEY found, bypassing Vision and using fallback classification.");
      // Bypassing Vision API: generate simulated category based on manual options
      if (!manualCategory) {
        category = "pothole"; // default
        description = "Pothole detected on the road, creating traffic inconvenience.";
      }
    }

    // Proximity Dedup Check
    // Proximity parameters: Same category, within 200 meters, filed within last 14 days, and not resolved.
    const complaints = readComplaintsDb();
    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const existingDuplicate = complaints.find((c) => {
      if (c.category !== category) return false;
      if (c.status === "resolved") return false;
      
      const createdTime = new Date(c.createdAt).getTime();
      if (createdTime < fourteenDaysAgo) return false;

      const distance = getHaversineDistance(lat, lng, c.latitude, c.longitude);
      return distance <= 200; // within 200 meters
    });

    if (existingDuplicate) {
      console.log("Duplicate complaint detected within 200m! Incrementing upvote...");
      existingDuplicate.upvoteCount = (existingDuplicate.upvoteCount || 0) + 1;
      writeComplaintsDb(complaints);
      return res.json({
        isDuplicate: true,
        complaint: existingDuplicate,
        message: `This issue has already been reported nearby. We've registered your report as an upvote (total upvotes: ${existingDuplicate.upvoteCount}) to prioritize it for the local authorities!`,
      });
    }

    // If not a duplicate, create a new complaint
    const newComplaint: Complaint = {
      id: "comp-" + Math.floor(1000 + Math.random() * 9000),
      category: category as any,
      severity: severity as any,
      description: description,
      photoUrl: photo, // can be the uploaded base64 data
      latitude: lat,
      longitude: lng,
      status: "open",
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
    };

    complaints.unshift(newComplaint);
    writeComplaintsDb(complaints);

    res.json({
      isDuplicate: false,
      complaint: newComplaint,
      message: `Thank you! Your civic complaint has been successfully filed with ID: ${newComplaint.id}. It is now routed to the ward counselor and municipal engineer.`,
    });
  } catch (err: any) {
    console.error("Error in POST /api/complaints:", err);
    res.status(500).json({ error: err.message || "Failed to submit complaint" });
  }
});

// 7. Multi-Agent Routing Chat Engine
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], language = "en" } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const complaints = readComplaintsDb();

    // Default Router Classification & Language Detection values
    let routedAgent: "router" | "scheme" | "document" | "complaint" | "tracker" | "general" = "general";
    let detectedLanguage = language;
    let confidence = 1.0;

    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        console.log("Calling Router Agent...");
        const ai = getGeminiClient();

        const routerPrompt = `You are the Router Agent for Smart Bharat, an AI civic companion for citizens.
Analyze the citizen's message: "${message}"

Classify it into one of the following agents:
1. 'scheme_query': if they are asking about government schemes, financial aid, subsidies, benefits, eligibility (e.g. "Am I eligible for PM Kisan?", "farmers scheme", "Sukanya Samriddhi requirements").
2. 'document_check': if they want to know what documents are required for a government service, or steps to apply for public documents (e.g. "how to apply for passport", "voter id card checklist", "documents for driving license").
3. 'file_complaint': if they want to file a civic complaint, report garbage, pothole, broken street light, water leak, or want instructions on how to report (e.g. "I want to report a garbage pile", "how to file a pothole issue", "report streetlight").
4. 'track_complaint': if they are looking up or tracking the status of a previously filed complaint, mentioning a complaint ID, or checking their report (e.g. "what is the status of comp-101?", "track my pothole complaint", "check status").
5. 'general_query': for greetings, citizen rights, or any other general inquiries.

Also detect the language or blend (e.g. English, Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali). Mention it in plain text.
Respond STRICTLY with a JSON object. Do not include markdown codeblocks.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: routerPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                agent: { 
                  type: Type.STRING, 
                  description: "One of: 'scheme_query' | 'document_check' | 'file_complaint' | 'track_complaint' | 'general_query'" 
                },
                language: { 
                  type: Type.STRING, 
                  description: "Detected language code or name, e.g. 'en', 'hi', 'hinglish', 'ta'" 
                },
                confidence: { type: Type.NUMBER },
              },
              required: ["agent", "language", "confidence"],
            },
          },
        });

        const routerText = response.text?.trim() || "{}";
        console.log("Router Agent Classification:", routerText);
        const parsed = JSON.parse(routerText);

        const mapAgent = {
          scheme_query: "scheme",
          document_check: "document",
          file_complaint: "complaint",
          track_complaint: "tracker",
          general_query: "general",
        };

        if (parsed.agent) {
          routedAgent = (mapAgent[parsed.agent as keyof typeof mapAgent] || "general") as any;
        }
        if (parsed.language) {
          detectedLanguage = parsed.language;
        }
        if (parsed.confidence) {
          confidence = parsed.confidence;
        }
      } catch (err) {
        console.error("Router Agent call failed, using keyword heuristics:", err);
        // Heuristic fallback
        const msgLower = message.toLowerCase();
        if (msgLower.includes("scheme") || msgLower.includes("kisan") || msgLower.includes("bharat") || msgLower.includes("yojana") || msgLower.includes("eligib") || msgLower.includes("benefit") || msgLower.includes("pm-")) {
          routedAgent = "scheme";
        } else if (msgLower.includes("document") || msgLower.includes("apply") || msgLower.includes("passport") || msgLower.includes("license") || msgLower.includes("pan") || msgLower.includes("voter") || msgLower.includes("ration") || msgLower.includes("checklist")) {
          routedAgent = "document";
        } else if (msgLower.includes("report") || msgLower.includes("file") || msgLower.includes("complaint") || msgLower.includes("pothole") || msgLower.includes("garbage") || msgLower.includes("streetlight") || msgLower.includes("leak") || msgLower.includes("clog")) {
          routedAgent = "complaint";
        } else if (msgLower.includes("track") || msgLower.includes("status") || msgLower.includes("comp-") || msgLower.includes("check my")) {
          routedAgent = "tracker";
        } else {
          routedAgent = "general";
        }
      }
    } else {
      console.log("No GEMINI_API_KEY available, running server-side heuristic routing.");
      const msgLower = message.toLowerCase();
      if (msgLower.includes("scheme") || msgLower.includes("kisan") || msgLower.includes("bharat") || msgLower.includes("yojana") || msgLower.includes("eligib") || msgLower.includes("benefit") || msgLower.includes("pm-")) {
        routedAgent = "scheme";
      } else if (msgLower.includes("document") || msgLower.includes("apply") || msgLower.includes("passport") || msgLower.includes("license") || msgLower.includes("pan") || msgLower.includes("voter") || msgLower.includes("ration") || msgLower.includes("checklist")) {
        routedAgent = "document";
      } else if (msgLower.includes("report") || msgLower.includes("file") || msgLower.includes("complaint") || msgLower.includes("pothole") || msgLower.includes("garbage") || msgLower.includes("streetlight") || msgLower.includes("leak") || msgLower.includes("clog")) {
        routedAgent = "complaint";
      } else if (msgLower.includes("track") || msgLower.includes("status") || msgLower.includes("comp-") || msgLower.includes("check my")) {
        routedAgent = "tracker";
      } else {
        routedAgent = "general";
      }
    }

    console.log(`Routed to Specialist Agent: [${routedAgent}] in detected language: [${detectedLanguage}]`);

    // Prepare Specialist Agent prompts & context
    let agentSystemPrompt = "";
    if (routedAgent === "scheme") {
      agentSystemPrompt = `You are the Scheme Specialist Agent for Smart Bharat. 
Answer citizen eligibility and scheme-related questions clearly using ONLY the following hardcoded scheme database:
${JSON.stringify(GOVERNMENT_SCHEMES, null, 2)}

If the user asks about a scheme that is NOT in the database, answer: "I do not have details on that scheme in my registry, but I can help you with PM-KISAN, Ayushman Bharat, Sukanya Samriddhi, PM SVANidhi, and others."
Always respond warmly in the SAME language as the citizen's message (${detectedLanguage}). If they wrote in Hindi, answer in Hindi. If Hinglish, answer in Hinglish. Keep it highly scannable, using bullet points for eligibility.`;
    } else if (routedAgent === "document") {
      agentSystemPrompt = `You are the Document Specialist Agent for Smart Bharat.
Provide required document checklists and application steps for public services using the following checklist database:
${JSON.stringify(DOCUMENT_CHECKLISTS, null, 2)}

If they ask about a service NOT listed, use your general knowledge to provide a highly accurate document checklist and step-by-step process for Indian government services, but state that they should verify with the official RTO/MCD/UIDAI portals.
Always respond warmly in the SAME language as the citizen's message (${detectedLanguage}). Keep it extremely easy to read, with clear lists and steps.`;
    } else if (routedAgent === "complaint") {
      agentSystemPrompt = `You are the Complaint Specialist Agent for Smart Bharat.
Citizen wants to file a complaint or report a civic issue (pothole, garbage, streetlight, water leak, etc.).
Guide them:
1. Tell them they can click the big "Report an Issue" card on the home screen or the "File Complaint" tab.
2. They just need to upload a photo (camera or gallery) and share their location.
3. Our AI will automatically classify the photo, estimate severity, detect if it's already reported nearby (dedup), and route it.
4. Encourage them to do this directly in the app. Explain how fast and easy it is.
Always respond warmly in the SAME language as the citizen's message (${detectedLanguage}).`;
    } else if (routedAgent === "tracker") {
      // Filter out photo base64 strings to keep prompt context short and avoid token overflow!
      const safeComplaints = complaints.map((c) => ({
        id: c.id,
        category: c.category,
        severity: c.severity,
        status: c.status,
        upvoteCount: c.upvoteCount,
        description: c.description,
        createdAt: c.createdAt,
      }));

      agentSystemPrompt = `You are the Tracker Specialist Agent for Smart Bharat.
Search our active complaints database below to answer questions about complaint statuses or tracking queries:
${JSON.stringify(safeComplaints, null, 2)}

Guidelines:
1. If the user mentions a complaint ID (e.g. comp-101, comp-104), look it up exactly. Tell them its current status ('open', 'in_progress', or 'resolved'), how many times it was upvoted, and its description.
2. If they describe a general complaint nearby without an ID, search for matching keywords (e.g. "pothole in Karol Bagh" or "garbage in Connaught Place") and share the relevant status and ID.
3. If no complaint matches, ask them for their Complaint ID (e.g. 'comp-1234') so you can check.
Always respond warmly in the SAME language as the citizen's message (${detectedLanguage}).`;
    } else {
      agentSystemPrompt = `You are the Civic Companion Agent for Smart Bharat.
Provide supportive, caring, citizen-centric companion support. 
Help them understand that Smart Bharat is their civic companion that routes queries to schemes, document checklists, filing civic complaints with AI photo detection, and tracking municipal progress.
Always respond warmly and respectfully in the SAME language as the citizen's message (${detectedLanguage}). If they wrote in Hindi, write in Hindi. If Hinglish, write in Hinglish. Avoid bureaucratic jargon entirely.`;
    }

    // Call Gemini to generate agent response
    let botReplyText = "";
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = getGeminiClient();

        // Convert simple text history to Gemini format if possible, or just inject into prompt
        const formattedHistory = history
          .slice(-6)
          .map((m: any) => `${m.sender === "user" ? "Citizen" : "Agent"}: ${m.text}`)
          .join("\n");

        const fullPrompt = `${formattedHistory}\n\nCitizen: ${message}`;

        const chatResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: fullPrompt,
          config: {
            systemInstruction: agentSystemPrompt,
            temperature: 0.7,
          },
        });

        botReplyText = chatResponse.text || "I am here to help you. Could you please rephrase?";
      } catch (err) {
        console.error("Specialist agent call failed, using fallback:", err);
        botReplyText = `[Simulated ${routedAgent} response in ${detectedLanguage}] Sorry, my connection to the AI engine was interrupted, but as the ${routedAgent} agent, I am ready to guide you on this civic query! Please verify your key.`;
      }
    } else {
      // Mock Responses when API key is missing
      console.log("Simulating response since Gemini Key is not set.");
      const msgLower = message.toLowerCase();

      if (routedAgent === "scheme") {
        const match = GOVERNMENT_SCHEMES.find(s => msgLower.includes(s.id) || msgLower.includes(s.name.toLowerCase().split(" ")[0]));
        if (match) {
          botReplyText = `**${match.name}** is a wonderful scheme for you! 
Here are the eligibility details:
${match.eligibility.map(e => `* ${e}`).join("\n")}

**Benefits:** ${match.benefits}`;
        } else {
          botReplyText = `Based on your query, here are some of our popular schemes:
1. **PM-KISAN**: Income support for farmers (₹6,000/year).
2. **Ayushman Bharat (PM-JAY)**: Free health insurance of ₹5 Lakh per year.
3. **Sukanya Samriddhi Yojana**: Dedicated high-interest savings for girl children under 10.
Which one would you like to know about?`;
        }
      } else if (routedAgent === "document") {
        const match = DOCUMENT_CHECKLISTS.find(d => msgLower.includes(d.id) || msgLower.includes(d.serviceName.toLowerCase().split(" ")[0]));
        if (match) {
          botReplyText = `For **${match.serviceName}**, here is the document checklist you need:
${match.documents.map(d => `* ${d}`).join("\n")}

**Steps to Apply:**
${match.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}`;
        } else {
          botReplyText = `I can provide checklists for services like Passport, Ration Card, Driving License, PAN Card, and Voter ID. What service are you applying for?`;
        }
      } else if (routedAgent === "complaint") {
        botReplyText = `You can easily file a complaint here! Just click on **"Report an Issue"** at the top or switch to the **"File Complaint"** page. Upload a photo of the pothole, garbage, or streetlight, and share your location. Our AI Vision model will auto-classify it, check for duplicates in your area, and file it instantly. No long forms to fill out!`;
      } else if (routedAgent === "tracker") {
        const matchId = msgLower.match(/comp-\d+/);
        if (matchId) {
          const matchedComplaint = complaints.find(c => c.id === matchId[0]);
          if (matchedComplaint) {
            botReplyText = `I found your complaint **${matchedComplaint.id}** for a **${matchedComplaint.category}** issue.
* **Status:** ${matchedComplaint.status.toUpperCase()}
* **Severity:** ${matchedComplaint.severity.toUpperCase()}
* **Description:** ${matchedComplaint.description}
* **Upvotes:** ${matchedComplaint.upvoteCount} citizens reported/upvoted this.
* **Created on:** ${new Date(matchedComplaint.createdAt).toLocaleDateString()}`;
          } else {
            botReplyText = `I searched for complaint ID **${matchId[0]}** but couldn't find it in our records. Please make sure the ID is correct (e.g., 'comp-101').`;
          }
        } else {
          botReplyText = `Please share your **Complaint ID** (like 'comp-101' or 'comp-104') and I will immediately look up its municipal resolution status for you!`;
        }
      } else {
        botReplyText = `Hello! Welcome to Smart Bharat. I am your AI Civic Companion. 
I can help you:
1. **Find Schemes**: Check your eligibility for PM-KISAN, Ayushman Bharat, etc.
2. **Check Documents**: Get checklists for Passport, Driving License, Voter ID, etc.
3. **File Complaints**: Report street issues like potholes or garbage by uploading a photo.
4. **Track Status**: Look up and track previously filed complaints.

How can I assist you today? (You can type in English, Hindi, or Hinglish!)`;
      }

      // Add regional translation simulation
      if (detectedLanguage !== "en") {
        botReplyText = `[Simulated ${detectedLanguage.toUpperCase()} translation of Agent Response]\n\n${botReplyText}`;
      }
    }

    res.json({
      text: botReplyText,
      routedAgent: routedAgent,
      language: detectedLanguage,
    });
  } catch (err: any) {
    console.error("Error in POST /api/chat:", err);
    res.status(500).json({ error: err.message || "Failed to process chat" });
  }
});

// Serve frontend assets using Vite middleware or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server middleware in Development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static assets in Production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Bharat backend server listening on port ${PORT}`);
  });
}

startServer();
