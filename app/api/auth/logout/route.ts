import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}

