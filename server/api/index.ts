import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/index.js";

/**
 * Vercel Serverless Function Handler
 *
 * This wraps the Express app for Vercel's serverless environment.
 * Express apps work with @vercel/node because it provides Node.js
 * compatible req/res objects.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Express can handle VercelRequest/VercelResponse directly
  // because they extend Node's IncomingMessage/ServerResponse
  return app(req, res);
}
