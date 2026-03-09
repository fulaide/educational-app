import { ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

interface TTSRequest {
	text: string;
	voiceId?: string;
}

/**
 * POST /api/tts
 *
 * Calls ElevenLabs /with-timestamps — returns MP3 audio + character-level
 * alignment data in a single request. The alignment is processed on the
 * client into viseme events via visemeMapper.ts.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: TTSRequest = await request.json();
		const { text, voiceId } = body;

		if (!text || typeof text !== 'string' || text.trim().length === 0) {
			return json({ error: 'Missing or empty text' }, { status: 400 });
		}
		if (text.length > 500) {
			return json({ error: 'Text too long (max 500 characters)' }, { status: 400 });
		}

		const resolvedVoiceId = voiceId ?? ELEVENLABS_VOICE_ID;

		const response = await fetch(
			`${ELEVENLABS_API_URL}/text-to-speech/${resolvedVoiceId}/with-timestamps`,
			{
				method: 'POST',
				headers: {
					'xi-api-key': ELEVENLABS_API_KEY,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: text.trim(),
					model_id: 'eleven_multilingual_v2',
					output_format: 'mp3_44100_128'
				})
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('[TTS] ElevenLabs error:', response.status, errorText);
			return json({ error: `TTS generation failed: ${response.status}` }, { status: 502 });
		}

		const data = await response.json();

		return json({
			audio_base64: data.audio_base64,
			alignment: data.alignment // { characters[], character_start_times_seconds[], character_end_times_seconds[] }
		});
	} catch (err) {
		console.error('[TTS] Unexpected error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
