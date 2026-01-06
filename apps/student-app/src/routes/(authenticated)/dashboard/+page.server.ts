import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const studentId = locals.user!.id

	// For Phase 2, return mock data
	// In future phases, query real data from database
	return {
		stats: {
			xp: 1250,
			level: 5,
			wordsLearned: 28,
			wordsDueReview: 12,
			streak: 3,
			accuracy: 85
		},
		recentSessions: [
			{
				id: '1',
				type: 'Vocabulary Practice',
				completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
				wordsCount: 10,
				accuracy: 90
			},
			{
				id: '2',
				type: 'New Words',
				completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
				wordsCount: 5,
				accuracy: 80
			}
		],
		todayProgress: {
			wordsCompleted: 15,
			dailyGoal: 20,
			xpEarned: 150
		}
	}
}
