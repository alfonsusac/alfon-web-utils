import { tiktokenEncodings } from "@/pages/api/tiktoken/tokenize";

export function GET() {
  return Response.json(tiktokenEncodings)
}

export const dynamic = 'force-static'
