import type { Actions, PageServerLoad } from './$types'
import { prisma } from '@educational-app/database'
import { requireRole } from '$lib/auth/auth-helpers.server'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { generateUUID } from '$lib/utils/uuid'

const registerStudentsSchema = z.object({
	studentName: z.string().min(1).optional(),
	grade: z.number().min(1).max(4),
	studentCount: z.number().min(1).max(30)
})

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

		const registerForm = await superValidate(zod(registerStudentsSchema));

		return {
			user: session.user,
			teacherData,
			totalClasses,
			totalStudents,
			organization: teacherData?.organization,
			registerForm
		};
	} catch (error) {
		console.error('Students page load error:', error);
		const registerForm = await superValidate(zod(registerStudentsSchema));
		return {
			user: session.user,
			teacherData: null,
			totalClasses: 0,
			totalStudents: 0,
			organization: null,
			registerForm,
			error: 'Failed to load students data'
		};
	}
}

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER');
		const form = await superValidate(request, zod(registerStudentsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { studentName, grade, studentCount } = form.data;
		const teacherId = session.user.id;

		try {
			// Generate students
			const studentsToCreate = [];

			// Parse comma-separated names if provided
			let studentNames: string[] = [];
			if (studentName && studentName.trim()) {
				studentNames = studentName
					.split(',')
					.map(name => name.trim())
					.filter(name => name.length > 0);
			}

			for (let i = 0; i < studentCount; i++) {
				const uuid = generateUUID();
				// Use provided name if available, otherwise generate
				const name = studentNames[i] || `Student ${i + 1}`;

				studentsToCreate.push({
					role: 'STUDENT' as const,
					name,
					uuid,
					grade,
					organizationId: session.user.organizationId,
					isActive: true,
					isVerified: true,
					settings: JSON.stringify({
						createdBy: teacherId,
						createdAt: new Date().toISOString()
					})
				});
			}

			// Create students in database
			const result = await prisma.user.createMany({
				data: studentsToCreate,
				skipDuplicates: true
			});

			return {
				form,
				message: `Successfully created ${result.count} student${result.count !== 1 ? 's' : ''}`,
				students: studentsToCreate.map(s => ({ name: s.name, uuid: s.uuid }))
			};
		} catch (error) {
			console.error('Student registration error:', error);
			return fail(500, {
				form,
				message: 'Failed to create students. Please try again.'
			});
		}
	}
}