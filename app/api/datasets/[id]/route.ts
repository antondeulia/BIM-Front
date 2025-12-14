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

    const dataset = await serverRequest<any>(`/datasets/${params.id}`, {
      method: 'GET',
      token,
      cache: 'no-store',
      next: { revalidate: 60, tags: ['datasets', `dataset-${params.id}`] },
    });

    return NextResponse.json(dataset);
  } catch (error) {
    console.error('Get dataset error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to fetch dataset',
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

    const dataset = await serverRequest<any>(`/datasets/${params.id}`, {
      method: 'PUT',
      body,
      token,
      cache: 'no-store',
    });

    return NextResponse.json(dataset);
  } catch (error) {
    console.error('Update dataset error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to update dataset',
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

    await serverRequest(`/datasets/${params.id}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete dataset error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to delete dataset',
      },
      { status: 400 }
    );
  }
}

