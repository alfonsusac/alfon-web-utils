import { rateLimiter } from "@/lib/ratelimit";
import { getUserPagesDir } from "@/lib/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { cached_encodeFromEncodings, tiktokenEncodings, type TiktokenEncodings } from "./tokenize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const user = getUserPagesDir(req);
  const rl = rateLimiter(user.ip, `60 per 1 minutes`);
  if (!rl.allowed) {
    return res.status(429).json({
      error: rl.message,
      remaining: rl.remaining,
      reset: rl.reset,
    });
  }
  // Validate method
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  // Get body
  const body: unknown = req.method === "POST" ? req.body : req.query;
  // Validate body
  if (
    !body
    || typeof body !== "object"
    || 'content' in body === false
    || typeof body.content !== "string"
  ) return res.status(400).json({ error: "Invalid request body" });

  const content = body.content

  const entries: [string,
    | { token: Uint32Array<ArrayBufferLike> }
    | { error: string }
  ][] = []

  await Promise.allSettled(tiktokenEncodings.map(async en => {
    try {
      const token = await cached_encodeFromEncodings(en as TiktokenEncodings, content)
      entries.push([en, { token }])
    } catch (error) {
      entries.push([en, { error: String(error) }])
    }
  }))

  const data = Object.fromEntries(entries)

  return res.status(200).json({
    data,
    remaining: rl.remaining,
  })
}