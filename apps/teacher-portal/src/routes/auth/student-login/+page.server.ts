import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import { setSession, clearSession } from '$lib/auth/session.server';

const studentLoginSchema = z.object({
	uuid: z.string().min(8, 'Code must be at least 8 characters').max(8, 'Code must be exactly 8 characters').regex(/^[A-Za-z0-9]{8}$/, 'Code must contain only letters and numbers')
});

export const load = (async ({ locals }) => {
	// If already logged in, redirect to appropriate portal
	const existingSession = await locals.getSession();
	if (existingSession?.user) {
		if (existingSession.user.role === 'STUDENT') {
			throw redirect(303, '/student-portal');
		}
		// Clear session if wrong role is trying to access student login
		await clearSession(locals);
	}

	const form = await superValidate(zod(studentLoginSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(studentLoginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { uuid } = form.data;

			// Find student by UUID
			const student = await prisma.user.findUnique({
				where: {
					uuid: uuid.toUpperCase(),
					role: 'STUDENT'
				},
				include: {
					organization: true,
					studentClasses: {
						include: {
							teacher: {
								select: {
									id: true,
									name: true,
									email: true
								}
							}
						}
					}
				}
			});

			if (!student) {
				return message(form, 'Invalid student code. Please check your code and try again.', {
					status: 400
				});
			}

			if (!student.isActive) {
				return message(form, 'This student account is not active. Please contact your teacher.', {
					status: 400
				});
			}

			// Update last login
			await prisma.user.update({
				where: { id: student.id },
				data: { lastLoginAt: new Date() }
			});

			// Create session
			await setSession(locals, {
				user: {
					id: student.id,
					email: student.email,
					name: student.name,
					role: student.role,
					organizationId: student.organizationId,
					uuid: student.uuid,
					grade: student.grade
				}
			});

			// Redirect to student portal or dashboard
			throw redirect(303, '/student-portal');

		} catch (error) {
			console.error('Student login error:', error);
			return message(form, 'Login failed. Please try again.', {
				status: 500
			});
		}
	}
};
