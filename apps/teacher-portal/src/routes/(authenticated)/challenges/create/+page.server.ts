import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// Validation schemas
const createChallengeSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional().default(''),
	wordIds: z.array(z.string()).min(1, 'Select at least one word'),
	exerciseType: z.enum(['MULTIPLE_CHOICE', 'FILL_BLANK', 'SPELLING', 'MATCHING']),
	difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
	timeLimit: z.number().min(0).max(600).optional(),
	attemptsAllowed: z.number().min(1).max(10).default(3),
	enableHints: z.boolean().default(true),
	enableExplanations: z.boolean().default(true),
	distractorTypes: z.array(z.enum(['PHONETIC', 'VISUAL', 'SEMANTIC', 'GRAMMATICAL'])).default(['SEMANTIC', 'PHONETIC']),
	distractorCount: z.number().min(2).max(5).default(3),
	distractorDifficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
	customDistractors: z.array(z.object({
		wordId: z.string(),
		distractors: z.array(z.string())
	})).default([]),
	assignToClassIds: z.array(z.string()).default([]),
	assignToStudentIds: z.array(z.string()).default([]),
	availableFrom: z.string().optional(),
	availableUntil: z.string().optional()
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user) {
		return fail(401, { message: 'Unauthorized' });
	}

	// Get teacher's organization
	const organizationId = session.user.organizationId;

	if (!organizationId) {
		return fail(400, { message: 'No organization found' });
	}

	try {
		// Fetch vocabulary words for the organization
		const vocabularyWords = await locals.prisma.vocabularyWord.findMany({
			where: {
				organizationId,
				isActive: true
			},
			select: {
				id: true,
				word: true,
				translation: true,
				category: true,
				difficulty: true,
				frequency: true,
				tags: true,
				imageUrl: true,
				audioUrl: true,
				phonetic: true,
				examples: true,
				language: true
			},
			orderBy: [
				{ category: 'asc' },
				{ difficulty: 'asc' },
				{ word: 'asc' }
			]
		});

		// Fetch teacher's classes
		const classes = await locals.prisma.class.findMany({
			where: {
				teacherId: session.user.id,
				isActive: true
			},
			select: {
				id: true,
				name: true,
				grade: true,
				students: {
					select: {
						id: true,
						name: true,
						uuid: true
					}
				}
			},
			orderBy: {
				name: 'asc'
			}
		});

		// Initialize form
		const form = await superValidate(zod(createChallengeSchema));

		return {
			form,
			vocabularyWords,
			classes,
			categories: Array.from(new Set(vocabularyWords.map(w => w.category))),
			difficulties: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
		};
	} catch (error) {
		console.error('Error loading challenge builder data:', error);
		return fail(500, { message: 'Failed to load data' });
	}
};

