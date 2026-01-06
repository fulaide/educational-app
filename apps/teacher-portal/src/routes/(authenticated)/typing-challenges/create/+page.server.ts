import { fail, redirect } from '@sveltejs/kit';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

// Validation schema for typing challenge creation
const createTypingChallengeSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters').max(100),
	description: z.string().optional(),
	gradeLevel: z.coerce.number().min(1).max(4),
	theme: z.enum(['STORY', 'POEM', 'EDUCATIONAL', 'RHYME', 'CUSTOM']),
	difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
	errorHandling: z.enum(['BLOCKING', 'HIGHLIGHTING', 'SPEED_FOCUSED']),
	timerMode: z.enum(['PER_WORD', 'GLOBAL', 'DISABLED']),
	baseTimePerWord: z.coerce.number().min(3000).max(20000).nullable().optional(), // 3-20 seconds, nullable when timer disabled
	enableHints: z.boolean().default(true),
	enableSounds: z.boolean().default(true),
	showKeyboard: z.boolean().default(true),
	texts: z.array(z.object({
		content: z.string().min(10, 'Text must be at least 10 characters'),
		orderIndex: z.number()
	})).min(1, 'At least one text snippet is required')
}).refine((data) => {
	// Require baseTimePerWord when timer mode needs it
	if (data.timerMode === 'PER_WORD' && !data.baseTimePerWord) {
		return false;
	}
	return true;
}, {
	message: 'Time per word is required when using per-word timer mode',
	path: ['baseTimePerWord']
});

// Validation schema for adding text
const addTextSchema = z.object({
	content: z.string().min(10, 'Text must be at least 10 characters')
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await requireRole(locals, 'TEACHER');

	return {
		user: session.user
	};
};

export const actions: Actions = {
	createChallenge: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER');

		try {
			const formData = await request.formData();

			// Parse texts from form data
			const textsJson = formData.get('texts') as string;
			const texts = textsJson ? JSON.parse(textsJson) : [];

			const timerMode = formData.get('timerMode');
			const baseTimePerWordValue = formData.get('baseTimePerWord');

			const data = {
				title: formData.get('title'),
				description: formData.get('description') || undefined,
				gradeLevel: formData.get('gradeLevel'),
				theme: formData.get('theme'),
				difficulty: formData.get('difficulty'),
				errorHandling: formData.get('errorHandling'),
				timerMode,
				// Only include baseTimePerWord if timer mode requires it
				baseTimePerWord: (timerMode === 'DISABLED' || timerMode === 'GLOBAL')
					? null
					: baseTimePerWordValue,
				enableHints: formData.get('enableHints') === 'true',
				enableSounds: formData.get('enableSounds') === 'true',
				showKeyboard: formData.get('showKeyboard') === 'true',
				texts
			};

			// Validate
			const result = createTypingChallengeSchema.safeParse(data);

			if (!result.success) {
				return fail(400, {
					errors: result.error.flatten().fieldErrors,
					data
				});
			}

			const validated = result.data;

			// Create typing challenge
			const challenge = await locals.prisma.typingChallenge.create({
				data: {
					title: validated.title,
					description: validated.description,
					gradeLevel: validated.gradeLevel,
					theme: validated.theme,
					difficulty: validated.difficulty,
					errorHandling: validated.errorHandling,
					timerMode: validated.timerMode,
					// Use provided value, or default to 7000 if PER_WORD mode but no value, or 0 if disabled/global
					baseTimePerWord: validated.baseTimePerWord ??
						(validated.timerMode === 'PER_WORD' ? 7000 : 0),
					enableHints: validated.enableHints,
					enableSounds: validated.enableSounds,
					showKeyboard: validated.showKeyboard,
					createdBy: session.user.id,
					isActive: true,
					texts: {
						create: validated.texts.map((text, index) => {
							const words = text.content.trim().split(/\s+/);
							const hasUmlauts = /[äöüÄÖÜß]/.test(text.content);
							const hasNumbers = /\d/.test(text.content);
							const hasPunctuation = /[.,!?;:]/.test(text.content);
							const hasUppercase = /[A-ZÄÖÜ]/.test(text.content);

							return {
								content: text.content,
								wordCount: words.length,
								characterCount: text.content.length,
								difficulty: 0.5, // TODO: Calculate based on complexity
								hasUmlauts,
								hasNumbers,
								hasPunctuation,
								hasUppercase,
								orderIndex: text.orderIndex
							};
						})
					}
				},
				include: {
					texts: true
				}
			});

			console.log('[Typing Challenge] Created:', challenge.id);

			// Redirect to the detail page with success parameter
			throw redirect(303, `/typing-challenges/${challenge.id}?created=true`);
		} catch (error) {
			// Re-throw redirect errors
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				throw error;
			}

			console.error('[Typing Challenge] Create error:', error);
			return fail(500, {
				message: 'Failed to create typing challenge. Please try again.'
			});
		}
	}
};
