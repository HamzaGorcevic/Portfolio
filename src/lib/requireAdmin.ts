import { NextResponse } from "next/server";
import { getSession } from "@/app/admin/actions";

// Returns a 401 response when the request has no valid admin session, null otherwise.
export async function requireAdmin() {
  if (await getSession()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
