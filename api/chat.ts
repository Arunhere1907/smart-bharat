import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";
import { GOVERNMENT_SCHEMES, DOCUMENT_CHECKLISTS } from "../src/data";
import { getComplaints } from "./_shared/store";
import { validateChatMessage, sanitizeText } from "./_shared/validation";
import { rateLimit, RateLimits } from "./_shared/ratelimit";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: { headers: { "User-Agent": "smartbharat-vercel" } },
    });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 20 chat messages per minute
  const rateLimitResult = rateLimit(req, RateLimits.CHAT);
  if (rateLimitResult) {
    return res.status(rateLimitResult.statusCode).json(rateLimitResult.body);
  }

  try {
    const { message, history = [], language = "en" } = req.body;

    // Validate and sanitize message
    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const sanitizedMessage = sanitizeText(message, 5000);

    const apiKey = process.env.GEMINI_API_KEY;
    const complaints = getComplaints();

    let routedAgent: "router" | "scheme" | "document" | "complaint" | "tracker" | "general" = "general";
    let detectedLanguage = language;
    let confidence = 1.0;

    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = getGeminiClient();

        const routerPrompt = `You are the Router Agent for Smart Bharat, an AI civic companion for citizens.
Analyze the citizen's message: "${sanitizedMessage}"

Classify it into one of the following agents:
1. 'scheme_query': if they are asking about government schemes, financial aid, subsidies, benefits, eligibility.
2. 'document_check': if they want to know what documents are required for a government service.
3. 'file_complaint': if they want to file a civic complaint, report garbage, pothole, broken street light, water leak.
4. 'track_complaint': if they are looking up or tracking the status of a previously filed complaint.
5. 'general_query': for greetings, citizen rights, or any other general inquiries.

Also detect the language or blend (e.g. English, Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali).
Respond STRICTLY with a JSON object.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: routerPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                agent: { type: Type.STRING, description: "One of: 'scheme_query' | 'document_check' | 'file_complaint' | 'track_complaint' | 'general_query'" },
                language: { type: Type.STRING, description: "Detected language code" },
                confidence: { type: Type.NUMBER },
              },
              required: ["agent", "language", "confidence"],
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || "{}");
        const mapAgent: Record<string, string> = {
          scheme_query: "scheme",
          document_check: "document",
          file_complaint: "complaint",
          track_complaint: "tracker",
          general_query: "general",
        };

        if (parsed.agent) routedAgent = (mapAgent[parsed.agent] || "general") as any;
        if (parsed.language) detectedLanguage = parsed.language;
        if (parsed.confidence) confidence = parsed.confidence;
      } catch (err) {
        console.error("Router Agent call failed:", err);
        routedAgent = heuristicRoute(message);
      }
    } else {
      routedAgent = heuristicRoute(message);
    }

    // Build specialist prompt
    let agentSystemPrompt = "";
    if (routedAgent === "scheme") {
      agentSystemPrompt = `You are the Scheme Specialist Agent for Smart Bharat.\nAnswer citizen eligibility and scheme-related questions clearly using ONLY the following scheme database:\n${JSON.stringify(GOVERNMENT_SCHEMES, null, 2)}\n\nIf the user asks about a scheme NOT in the database, say you don't have details but can help with PM-KISAN, Ayushman Bharat, etc.\nAlways respond warmly in the SAME language as the citizen's message (${detectedLanguage}).`;
    } else if (routedAgent === "document") {
      agentSystemPrompt = `You are the Document Specialist Agent for Smart Bharat.\nProvide document checklists and application steps using:\n${JSON.stringify(DOCUMENT_CHECKLISTS, null, 2)}\n\nAlways respond warmly in the SAME language as the citizen's message (${detectedLanguage}).`;
    } else if (routedAgent === "complaint") {
      agentSystemPrompt = `You are the Complaint Specialist Agent for Smart Bharat.\nGuide the citizen to click "Report an Issue" or the "File Complaint" tab, upload a photo, and share location.\nAlways respond warmly in the SAME language (${detectedLanguage}).`;
    } else if (routedAgent === "tracker") {
      const safeComplaints = complaints.map((c) => ({
        id: c.id, category: c.category, severity: c.severity,
        status: c.status, upvoteCount: c.upvoteCount,
        description: c.description, createdAt: c.createdAt,
      }));
      agentSystemPrompt = `You are the Tracker Specialist Agent for Smart Bharat.\nSearch complaints database:\n${JSON.stringify(safeComplaints, null, 2)}\n\nLook up complaint IDs and provide status. Always respond warmly in the SAME language (${detectedLanguage}).`;
    } else {
      agentSystemPrompt = `You are the Civic Companion Agent for Smart Bharat.\nHelp citizens understand Smart Bharat features. Always respond warmly in the SAME language (${detectedLanguage}).`;
    }

    let botReplyText = "";
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = getGeminiClient();
        const formattedHistory = history
          .slice(-6)
          .map((m: any) => `${m.sender === "user" ? "Citizen" : "Agent"}: ${sanitizeText(m.text, 5000)}`)
          .join("\n");
        const fullPrompt = `${formattedHistory}\n\nCitizen: ${sanitizedMessage}`;

        const chatPromise = ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: { systemInstruction: agentSystemPrompt, temperature: 0.7 },
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Gemini API timeout (8s)")), 8000)
        );

        const chatResponse = await Promise.race([chatPromise, timeoutPromise]) as any;
        botReplyText = chatResponse.text || "I am here to help you. Could you please rephrase?";
      } catch (err) {
        console.error("Specialist agent call failed or timed out:", err);
        botReplyText = getMockResponse(routedAgent, sanitizedMessage, detectedLanguage, complaints);
      }
    } else {
      botReplyText = getMockResponse(routedAgent, sanitizedMessage, detectedLanguage, complaints);
    }

    return res.status(200).json({
      text: botReplyText,
      routedAgent,
      language: detectedLanguage,
    });
  } catch (err: any) {
    console.error("Critical Chat Route Error:", err);
    // Even on critical error, return a simulated response instead of crashing 500
    return res.status(200).json({
      text: "I am experiencing network difficulties right now. Please try again in a few moments.",
      routedAgent: "general",
      language: "en"
    });
  }
}

