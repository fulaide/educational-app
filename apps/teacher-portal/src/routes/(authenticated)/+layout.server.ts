import type { LayoutServerLoad } from './$types'
import { requireRole } from '$lib/auth/auth-helpers.server'
import { prisma } from '@educational-app/database'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Ensure user is authenticated and is a teacher
	const session = await requireRole(locals, 'TEACHER');
	
	try {
		// Get basic organization info for the sidebar
		const teacherData = await prisma.user.findUnique({
			where: { id: session.user.id },
			include: {
				organization: {
					select: { id: true, name: true }
				}
			}
		});

		// Get badge counts for navigation
		const totalClasses = await prisma.class.count({
			where: { teacherId: session.user.id }
		});

		const totalStudents = await prisma.user.count({
			where: {
				role: 'STUDENT',
				studentClasses: {
					some: {
						teacherId: session.user.id
					}
				}
			}
		});
		
		return {
			user: session.user,
			organization: teacherData?.organization,
			badges: {
				classes: totalClasses,
				students: totalStudents
			}
		};
	} catch (error) {
		console.error('Layout load error:', error);
		return {
			user: session.user,
			organization: null,
			badges: {
				classes: 0,
				students: 0
			}
		};
	}
}