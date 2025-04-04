import type { NextRequest } from "next/server";
import { withLimit } from "@/lib/ratelimit";
import { getStringContextLength } from "./lib";
import { error } from "console";

export const config = { runtime: "edge" };


export async function GET(request: NextRequest) {
  try {
    return await withLimit(request, "1 per 3 seconds", async (user, limit) => {
      try {
        const length = await getStringContextLength()
        return Response.json({
          data: { length },
          limit
        })
      } catch (error) {
        console.log(error)
        return Response.json({
          error: `Failed getting context string legnth (${ error instanceof Error ? error.message : JSON.stringify(error) })`
        })
      }

    })
  } catch {
    return Response.json({
      error: "Failed procesing GET request",
      status: 500
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await withLimit(request, "1 per 3 seconds", async (user, limit) => {

      const body = await request.json() as unknown;

      if (
        !body
        || typeof body !== "object"
        || (("model" in body) && typeof body.model !== "string")
        || !("content" in body)
        || typeof body.content !== "string"
      )
        return new Response("Invalid request", { status: 400 });

      const {
        model = "gpt-3.5-turbo",
        content,
      } = body as { model?: string, content: string };

      // CACHE THIS
      const length = await getStringContextLength(
        // content
      )

      const charLength = content.length

      return Response.json({
        data: {
          length,
          charLength,
          model,
        },
        limit
      })
    })
  } catch (error) {
    console.log(error)
    return new Response("Internal Server Error", { status: 500 })
  }
}