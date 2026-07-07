import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DOCUMENT_CHECKLISTS } from "../src/data";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json(DOCUMENT_CHECKLISTS);
}
