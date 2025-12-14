import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

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

    await serverRequest(`/assistant/${params.id}/datasets`, {
      method: 'PUT',
      body: { dataset_ids: body.datasetIds || [] },
      token,
      cache: 'no-store',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update assistant datasets error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to update assistant datasets',
      },
      { status: 400 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await serverRequest<
      { current?: number[] } | number[]
    >(`/assistant/get-datasets/${params.id}`, {
      method: 'GET',
      token,
      cache: 'no-store',
      next: { revalidate: 60, tags: ['assistants', `assistant-${params.id}`] },
    });

    const data = Array.isArray(response) ? response : response.current || [];
    const datasetIds = data
      .map((id) => (typeof id === 'string' ? parseInt(id, 10) : id))
      .filter((id) => !isNaN(id));

    return NextResponse.json(datasetIds);
  } catch (error) {
    console.error('Get assistant datasets error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to fetch assistant datasets',
      },
      { status: 500 }
    );
  }
}

