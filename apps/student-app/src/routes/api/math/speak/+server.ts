import { ELEVENLABS_API_KEY } from '$env/static/private';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { json } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import type { RequestHandler } from './$types';

export const prerender = false;

interface SpeakRequest {
  text: string;
  voice?: string;
}

const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

// ElevenLabs voices - using multilingual model for German support
// "Rachel" is reliable and works well with German text
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

const PREMADE_VOICES: Record<string, string> = {
  rachel: '21m00Tcm4TlvDq8ikWAM', // Clear, neutral - works well for German
  domi: 'AZnzlk1XvdvUeBnXmlld',   // Young female
  bella: 'EXAVITQu4vr4xnSDxMaL',  // Soft female
  elli: 'MF3mGyEYCl7XYWbV9V6O',   // Young female
  josh: 'TxGEqnHWrfWFTfGW9XjX',   // Young male
  adam: 'pNInz6obpgDQGcFmaJgB',   // Deep male
  sam: 'yoZ06aMxZJJ28mfd3POQ'     // Young male
};

// Voice settings for clear, natural speech (not whispering)
const VOICE_SETTINGS = {
  stability: 0.5,           // Balance between consistent and expressive
  similarity_boost: 0.75,   // Stay close to original voice
  style: 0.0,               // No style exaggeration
  use_speaker_boost: true   // Enhance clarity
};

const audioCache = new Map<string, { audio: ArrayBuffer; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Convert math symbols to spoken German words for TTS
 */
function convertMathToSpokenGerman(text: string): string {
  return text
    // Math operators - use word boundaries to avoid partial replacements
    .replace(/\s*\+\s*/g, ' plus ')
    .replace(/\s*-\s*/g, ' minus ')
    .replace(/\s*×\s*/g, ' mal ')
    .replace(/\s*÷\s*/g, ' geteilt durch ')
    .replace(/\s*=\s*/g, ' gleich ')
    // Unknown/blank placeholder - add pause
    .replace(/__+/g, '... Lücke ...')
    .replace(/_/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body: SpeakRequest = await request.json();
    const rawText = body?.text;
    const voice = body?.voice;

    if (!rawText || typeof rawText !== 'string') {
      return json({ error: 'Text is required' }, { status: 400 });
    }

    // Convert math symbols to spoken words
    const text = convertMathToSpokenGerman(rawText);
    console.log('[Speak] Converted text:', { original: rawText, spoken: text });
    if (text.length > 500) {
      return json({ error: 'Text too long (max 500 characters)' }, { status: 400 });
    }
    if (!ELEVENLABS_API_KEY) {
      return json({ error: 'Text-to-speech service not configured' }, { status: 503 });
    }

    const voiceId = voice && PREMADE_VOICES[voice] ? PREMADE_VOICES[voice] : DEFAULT_VOICE_ID;

    const cacheKey = hashText(`${voiceId}:${text}`);
    const cached = audioCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(cached.audio, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'X-Cache': 'HIT'
        }
      });
    }

    cleanCache();

    // Convert -> buffer (simplest, avoids stream/tee edge cases)
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
      voiceSettings: VOICE_SETTINGS
    });

    const audioBuffer = await streamToArrayBuffer(audioStream);

    audioCache.set(cacheKey, { audio: audioBuffer, timestamp: Date.now() });

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'X-Cache': 'MISS'
      }
    });
  } catch (err: any) {
    // Surface real SDK error details
    const statusCode = err?.statusCode ?? 500;
    const details =
      typeof err?.body === 'string'
        ? err.body
        : err?.body
          ? JSON.stringify(err.body)
          : err?.message ?? String(err);

    console.error('Error in /api/math/speak:', { statusCode, details, err });

    // IMPORTANT: return JSON/text, not SvelteKit HTML error page
    return json(
      { error: 'Failed to generate speech', statusCode, details },
      { status: statusCode }
    );
  }
};

function hashText(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

async function streamToArrayBuffer(stream: ReadableStream<Uint8Array>): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }

  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer;
}

function cleanCache() {
  const now = Date.now();
  for (const [key, value] of audioCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) audioCache.delete(key);
  }
  if (audioCache.size > 100) {
    const entries = Array.from(audioCache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (const [key] of entries.slice(0, entries.length - 100)) audioCache.delete(key);
  }
}