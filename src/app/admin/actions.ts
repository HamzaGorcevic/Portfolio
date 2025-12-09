"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_SECRET = "authenticated"; 

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  if (password === process.env.ADMIN_PASS) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, SESSION_SECRET, {
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
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === SESSION_SECRET;
}
