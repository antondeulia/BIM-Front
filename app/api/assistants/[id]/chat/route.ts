import { NextRequest, NextResponse } from "next/server";
import { serverRequest, extractAuthToken } from "@/lib/server/api";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const message = await serverRequest<any>(
      `/assistant/${params.id}/chat`,
      {
        method: "POST",
        body,
        token,
        cache: "no-store",
      }
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send chat message error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to send message",
      },
      { status: 400 }
    );
  }
}

