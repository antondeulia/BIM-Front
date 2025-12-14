import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assistant = await serverRequest<any>(`/assistant/${params.id}`, {
      method: 'GET',
      token,
      cache: 'no-store',
      next: { revalidate: 60, tags: ['assistants', `assistant-${params.id}`] },
    });

    return NextResponse.json(assistant);
  } catch (error) {
    console.error('Get assistant error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to fetch assistant',
      },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const assistant = await serverRequest<any>(`/assistant/${params.id}`, {
      method: 'PUT',
      body,
      token,
      cache: 'no-store',
    });

    return NextResponse.json(assistant);
  } catch (error) {
    console.error('Update assistant error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to update assistant',
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await serverRequest(`/assistant/${params.id}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete assistant error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to delete assistant',
      },
      { status: 400 }
    );
  }
}

