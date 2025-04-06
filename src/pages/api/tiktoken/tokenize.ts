import { get_encoding, encoding_for_model } from "tiktoken";
import { NextApiRequest, NextApiResponse } from "next";
import JSONmodelToEncoding from 'tiktoken/model_to_encoding.json'
import JSONregistry from 'tiktoken/registry.json'
import { rateLimiter } from "@/lib/ratelimit";
import { getUserPagesDir } from "@/lib/user";
import { unstable_cache } from "next/cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = getUserPagesDir(req)
  const rl = rateLimiter(user.ip, `60 per 1 minutes`)
  if (!rl.allowed) {
    return res.status(429).json({
      error: rl.message,
      remaining: rl.remaining,
      reset: rl.reset,
    })
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


  if (
    'encoding' in body
    && typeof body.encoding === 'string'
  ) {
    if (isTiktokenEncoding(body.encoding)) {
      const tokens = await cached_encodeFromEncodings(body.encoding, body.content)
      return res.status(200).json({
        length: tokens.length,
        remaining: rl.remaining,
        tokens
      });
    } else {
      return res.status(400).json({ error: "Invalid encoding" });
    }
  }

  if (
    'model' in body
    && typeof body.model === 'string'
  ) {
    if (isTiktokenModel(body.model)) {
      const tokens = await cached_encodeFromModels(body.model, body.content)
      return res.status(200).json({
        length: tokens.length,
        remaining: rl.remaining,
        tokens
      });

    } else {
      return res.status(400).json({ error: "Invalid model" });
    }
  }

  const encoder = get_encoding("cl100k_base");
  const tokens = encoder.encode(body.content);
  encoder.free();
  return res.status(200).json({
    length: tokens.length,
    tokens
  });
}





export const tiktokenEncodings = Object.keys(JSONregistry)
export type TiktokenEncodings = Array<keyof typeof JSONregistry>[number]
function isTiktokenEncoding(encoding: string): encoding is TiktokenEncodings {
  return tiktokenEncodings.includes(encoding);
}
function encodeFromEncodings(encoding: TiktokenEncodings, content: string) {
  const encoder = get_encoding(encoding);
  const tokens = encoder.encode(content);
  encoder.free();
  return tokens;
}
export const cached_encodeFromEncodings = unstable_cache(async (...args: Parameters<typeof encodeFromEncodings>) => encodeFromEncodings(...args), undefined)



export const tiktokenModels = Object.keys(JSONmodelToEncoding)
type TiktokenModels = Array<keyof typeof JSONmodelToEncoding>[number]
function isTiktokenModel(model: string): model is TiktokenModels {
  return tiktokenModels.includes(model);
}
function encodeFromModels(model: TiktokenModels, content: string) {
  const encoder = encoding_for_model(model);
  const tokens = encoder.encode(content);
  encoder.free();
  return tokens;
}
const cached_encodeFromModels = unstable_cache(async (...args: Parameters<typeof encodeFromModels>) => encodeFromModels(...args), undefined)
