import { NextRequest, NextResponse } from "next/server";
import { serverRequest, extractAuthToken } from "@/lib/server/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await serverRequest<{
      id: string;
      email: string;
      name: string;
    }>("/auth/me", {
      method: "GET",
      token,
      cache: "no-store",
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get user" },
      { status: 401 }
    );
  }
}
