import { NextRequest, NextResponse } from "next/server";
import { serverRequest, setAuthCookies } from "@/lib/server/api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const response = await serverRequest<any>("/auth/sign-up", {
      method: "POST",
      body: { email, password },
    });

    const accessToken = typeof response.access_token === 'string' 
      ? response.access_token 
      : response.access_token?.token || response.access_token;
    
    const refreshToken = response.refresh_token 
      ? (typeof response.refresh_token === 'string' 
          ? response.refresh_token 
          : response.refresh_token?.token || response.refresh_token)
      : undefined;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token received from server" },
        { status: 500 }
      );
    }

    const nextResponse = NextResponse.json({
      access_token: accessToken,
      user: null,
    });

    setAuthCookies(nextResponse, accessToken, refreshToken);

    return nextResponse;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 }
    );
  }
}
