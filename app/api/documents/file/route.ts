import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';
import { revalidateTag, revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = extractAuthToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const datasetId = formData.get('dataset_id');
    const file = formData.get('file');

    if (!datasetId || !file) {
      return NextResponse.json(
        { error: 'dataset_id and file are required' },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append('dataset_id', datasetId.toString());
    backendFormData.append('file', file);

    const document = await serverRequest<any>('/document/file', {
      method: 'POST',
      body: backendFormData,
      token,
      cache: 'no-store',
    });

    revalidateTag('documents');
    revalidateTag(`dataset-${datasetId}`);
    revalidatePath(`/datasets/${datasetId}`);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Create file document error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Failed to create file document',
      },
      { status: 400 }
    );
  }
}

