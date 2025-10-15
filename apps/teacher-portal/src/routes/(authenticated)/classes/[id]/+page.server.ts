import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import { requireRole } from '$lib/auth/auth-helpers.server';

const updateClassSchema = z.object({
	name: z.string().min(1, 'Class name is required').max(100, 'Class name too long'),
	grade: z.number().int().min(1, 'Grade must be at least 1').max(4, 'Grade must be at most 4 for primary school'),
	maxStudents: z.number().int().min(1, 'Must allow at least 1 student').max(50, 'Maximum 50 students per class'),
	isActive: z.boolean().default(true),
	avatarUrl: z.string().optional(),
	avatarType: z.enum(['PRESET', 'CUSTOM']).default('PRESET')
});

export const load = (async ({ locals, params }) => {
	const session = await requireRole(locals, 'TEACHER');
	const classId = params.id;

	try {
		// Get class details
		const classItem = await prisma.class.findUnique({
			where: {
				id: classId,
				teacherId: session.user.id // Ensure teacher owns this class
			},
			include: {
				students: {
					select: {
						id: true,
						name: true,
						uuid: true,
						grade: true,
						isActive: true,
						lastLoginAt: true,
						createdAt: true,
						studentQRCodes: {
							where: {
								expiresAt: {
									gt: new Date() // Only non-expired QR codes
								}
							},
							orderBy: {
								createdAt: 'desc'
							},
							take: 1 // Get the most recent active QR code
						}
					},
					orderBy: { name: 'asc' }
				},
				organization: {
					select: { id: true, name: true }
				},
				teacher: {
					select: { id: true, name: true, email: true }
				}
			}
		});

		if (!classItem) {
			throw error(404, 'Class not found');
		}

		// Initialize update form with current values
		const updateForm = await superValidate({
			name: classItem.name,
			grade: classItem.grade,
			maxStudents: classItem.maxStudents,
			isActive: classItem.isActive,
			avatarUrl: classItem.avatarUrl,
			avatarType: classItem.avatarType
		}, zod(updateClassSchema));

		return {
			classItem,
			updateForm
		};
	} catch (err) {
		console.error('Failed to load class:', err);
		if (err instanceof Error && err.message === 'Class not found') {
			throw error(404, 'Class not found');
		}
		throw error(500, 'Failed to load class');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		const session = await requireRole(locals, 'TEACHER');
		const classId = params.id;

		const form = await superValidate(request, zod(updateClassSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Verify teacher owns this class
			const existingClass = await prisma.class.findUnique({
				where: {
					id: classId,
					teacherId: session.user.id
				}
			});

			if (!existingClass) {
				throw error(404, 'Class not found');
			}

			// Update class
			const updatedClass = await prisma.class.update({
				where: { id: classId },
				data: {
					name: form.data.name,
					grade: form.data.grade,
					maxStudents: form.data.maxStudents,
					isActive: form.data.isActive,
					avatarUrl: form.data.avatarUrl,
					avatarType: form.data.avatarType
				}
			});

			return message(form, `Class "${updatedClass.name}" updated successfully!`);
		} catch (err) {
			console.error('Failed to update class:', err);
			return message(form, 'Failed to update class. Please try again.', {
				status: 500
			});
		}
	},

	delete: async ({ locals, params }) => {
		const session = await requireRole(locals, 'TEACHER');
		const classId = params.id;

		try {
			// Verify teacher owns this class
			const existingClass = await prisma.class.findUnique({
				where: {
					id: classId,
					teacherId: session.user.id
				},
				include: {
					students: true
				}
			});

			if (!existingClass) {
				throw error(404, 'Class not found');
			}

			// Check if class has students
			if (existingClass.students.length > 0) {
				return fail(400, { 
					error: `Cannot delete class "${existingClass.name}" because it has ${existingClass.students.length} student(s). Please remove all students first.` 
				});
			}

			// Delete class
			await prisma.class.delete({
				where: { id: classId }
			});

			console.log(`[CLASSES] Class "${existingClass.name}" deleted by teacher ${session.user.id}`);

			// Redirect back to classes list
			throw redirect(303, '/classes?deleted=true');
		} catch (err) {
			console.error('Failed to delete class:', err);
			if (err instanceof Error && err.message.includes('redirect')) {
				// Re-throw redirect
				throw err;
			}
			return fail(500, { 
				error: 'Failed to delete class. Please try again.' 
			});
		}
	}
};
