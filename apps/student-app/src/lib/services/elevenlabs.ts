/**
 * ElevenLabs TTS client service
 *
 * Calls /api/tts which uses ElevenLabs /with-timestamps.
 * Character-level alignment is mapped to viseme events client-side.
 */

import { alignmentToVisemes } from './visemeMapper';
import type { VisemeEvent } from './visemeMapper';

export async function generateSpeechWithAlignment(
	text: string,
	voiceId?: string
): Promise<{ audio: ArrayBuffer; visemes: VisemeEvent[] }> {
	const response = await fetch('/api/tts', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text, voiceId })
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({ error: response.statusText }));
		throw new Error(`TTS request failed: ${err.error ?? response.status}`);
	}

	const data = await response.json();

	const audioBytes = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));

	return {
		audio: audioBytes.buffer,
		visemes: alignmentToVisemes(data.alignment)
	};
}
