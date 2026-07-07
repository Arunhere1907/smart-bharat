import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";
import { GOVERNMENT_SCHEMES, DOCUMENT_CHECKLISTS } from "../src/data";
import { Complaint } from "../src/types";
import {
  getComplaints,
  addComplaint,
  getHaversineDistance,
} from "./_shared/store";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY not set. AI features will use mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: { headers: { "User-Agent": "smartbharat-vercel" } },
    });
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.status(200).json(getComplaints());
  }

  if (req.method === "POST") {
    try {
      const { photo, latitude, longitude, manualCategory, manualDescription, manualSeverity } = req.body;

      if (!photo) {
        return res.status(400).json({ error: "Photo is required to file a complaint" });
      }

      const lat = latitude ? parseFloat(latitude) : 28.6139;
      const lng = longitude ? parseFloat(longitude) : 77.2090;

      let category = manualCategory || "other";
      let severity = manualSeverity || "medium";
      let description = manualDescription || "Reported civic issue.";

      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && photo.startsWith("data:")) {
        try {
          const ai = getGeminiClient();
          const mimeTypeMatch = photo.match(/^data:([^;]+);base64,/);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
          const base64Data = photo.replace(/^data:[^;]+;base64,/, "");

          const prompt = `Analyze this civic complaint photo taken in India. 
Categorize the issue into one of: 'pothole', 'garbage', 'streetlight', 'water_leak', or 'other'.
Estimate the severity as: 'low', 'medium', or 'high'.
Provide a clear, brief 2-sentence description of the issue in English.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              { inlineData: { data: base64Data, mimeType } },
              { text: prompt },
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "One of: 'pothole' | 'garbage' | 'streetlight' | 'water_leak' | 'other'" },
                  severity: { type: Type.STRING, description: "One of: 'low' | 'medium' | 'high'" },
                  description: { type: Type.STRING, description: "Brief 2-sentence explanation." },
                },
                required: ["category", "severity", "description"],
              },
            },
          });

          const parsed = JSON.parse(response.text?.trim() || "{}");
          if (parsed.category) category = parsed.category.toLowerCase();
          if (parsed.severity) severity = parsed.severity.toLowerCase();
          if (parsed.description) description = parsed.description;
        } catch (err) {
          console.error("Gemini Vision classification failed:", err);
        }
      } else if (!manualCategory) {
        category = "pothole";
        description = "Pothole detected on the road, creating traffic inconvenience.";
      }

      // Proximity Dedup Check
      const complaints = getComplaints();
      const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

      const existingDuplicate = complaints.find((c) => {
        if (c.category !== category) return false;
        if (c.status === "resolved") return false;
        const createdTime = new Date(c.createdAt).getTime();
        if (createdTime < fourteenDaysAgo) return false;
        return getHaversineDistance(lat, lng, c.latitude, c.longitude) <= 200;
      });

      if (existingDuplicate) {
        existingDuplicate.upvoteCount = (existingDuplicate.upvoteCount || 0) + 1;
        return res.status(200).json({
          isDuplicate: true,
          complaint: existingDuplicate,
          message: `This issue has already been reported nearby. We've registered your report as an upvote (total: ${existingDuplicate.upvoteCount}).`,
        });
      }

      const newComplaint: Complaint = {
        id: "comp-" + Math.floor(1000 + Math.random() * 9000),
        category: category as any,
        severity: severity as any,
        description,
        photoUrl: photo,
        latitude: lat,
        longitude: lng,
        status: "open",
        upvoteCount: 1,
        createdAt: new Date().toISOString(),
      };

      addComplaint(newComplaint);

      return res.status(200).json({
        isDuplicate: false,
        complaint: newComplaint,
        message: `Thank you! Your complaint has been filed with ID: ${newComplaint.id}.`,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to submit complaint" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
