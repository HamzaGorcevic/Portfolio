"use server";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";

// The cookie holds an HMAC keyed by ADMIN_PASS, so it can't be forged without the
// password, and changing the password logs every session out.
function sessionToken(): string | null {
  const secret = process.env.ADMIN_PASS;
  if (!secret) return null;
  return createHmac("sha256", secret).update("portfolio-admin-session-v1").digest("hex");
}

function sameString(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const token = sessionToken();
  if (token && process.env.ADMIN_PASS && sameString(password, process.env.ADMIN_PASS)) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Incorrect password" };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return !!session && sameString(session, token);
}
