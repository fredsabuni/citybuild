import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '20';
    const status = searchParams.get('status');

    const params = new URLSearchParams({
      page,
      per_page: perPage,
    });

    if (status) {
      params.append('status', status);
    }

    // Forward to backend API
    const res = await fetch(`${BACKEND_URL}/v1/projects/?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization if exists
        ...(request.headers.get('authorization') && {
          Authorization: request.headers.get('authorization')!,
        }),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch projects' }));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to connect to backend', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const res = await fetch(`${BACKEND_URL}/v1/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization if exists
        ...(request.headers.get('authorization') && {
          Authorization: request.headers.get('authorization')!,
        }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to create project' }));
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to connect to backend', details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
