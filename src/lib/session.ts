import { headers } from "next/headers";
import crypto from "crypto";

export async function getSessionId() {
  const h =  await headers();
  const sid = h.get("x-session-id");
  return sid ?? crypto.randomUUID();
}