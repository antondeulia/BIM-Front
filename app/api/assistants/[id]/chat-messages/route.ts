import { NextRequest, NextResponse } from "next/server";
import { serverRequest, extractAuthToken } from "@/lib/server/api";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await serverRequest<any[]>(
      `/assistant/${params.id}/chat-messages`,
      {
        method: "GET",
        token,
        cache: "no-store",
      }
    );

    return NextResponse.json(messages || []);
  } catch (error) {
    console.error("Get chat messages error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch chat messages",
      },
      { status: 500 }
    );
  }
}

