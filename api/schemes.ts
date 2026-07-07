import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GOVERNMENT_SCHEMES } from "../src/data";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json(GOVERNMENT_SCHEMES);
}
