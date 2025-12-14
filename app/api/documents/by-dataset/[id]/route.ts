import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await serverRequest<any[]>(
      `/document/by-dataset/${params.id}`,
      {
        method: 'GET',
        token,
        cache: 'no-store',
        next: {
          revalidate: 30,
          tags: ['documents', `dataset-${params.id}`],
        },
      }
    );

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to fetch documents',
      },
      { status: 500 }
    );
  }
}

