import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getComplaints } from "../../_shared/store";
import { validateComplaintId } from "../../_shared/validation";
import { rateLimit, RateLimits } from "../../_shared/ratelimit";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 10 upvotes per minute
  const rateLimitResult = rateLimit(req, RateLimits.UPVOTE);
  if (rateLimitResult) {
    return res.status(rateLimitResult.statusCode).json(rateLimitResult.body);
  }

  const { id } = req.query;

  // Validate complaint ID format
  if (typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid complaint ID" });
  }

  const validation = validateComplaintId(id);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const complaints = getComplaints();
  const complaint = complaints.find((c) => c.id === id);

  if (complaint) {
    complaint.upvoteCount = (complaint.upvoteCount || 0) + 1;
    return res.status(200).json({ success: true, upvoteCount: complaint.upvoteCount });
  }

  return res.status(404).json({ error: "Complaint not found" });
}
