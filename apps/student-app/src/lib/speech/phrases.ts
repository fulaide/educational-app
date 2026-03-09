/** Single source of truth for all pre-generated Kapi phrases. */
export const PHRASES = {
	// Correct answers
	correct_1: 'Super gemacht! Das war richtig!',
	correct_2: 'Toll! Du bist ein echtes Mathe-Genie!',
	correct_3: 'Perfekt! Weiter so!',
	correct_4: 'Juhu! Das stimmt!',
	// Wrong answers
	wrong_1: 'Hmm, das stimmt leider nicht. Versuch es nochmal!',
	wrong_2: 'Fast! Schau nochmal genau hin.',
	wrong_3: 'Das war knapp! Probier es noch einmal.',
	// Encouragement
	encourage_1: 'Du schaffst das!',
	encourage_2: 'Ich glaub an dich!',
	encourage_3: 'Komm, wir versuchen es zusammen!',
	// Intro
	intro: 'Hallo! Ich bin Kapi. Lass uns zusammen lernen!'
} as const;

export type PhraseKey = keyof typeof PHRASES;
