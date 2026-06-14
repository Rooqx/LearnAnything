import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text');
  const voiceId = searchParams.get('voiceId');

  if (!text || !voiceId) {
    return new NextResponse('Missing text or voiceId', { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return new NextResponse('ElevenLabs API Key not configured', { status: 500 });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', // Fast, low-latency model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new NextResponse(`ElevenLabs Error: ${errText}`, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    // Return the audio stream with aggressive caching headers
    // so repeated plays of the same chunk don't cost credits
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
