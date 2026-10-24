import "server-only";
import crypto from "node:crypto";

/**
 * Hash a password using Node's built-in scrypt with a cryptographically random salt.
 * Produces format: `<salt>:<hash>`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plaintext password against a stored `<salt>:<hash>`.
 * Uses crypto.timingSafeEqual to prevent timing attacks.
 */
export function verifyPassword(password: string, combined: string): boolean {
  if (!combined || typeof combined !== "string" || !combined.includes(":")) {
    return false;
  }
  const [salt, key] = combined.split(":");
  if (!salt || !key) return false;

  try {
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const hashBuf = Buffer.from(hash, "hex");
    const keyBuf = Buffer.from(key, "hex");
    if (hashBuf.length !== keyBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, keyBuf);
  } catch {
    return false;
  }
}
