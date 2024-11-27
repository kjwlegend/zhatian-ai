import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, image } = body;

    const response = await fetch(`${process.env.OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model:  'gpt-4o' ,
        messages,
        stream: true,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ error: `OpenAI API error: ${response.status}` }), 
        { status: response.status }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', 'text/event-stream');
    headers.set('Cache-Control', 'no-cache');
    headers.set('Connection', 'keep-alive');

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const reader = response.body?.getReader();
    if (reader) {
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              await writer.close();
              break;
            }
            const text = new TextDecoder().decode(value);
            await writer.write(encoder.encode(text));
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          await writer.abort(error);
        }
      })();
    }

    return new NextResponse(stream.readable, { headers });
  } catch (error) {
    console.error('API route error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}