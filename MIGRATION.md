# Server-First Next.js Migration

This document outlines the migration from client-side data fetching to a server-first Next.js architecture.

## Architecture Changes

### Before (Client-First)
- All pages were Client Components (`"use client"`)
- Direct API calls from client using `apiClient` or `assistantsService`
- Tokens stored in `localStorage`
- Data fetched in `useEffect` hooks
- React Query for client-side caching

### After (Server-First)
- **Server Components by default** - Pages fetch data on the server
- **Next.js as BFF** - All backend requests go through route handlers (`/app/api/*`)
- **Server Actions** - Mutations use Server Actions (`'use server'`)
- **HttpOnly Cookies** - Tokens stored securely in cookies (server-side only)
- **Explicit Caching** - Using Next.js cache tags and revalidation

## File Structure

### New Files

#### Server-Side
- `lib/server/api.ts` - Server-side API client (calls backend)
- `lib/server/data.ts` - Data fetching functions for Server Components
- `lib/server/actions.ts` - Server Actions for mutations

#### Route Handlers (BFF)
- `app/api/auth/*` - Authentication endpoints
- `app/api/assistants/*` - Chatbot/Assistant endpoints
- `app/api/datasets/*` - Dataset endpoints
- `app/api/documents/*` - Document endpoints

#### Client-Side
- `lib/client/api.ts` - Client utilities that call Next.js route handlers (not backend directly)

#### Pages (Server Components)
- `app/datasets/page.tsx` - Server Component with data fetching
- `app/datasets/[id]/page.tsx` - Server Component with data fetching
- `app/chat-bots/page.tsx` - Server Component with data fetching

#### Client Components (Interactive UI Only)
- `app/datasets/DatasetsClient.tsx` - Interactive UI for datasets list
- `app/datasets/[id]/DatasetPageClient.tsx` - Interactive UI for dataset detail
- `app/chat-bots/ChatBotsClient.tsx` - Interactive UI for chatbots list

## Key Patterns

### 1. Server Component Pattern

```tsx
// app/datasets/page.tsx (Server Component)
import { getDatasets } from '@/lib/server/data';
import { DatasetsClient } from './DatasetsClient';

export default async function DatasetsPage() {
  const datasets = await getDatasets(); // Server-side fetch
  return <DatasetsClient initialDatasets={datasets || []} />;
}
```

### 2. Client Component Pattern

```tsx
// app/datasets/DatasetsClient.tsx (Client Component)
'use client';

import { useState } from 'react';
import { createDataset } from '@/lib/server/actions'; // Server Action

export function DatasetsClient({ initialDatasets }) {
  const [datasets, setDatasets] = useState(initialDatasets);
  
  const handleCreate = async (data) => {
    const result = await createDataset(data); // Server Action
    if (result.success) {
      router.refresh(); // Re-fetch server data
    }
  };
  
  return (/* UI */);
}
```

### 3. Server Action Pattern

```tsx
// lib/server/actions.ts
'use server';

export async function createDataset(data) {
  const token = await getAuthToken(); // From cookies
  // Call backend API
  const result = await serverRequest('/datasets/', {
    method: 'POST',
    body: data,
    token,
  });
  
  revalidateTag('datasets'); // Cache invalidation
  revalidatePath('/datasets');
  
  return { success: true, data: result };
}
```

### 4. Route Handler Pattern (BFF)

```tsx
// app/api/datasets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverRequest, extractAuthToken } from '@/lib/server/api';

export async function GET(request: NextRequest) {
  const token = extractAuthToken(request); // From cookies
  const datasets = await serverRequest('/datasets/', {
    method: 'GET',
    token,
    next: { revalidate: 30, tags: ['datasets'] },
  });
  return NextResponse.json(datasets);
}
```

## Caching Strategy

### Explicit Cache Configuration

- **Route Handlers**: `revalidate: 30` (30 seconds)
- **Data Functions**: `next: { revalidate: 30, tags: ['datasets'] }`
- **Cache Tags**: Used for targeted invalidation
  - `assistants` - All assistants
  - `assistant-{id}` - Specific assistant
  - `datasets` - All datasets
  - `dataset-{id}` - Specific dataset
  - `documents` - All documents

### Cache Invalidation

Server Actions automatically invalidate cache:
```tsx
revalidateTag('datasets');
revalidatePath('/datasets');
```

## Authentication

### Before
- Tokens in `localStorage` (visible to client)
- Direct backend API calls with tokens in headers

### After
- Tokens in HttpOnly cookies (server-side only)
- Cookies automatically sent by browser
- Server extracts tokens from cookies

### Cookie Handling

```tsx
// Route handler sets cookies
setAuthCookies(response, accessToken, refreshToken);

// Server extracts from cookies
const token = extractAuthToken(request);

// Server Actions extract from cookies
const token = await getAuthToken(); // Uses cookies()
```

## Migration Checklist

- [x] Create server-side API utilities
- [x] Create route handlers (BFF layer)
- [x] Create Server Actions for mutations
- [x] Refactor pages to Server Components
- [x] Create client components for interactive UI
- [x] Implement server-side auth (cookies)
- [ ] Update remaining components to use new patterns
- [ ] Remove/deprecate old client-side API clients
- [ ] Update forms to use Server Actions
- [ ] Test all data flows

## Remaining Work

### Components to Update
1. **Forms** - Update to call Server Actions instead of services
2. **ChatBotsCacheContext** - Can be removed (using server-side caching)
3. **QueryProvider** - May not be needed (using Next.js caching)
4. **AuthModal** - Already updated to use `authApi` from `lib/client/api`

### Files to Deprecate
- `lib/api-client.ts` - Replace with route handlers
- `lib/services/*.ts` - Replace with Server Actions
- `contexts/ChatBotsCacheContext.tsx` - Server-side caching replaces this

## Benefits

1. **Security** - Tokens never exposed to client
2. **Performance** - Data fetched on server (faster initial load)
3. **SEO** - Server-rendered content
4. **Predictable Caching** - Explicit cache strategies
5. **Type Safety** - Server/client boundary clearly defined

## Environment Variables

Add to `.env.local`:
```
API_URL=http://localhost:8000
# or
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`API_URL` is preferred (server-only), but `NEXT_PUBLIC_API_URL` works for both.

