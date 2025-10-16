import { fail } from '@sveltejs/kit';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await requireRole(locals, 'TEACHER');

	try {
		// Fetch teacher's challenges with assignment counts
		const challenges = await locals.prisma.vocabularyChallenge.findMany({
			where: {
				createdBy: session.user.id,
				isActive: true
			},
			include: {
				_count: {
					select: {
						exercises: true,
						assignments: true
					}
				},
				assignments: {
					include: {
						_count: {
							select: {
								attempts: true
							}
						},
						class: {
							select: {
								id: true,
								name: true,
								_count: {
									select: {
										students: true
									}
								}
							}
						},
						student: {
							select: {
								id: true,
								name: true,
								uuid: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		// Calculate statistics for each challenge
		const challengesWithStats = await Promise.all(
			challenges.map(async (challenge) => {
				// Count total students assigned
				const classAssignments = challenge.assignments.filter(a => a.assignedToClass);
				const individualAssignments = challenge.assignments.filter(a => a.assignedToStudent);

				const totalStudentsFromClasses = classAssignments.reduce(
					(sum, assignment) => sum + (assignment.class?._count.students || 0),
					0
				);
				const totalStudents = totalStudentsFromClasses + individualAssignments.length;

				// Count completion attempts
				const totalAttempts = challenge.assignments.reduce(
					(sum, assignment) => sum + assignment._count.attempts,
					0
				);

				// Get completion rate from challenge attempts
				const completedAttempts = await locals.prisma.challengeAttempt.count({
					where: {
						assignment: {
							challengeId: challenge.id
						},
						isComplete: true
					}
				});

				const completionRate = totalAttempts > 0
					? Math.round((completedAttempts / totalAttempts) * 100)
					: 0;

				// Get average score
				const attempts = await locals.prisma.challengeAttempt.findMany({
					where: {
						assignment: {
							challengeId: challenge.id
						},
						isComplete: true,
						score: { not: null }
					},
					select: {
						score: true,
						totalPoints: true
					}
				});

				let averageScore = 0;
				if (attempts.length > 0) {
					const totalScore = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
					const totalPossible = attempts.reduce((sum, a) => sum + a.totalPoints, 0);
					averageScore = totalPossible > 0
						? Math.round((totalScore / totalPossible) * 100)
						: 0;
				}

				return {
					...challenge,
					stats: {
						totalStudents,
						totalAttempts,
						completionRate,
						averageScore,
						classCount: classAssignments.length,
						individualCount: individualAssignments.length
					}
				};
			})
		);

		return {
			challenges: challengesWithStats
		};
	} catch (error) {
		console.error('Error loading challenges:', error);
		return fail(500, { message: 'Failed to load challenges' });
	}
};
