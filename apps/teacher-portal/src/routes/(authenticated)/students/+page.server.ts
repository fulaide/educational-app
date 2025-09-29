import type { PageServerLoad } from './$types'
import { prisma } from '@educational-app/database'
import { requireRole } from '$lib/auth/auth-helpers.server'

export const load: PageServerLoad = async ({ locals }) => {
	// Ensure user is authenticated and is a teacher
	const session = await requireRole(locals, 'TEACHER');
	
	try {
		// Get teacher's classes and students
		const teacherData = await prisma.user.findUnique({
			where: { id: session.user.id },
			include: {
				teacherClasses: {
					include: {
						students: {
							select: { id: true, name: true, uuid: true, lastLoginAt: true }
						},
						_count: { select: { students: true } }
					},
					orderBy: { createdAt: 'desc' }
				},
				organization: {
					select: { id: true, name: true }
				}
			}
		});

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
			teacherData,
			totalClasses,
			totalStudents,
			organization: teacherData?.organization
		};
	} catch (error) {
		console.error('Students page load error:', error);
		return {
			user: session.user,
			teacherData: null,
			totalClasses: 0,
			totalStudents: 0,
			organization: null,
			error: 'Failed to load students data'
		};
	}
}