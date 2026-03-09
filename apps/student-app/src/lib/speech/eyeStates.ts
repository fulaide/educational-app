/**
 * Eye state names match the Rive input keys: eye_{name}_mix
 * e.g. EYE_STATES.happy → drives input "eye_happy_mix"
 * 'neutral' is the base state — no dedicated input, visible when all mixes are 0.
 */
export const EYE_STATES = {
	neutral: 'neutral',
	happy: 'happy',
	glad: 'glad',
	closed: 'closed',
	bored: 'bored',
	serious: 'serious',
	surprise: 'surprise',
	glasses: 'glasses'
} as const;

export type EyeState = (typeof EYE_STATES)[keyof typeof EYE_STATES];
