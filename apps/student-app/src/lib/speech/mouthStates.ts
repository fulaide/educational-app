/**
 * Mouth state names match the Rive input keys: mouth_{name}_mix
 * e.g. MOUTH_STATES.happy → drives input "mouth_happy_mix"
 * 'neutral' is the base state — no dedicated input, visible when all mixes are 0.
 */
export const MOUTH_STATES = {
	neutral: 'neutral',
	sad: 'sad',
	happy: 'happy',
	surprised: 'surprised'
} as const;

export type MouthState = (typeof MOUTH_STATES)[keyof typeof MOUTH_STATES];
