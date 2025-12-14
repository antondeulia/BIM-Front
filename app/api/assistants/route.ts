import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assistants = await serverRequest<any[]>('/assistant', {
      method: 'GET',
      token,
      cache: 'no-store',
      next: { revalidate: 30, tags: ['assistants'] },
    });

    return NextResponse.json(assistants);
  } catch (error) {
    console.error('Get assistants error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to fetch assistants',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const assistant = await serverRequest<any>('/assistant', {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });

    return NextResponse.json(assistant, { status: 201 });
  } catch (error) {
    console.error('Create assistant error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to create assistant',
      },
      { status: 400 }
    );
  }
}