function heuristicRoute(message: string): any {
  const msgLower = sanitizeText(message).toLowerCase();
  if (msgLower.includes("scheme") || msgLower.includes("kisan") || msgLower.includes("yojana") || msgLower.includes("eligib") || msgLower.includes("benefit") || msgLower.includes("pm-")) return "scheme";
  if (msgLower.includes("document") || msgLower.includes("apply") || msgLower.includes("passport") || msgLower.includes("license") || msgLower.includes("pan") || msgLower.includes("voter") || msgLower.includes("ration") || msgLower.includes("checklist")) return "document";
  if (msgLower.includes("report") || msgLower.includes("file") || msgLower.includes("complaint") || msgLower.includes("pothole") || msgLower.includes("garbage") || msgLower.includes("streetlight") || msgLower.includes("leak")) return "complaint";
  if (msgLower.includes("track") || msgLower.includes("status") || msgLower.includes("comp-") || msgLower.includes("check my")) return "tracker";
  return "general";
}

function getMockResponse(routedAgent: string, message: string, detectedLanguage: string, complaints: any[]): string {
  const msgLower = message.toLowerCase();
  let botReplyText = "";

  if (routedAgent === "scheme") {
    const match = GOVERNMENT_SCHEMES.find(s => msgLower.includes(s.id) || msgLower.includes(s.name.toLowerCase().split(" ")[0]));
    if (match) {
      botReplyText = `**${match.name}** is a wonderful scheme!\n${match.eligibility.map(e => `* ${e}`).join("\n")}\n\n**Benefits:** ${match.benefits}`;
    } else {
      botReplyText = `Here are some popular schemes:\n1. **PM-KISAN**: ₹6,000/year for farmers.\n2. **Ayushman Bharat**: Free health insurance of ₹5 Lakh.\n3. **Sukanya Samriddhi**: High-interest savings for girl children.\nWhich one would you like to know about?`;
    }
  } else if (routedAgent === "document") {
    const match = DOCUMENT_CHECKLISTS.find(d => msgLower.includes(d.id) || msgLower.includes(d.serviceName.toLowerCase().split(" ")[0]));
    if (match) {
      botReplyText = `For **${match.serviceName}**:\n${match.documents.map(d => `* ${d}`).join("\n")}\n\n**Steps:**\n${match.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    } else {
      botReplyText = `I can help with Passport, Ration Card, Driving License, PAN Card, and Voter ID checklists. What service are you applying for?`;
    }
  } else if (routedAgent === "complaint") {
    botReplyText = `You can easily file a complaint! Click on **"Report an Issue"** or switch to the **"File Complaint"** tab. Upload a photo and share your location. Our AI will auto-classify and file it instantly!`;
  } else if (routedAgent === "tracker") {
    const matchId = msgLower.match(/comp-\d+/);
    if (matchId) {
      const mc = complaints.find(c => c.id === matchId[0]);
      if (mc) {
        botReplyText = `Complaint **${mc.id}** (${mc.category}):\n* **Status:** ${mc.status.toUpperCase()}\n* **Severity:** ${mc.severity.toUpperCase()}\n* **Description:** ${mc.description}\n* **Upvotes:** ${mc.upvoteCount}`;
      } else {
        botReplyText = `Complaint **${matchId[0]}** not found. Please verify the ID.`;
      }
    } else {
      botReplyText = `Share your **Complaint ID** (e.g., 'comp-101') and I'll look up its status!`;
    }
  } else {
    botReplyText = `Hello! Welcome to Smart Bharat. I can help you:\n1. **Find Schemes** — PM-KISAN, Ayushman Bharat, etc.\n2. **Check Documents** — Passport, DL, Voter ID checklists.\n3. **File Complaints** — Report potholes, garbage with a photo.\n4. **Track Status** — Look up complaint progress.\n\nHow can I assist you? (Type in English, Hindi, or Hinglish!)`;
  }

  if (detectedLanguage !== "en") {
    botReplyText = `[Simulated ${detectedLanguage.toUpperCase()} translation]\n\n${botReplyText}`;
  }

  return botReplyText;
}
