import crypto from "crypto";

export function makeHash(input: object) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
}
