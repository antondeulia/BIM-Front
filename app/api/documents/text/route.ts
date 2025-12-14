import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const document = await serverRequest<any>('/document/text', {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Create text document error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to create document',
      },
      { status: 400 }
    );
  }
}

