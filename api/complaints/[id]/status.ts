import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getComplaints } from "../../_shared/store";
import { validateComplaintId, validateStatus } from "../../_shared/validation";
import { rateLimit, RateLimits } from "../../_shared/ratelimit";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 10 status updates per minute
  const rateLimitResult = rateLimit(req, RateLimits.STATUS_UPDATE);
  if (rateLimitResult) {
    return res.status(rateLimitResult.statusCode).json(rateLimitResult.body);
  }

  const { id } = req.query;
  const { status } = req.body;

  // Validate complaint ID format
  if (typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid complaint ID" });
  }

  const idValidation = validateComplaintId(id);
  if (!idValidation.valid) {
    return res.status(400).json({ error: idValidation.error });
  }

  // Validate status
  const statusValidation = validateStatus(status);
  if (!statusValidation.valid) {
    return res.status(400).json({ error: statusValidation.error });
  }

  const complaints = getComplaints();
  const complaint = complaints.find((c) => c.id === id);

  if (complaint) {
    complaint.status = status;
    return res.status(200).json({ success: true, status: complaint.status });
  }

  return res.status(404).json({ error: "Complaint not found" });
}
