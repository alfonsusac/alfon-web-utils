import { withLimit } from "@/lib/ratelimit"

export function GET(request: Request) {
  try {
    return withLimit(request, "1 per 5 seconds", async (user,limit) => {
      return Response.json({
        data: user,
        limit,
      })
    })
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 })
  }
}