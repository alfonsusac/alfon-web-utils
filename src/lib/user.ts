import { headers } from "next/headers";

export async function getUser() {
  const store = await headers()
  return {
    ip: store.get("x-forwarded-for") || store.get("x-real-ip") || store.get("cf-connecting-ip") || store.get("x-client-ip") || store.get("x-cluster-client-ip") || store.get("x-appengine-user-ip") || "unknown",
    country: store.get("cf-ipcountry"),
    ua: store.get("user-agent"),
    referer: store.get("referer"),
  }
}

export type User = Awaited<ReturnType<typeof getUser>>