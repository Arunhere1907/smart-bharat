import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getComplaints } from "../../_shared/store";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const complaints = getComplaints();
  const complaint = complaints.find((c) => c.id === id);

  if (complaint) {
    complaint.upvoteCount = (complaint.upvoteCount || 0) + 1;
    return res.status(200).json({ success: true, upvoteCount: complaint.upvoteCount });
  }

  return res.status(404).json({ error: "Complaint not found" });
}
