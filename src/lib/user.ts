import type { NextApiRequest } from "next"
import { headers } from "next/headers"

export async function getUser() {
  const store = await headers()
  return {
    ip: store.get("x-forwarded-for")
      || store.get("x-real-ip")
      || store.get("cf-connecting-ip")
      || store.get("x-client-ip")
      || store.get("x-cluster-client-ip")
      || store.get("x-appengine-user-ip")
      || "unknown",
    country: store.get("cf-ipcountry"),
    ua: store.get("user-agent"),
    referer: store.get("referer"),
  }
}

export type User = Awaited<ReturnType<typeof getUser>>

export function getUserPagesDir(req: NextApiRequest) {
  return {
    ip: req.headersDistinct["x-forwarded-for"]?.[0]
      || req.headersDistinct["x-real-ip"]?.[0]
      || req.headersDistinct["cf-connecting-ip"]?.[0]
      || req.headersDistinct["x-client-ip"]?.[0]
      || req.headersDistinct["x-cluster-client-ip"]?.[0]
      || req.headersDistinct["x-appengine-user-ip"]?.[0]
      || "unknown"
    ,
    country: req.headersDistinct["cf-ipcountry"]?.[0],
    ua: req.headersDistinct["user-agent"]?.[0],
    referer: req.headersDistinct["referer"]?.[0],
  }
}