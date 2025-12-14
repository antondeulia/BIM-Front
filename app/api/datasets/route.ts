import { NextRequest, NextResponse } from "next/server";
import { serverRequest, extractAuthToken } from "@/lib/server/api";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const datasets = await serverRequest<any[]>("/datasets/", {
      method: "GET",
      token,
      cache: "no-store",
      next: { revalidate: 30, tags: ["datasets"] },
    });

    return NextResponse.json(datasets);
  } catch (error) {
    console.error("Get datasets error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch datasets",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const dataset = await serverRequest<any>("/datasets/", {
      method: "POST",
      body,
      token,
      cache: "no-store",
    });

    return NextResponse.json(dataset, { status: 201 });
  } catch (error) {
    console.error("Create dataset error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create dataset",
      },
      { status: 400 }
    );
  }
}