export const actions: Actions = {
	createChallenge: async ({ request, locals }) => {
		const session = await locals.auth();

		if (!session?.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const organizationId = session.user.organizationId;
		if (!organizationId) {
			return fail(400, { message: 'No organization found' });
		}

		const form = await superValidate(request, zod(createChallengeSchema));

		if (!form.valid) {
			return fail(400, { form, message: 'Invalid form data' });
		}

		try {
			// Generate a title if not provided
			const title = form.data.title ||
				`${form.data.exerciseType.replace('_', ' ')} - ${new Date().toLocaleDateString()}`;

			// Fetch full word data
			const words = await locals.prisma.vocabularyWord.findMany({
				where: {
					id: { in: form.data.wordIds },
					organizationId
				}
			});

			if (words.length !== form.data.wordIds.length) {
				return fail(400, { form, message: 'Some selected words not found' });
			}

			// Create custom distractors map
			const customDistractorsMap = new Map(
				form.data.customDistractors.map(cd => [cd.wordId, cd.distractors])
			);

			// Create the challenge and exercises in a transaction
			const challenge = await locals.prisma.$transaction(async (tx) => {
				// 1. Create the challenge
				const newChallenge = await tx.vocabularyChallenge.create({
					data: {
						organizationId,
						title,
						description: `${form.data.exerciseType} exercise with ${words.length} words`,
						exerciseType: form.data.exerciseType,
						difficulty: form.data.difficulty,
						timeLimit: form.data.timeLimit,
						attemptsAllowed: form.data.attemptsAllowed,
						enableHints: form.data.enableHints,
						enableExplanations: form.data.enableExplanations,
						createdBy: session.user.id
					}
				});

				// 2. Generate exercises for each word
				const exercises = await Promise.all(
					words.map(async (word, index) => {
						// Get custom distractors or generate them
						const customDistractors = customDistractorsMap.get(word.id) || [];
						const distractors = await generateDistractors(
							word,
							customDistractors,
							form.data.distractorCount,
							form.data.distractorTypes,
							form.data.distractorDifficulty || form.data.difficulty,
							words,
							tx
						);

						// Create exercise based on type
						return tx.challengeExercise.create({
							data: {
								challengeId: newChallenge.id,
								wordId: word.id,
								order: index,
								question: {
									type: form.data.exerciseType,
									text: generateQuestionText(form.data.exerciseType, word),
									word: word.word,
									translation: word.translation,
									imageUrl: word.imageUrl,
									audioUrl: word.audioUrl
								},
								correctAnswer: word.translation,
								distractors: distractors.map((d, i) => ({
									id: `distractor-${i}`,
									text: d.text,
									type: d.type,
									similarity: d.similarity
								})),
								hints: generateHints(word, form.data.enableHints),
								explanation: form.data.enableExplanations
									? `"${word.word}" means "${word.translation}" in English.`
									: null
							}
						});
					})
				);

				// 3. Create assignments
				const assignments = [];

				// Assign to classes
				for (const classId of form.data.assignToClassIds) {
					assignments.push(
						tx.challengeAssignment.create({
							data: {
								challengeId: newChallenge.id,
								assignedBy: session.user.id,
								assignedToClass: classId,
								availableFrom: form.data.availableFrom
									? new Date(form.data.availableFrom)
									: undefined,
								availableUntil: form.data.availableUntil
									? new Date(form.data.availableUntil)
									: undefined
							}
						})
					);
				}

				// Assign to individual students
				for (const studentId of form.data.assignToStudentIds) {
					assignments.push(
						tx.challengeAssignment.create({
							data: {
								challengeId: newChallenge.id,
								assignedBy: session.user.id,
								assignedToStudent: studentId,
								availableFrom: form.data.availableFrom
									? new Date(form.data.availableFrom)
									: undefined,
								availableUntil: form.data.availableUntil
									? new Date(form.data.availableUntil)
									: undefined
							}
						})
					);
				}

				await Promise.all(assignments);

				return newChallenge;
			});

			return {
				form,
				message: `Challenge "${title}" created successfully! Assigned to ${form.data.assignToClassIds.length} class(es) and ${form.data.assignToStudentIds.length} student(s).`,
				challengeId: challenge.id
			};
		} catch (error) {
			console.error('Error creating challenge:', error);
			return fail(500, { form, message: 'Failed to create challenge' });
		}
	}
};

// Helper functions

function generateQuestionText(exerciseType: string, word: any): string {
	switch (exerciseType) {
		case 'MULTIPLE_CHOICE':
			return `What is the correct translation for "${word.word}"?`;
		case 'FILL_BLANK':
			return `Complete the sentence with the correct word`;
		case 'SPELLING':
			return `How do you spell "${word.translation}" in German?`;
		case 'MATCHING':
			return `Match the German word with its English translation`;
		default:
			return `Translate: ${word.word}`;
	}
}

function generateHints(word: any, enableHints: boolean): string[] {
	if (!enableHints) return [];

	const hints: string[] = [];

	// Add phonetic hint if available
	if (word.phonetic) {
		hints.push(`Pronunciation: ${word.phonetic}`);
	}

	// Add category hint
	if (word.category) {
		hints.push(`This word is in the category: ${word.category.toLowerCase()}`);
	}

	// Add first letter hint
	if (word.translation) {
		hints.push(`The translation starts with: ${word.translation[0].toUpperCase()}`);
	}

	return hints.slice(0, 3); // Max 3 hints
}

async function generateDistractors(
	word: any,
	customDistractors: string[],
	count: number,
	types: string[],
	difficulty: string,
	allWords: any[],
	tx: any
): Promise<Array<{ text: string; type: string; similarity: number }>> {
	const distractors: Array<{ text: string; type: string; similarity: number }> = [];

	// Use custom distractors first
	customDistractors.forEach((text, index) => {
		if (index < count) {
			distractors.push({
				text,
				type: 'CUSTOM',
				similarity: 1.0
			});
		}
	});

	// If we need more distractors, generate them
	const neededCount = count - distractors.length;
	if (neededCount > 0) {
		// Filter words from same category for semantic similarity
		const sameCategory = allWords.filter(
			w => w.id !== word.id && w.category === word.category
		);

		// Filter words with phonetic similarity (starts with same letter)
		const phoneticSimilar = allWords.filter(
			w => w.id !== word.id &&
			w.translation[0].toLowerCase() === word.translation[0].toLowerCase()
		);

		// Combine and deduplicate
		const candidates = new Map<string, any>();

		if (types.includes('SEMANTIC')) {
			sameCategory.forEach(w => candidates.set(w.id, { ...w, type: 'SEMANTIC' }));
		}
		if (types.includes('PHONETIC')) {
			phoneticSimilar.forEach(w => {
				if (!candidates.has(w.id)) {
					candidates.set(w.id, { ...w, type: 'PHONETIC' });
				}
			});
		}

		// Add random words as fallback
		const randomWords = allWords
			.filter(w => w.id !== word.id && !candidates.has(w.id))
			.slice(0, neededCount);

		randomWords.forEach(w => candidates.set(w.id, { ...w, type: 'RANDOM' }));

		// Select distractors
		const candidateArray = Array.from(candidates.values());
		const selectedDistractors = candidateArray
			.sort(() => Math.random() - 0.5) // Shuffle
			.slice(0, neededCount);

		selectedDistractors.forEach(d => {
			distractors.push({
				text: d.translation,
				type: d.type,
				similarity: d.type === 'SEMANTIC' ? 0.8 : d.type === 'PHONETIC' ? 0.6 : 0.3
			});
		});
	}

	// Fill remaining with simple alternatives if still needed
	while (distractors.length < count) {
		distractors.push({
			text: `${word.translation} (variant ${distractors.length + 1})`,
			type: 'GENERATED',
			similarity: 0.2
		});
	}

	return distractors.slice(0, count);
}
