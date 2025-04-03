import parse from "parse-duration";
import { splitFirst } from "./text";
import { getUser, type User } from "./user";

const rateLimitStore: Record<string, number[]> = {}; // Global variable to track request counts

export function rateLimiter(key: string, limit: `${ number } per ${ string }`) {

  const now = Date.now();

  const [limitCountString, limitTimeString] = splitFirst(limit, " per ");
  const limitCount = parseInt(limitCountString, 10);
  const limitTime = parse(limitTimeString)
  if (!limitTime)
    throw new Error("Invalid limit time");

  // Initialize or clean up expired timestamps
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = [];
  }

  // Remove timestamps older than windowMs
  let earliestReleaseNumber = Number.MAX_SAFE_INTEGER;
  rateLimitStore[key] = rateLimitStore[key]
    .filter(timestamp => now - timestamp < limitTime)
    .map(ts => {
      const timeDiff = now - ts;
      if (timeDiff < earliestReleaseNumber) {
        earliestReleaseNumber = limitTime - timeDiff;
      }
      return ts
    })

  const remaining = limitCount - rateLimitStore[key].length - 1;


  if (remaining < 0) {
    return {
      allowed: false,
      message: `Rate limit exceeded | Reset in ${ Math.ceil(earliestReleaseNumber / 1000) } seconds`,
      remaining,
      reset: earliestReleaseNumber,
    };
    // ❌ Block: Over the window limit
  }

  rateLimitStore[key].push(now);
  return {
    allowed: true,
    message: "Rate limit allowed",
    remaining,
    reset: 0,
  }; // Rate allowed
}

type RateLimit = {
  allowed: boolean;
  message: string;
  remaining: number;
  reset: number;
}

export async function withLimit(req: Request, limit: `${ number } per ${ string }`, cb: (user: User, limit: RateLimit) => Promise<Response> | Response,) {
  const user = await getUser();
  const result = rateLimiter(user.ip, limit);
  if (result.allowed) {
    return await cb(user, result);
  }
  return Response.json(
    {
      error: result.message,
      remaining: result.remaining,
      reset: result.reset,
    },
    {
      status: 429,
      statusText: "Rate Limit Exceeded | Try again in " + Math.ceil(result.reset / 1000) + " seconds",
    }
  )
}