import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    // Set CORS headers
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type');
    responseHeaders.set('Content-Type', contentType || 'image/png');
    responseHeaders.set('Cache-Control', 'public, max-age=31536000');

    return new NextResponse(buffer, {
      headers: responseHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
