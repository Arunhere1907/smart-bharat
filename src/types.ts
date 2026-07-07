/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  audioUrl?: string; // Optional TTS audio url or base64
  routedAgent?: "router" | "scheme" | "document" | "complaint" | "tracker" | "general";
  timestamp: string;
}

export type ComplaintCategory = "pothole" | "garbage" | "streetlight" | "water_leak" | "other";

export type ComplaintSeverity = "low" | "medium" | "high";

export type ComplaintStatus = "open" | "in_progress" | "resolved";

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  description: string;
  photoUrl: string; // Base64 image data or static fallback URL
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  upvoteCount: number;
  createdAt: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string[];
  benefits: string;
}

export interface DocumentChecklist {
  id: string;
  serviceName: string;
  description: string;
  documents: string[];
  steps: string[];
}
