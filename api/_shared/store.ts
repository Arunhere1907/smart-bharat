import { SEED_COMPLAINTS } from "../../src/data";
import { Complaint } from "../../src/types";

// In-memory complaint store. On Vercel serverless, this persists
// within a single function instance but resets on cold starts.
// For production, migrate to Vercel KV/Redis or a database.
let complaints: Complaint[] = [...SEED_COMPLAINTS];

export function getComplaints(): Complaint[] {
  return complaints;
}

export function setComplaints(data: Complaint[]): void {
  complaints = data;
}

export function findComplaintById(id: string): Complaint | undefined {
  return complaints.find((c) => c.id === id);
}

export function addComplaint(complaint: Complaint): void {
  complaints.unshift(complaint);
}

// Haversine distance formula (meters)
export function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
