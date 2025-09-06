import { error, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.role !== 'PARENT') {
		throw redirect(302, '/auth/signin');
	}

	const { childId } = params;
	const parentId = locals.user.id;

	try {
		// Verify parent-child relationship
		const parentChildLink = await prisma.parentChild.findFirst({
			where: {
				parentId: parentId,
				childId: childId,
				isActive: true
			},
			include: {
				child: {
					select: {
						id: true,
						name: true,
						uuid: true,
						grade: true,
						isActive: true
					}
				}
			}
		});

		if (!parentChildLink) {
			throw error(404, 'Child not found or not linked to your account');
		}

		// Get student progress data
		const studentProgress = await prisma.studentProgress.findMany({
			where: {
				studentId: childId
			},
			include: {
				task: {
					include: {
						module: {
							select: {
								title: true,
								subject: true,
								difficulty: true
							}
						}
					}
				}
			},
			orderBy: {
				startedAt: 'desc'
			},
			take: 50
		});

		// Get student achievements
		const achievements = await prisma.studentAchievement.findMany({
			where: {
				studentId: childId
			},
			include: {
				achievement: true
			},
			orderBy: {
				unlockedAt: 'desc'
			}
		});

		// Calculate summary stats
		const totalTasks = studentProgress.length;
		const completedTasks = studentProgress.filter(p => p.status === 'COMPLETED').length;
		const averageScore = studentProgress.length > 0 
			? studentProgress.filter(p => p.score !== null).reduce((sum, p) => sum + (p.score || 0), 0) / studentProgress.filter(p => p.score !== null).length
			: 0;
		const totalXp = completedTasks * 10; // Default XP per task
		const totalTimeSpent = studentProgress.reduce((sum, p) => sum + p.timeSpent, 0);

		return {
			child: parentChildLink.child,
			progress: {
				tasks: studentProgress,
				achievements,
				stats: {
					totalTasks,
					completedTasks,
					completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
					averageScore: Math.round(averageScore),
					totalXp,
					totalTimeSpent
				}
			}
		};

	} catch (err: any) {
		console.error('[CHILD PROGRESS] Error loading progress:', err);
		
		if (err.status) {
			throw err;
		}
		
		throw error(500, 'Failed to load child progress');
	}
};