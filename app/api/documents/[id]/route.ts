import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await serverRequest(`/document/${params.id}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to delete document',
      },
      { status: 400 }
    );
  }
}

