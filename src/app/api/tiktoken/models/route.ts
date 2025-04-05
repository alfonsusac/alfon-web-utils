import { tiktokenModels } from "@/pages/api/tiktoken/tokenize";

export function GET() {
  return Response.json(tiktokenModels);
}

export const dynamic = 'force-static'