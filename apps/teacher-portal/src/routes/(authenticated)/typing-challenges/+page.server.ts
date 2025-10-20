import { error } from '@sveltejs/kit';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await requireRole(locals, 'TEACHER');

	if (!locals.prisma) {
		throw error(500, 'Database connection not available');
	}

	try {
		console.log('[Typing Challenges] Loading challenges for user:', session.user.id);

		// Fetch teacher's typing challenges
		const challenges = await locals.prisma.typingChallenge.findMany({
			where: {
				createdBy: session.user.id,
				isActive: true
			},
			include: {
				texts: {
					select: {
						id: true,
						wordCount: true,
						characterCount: true,
						hasUmlauts: true
					}
				},
				assignments: {
					select: {
						id: true,
						assignedToClass: true,
						assignedToStudent: true
					}
				},
				_count: {
					select: {
						texts: true,
						assignments: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		console.log('[Typing Challenges] Found', challenges.length, 'challenges');

		// Calculate statistics for each challenge
		const challengesWithStats = challenges.map((challenge) => {
			const totalWords = challenge.texts.reduce((sum, text) => sum + text.wordCount, 0);
			const totalCharacters = challenge.texts.reduce((sum, text) => sum + text.characterCount, 0);
			const hasUmlauts = challenge.texts.some(text => text.hasUmlauts);

			const classAssignments = challenge.assignments.filter(a => a.assignedToClass);
			const individualAssignments = challenge.assignments.filter(a => a.assignedToStudent);

			return {
				...challenge,
				stats: {
					totalWords,
					totalCharacters,
					hasUmlauts,
					textCount: challenge._count.texts,
					assignmentCount: challenge._count.assignments,
					classCount: classAssignments.length,
					individualCount: individualAssignments.length
				}
			};
		});

		console.log('[Typing Challenges] Loaded', challengesWithStats.length, 'challenges with stats');

		return {
			challenges: challengesWithStats
		};
	} catch (err) {
		console.error('[Typing Challenges] Error loading challenges:', err);
		throw error(500, {
			message: 'Failed to load typing challenges. Please try again.'
		});
	}
};
