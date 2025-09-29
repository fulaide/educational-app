import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import { requireRole } from '$lib/auth/auth-helpers.server';

const createClassSchema = z.object({
	name: z.string().min(1, 'Class name is required').max(100, 'Class name too long'),
	grade: z.number().int().min(1, 'Grade must be at least 1').max(4, 'Grade must be at most 4 for primary school'),
	maxStudents: z.number().int().min(1, 'Must allow at least 1 student').max(50, 'Maximum 50 students per class'),
	avatarUrl: z.string().optional().or(z.literal('')),
	avatarType: z.enum(['PRESET', 'CUSTOM']).default('PRESET')
});

export const load = (async ({ locals }) => {
	const session = await requireRole(locals, 'TEACHER');

	try {
		const classes = await prisma.class.findMany({
			where: {
				teacherId: session.user.id
			},
			include: {
				students: {
					select: {
						id: true,
						name: true,
						uuid: true,
						grade: true,
						isActive: true
					}
				},
				organization: {
					select: {
						id: true,
						name: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const createClassForm = await superValidate(zod(createClassSchema));

		return {
			classes,
			createClassForm
		};
	} catch (error) {
		console.error('Failed to load classes:', error);
		return {
			classes: [],
			createClassForm: await superValidate(zod(createClassSchema))
		};
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER');

		const form = await superValidate(request, zod(createClassSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const newClass = await prisma.class.create({
				data: {
					name: form.data.name,
					grade: form.data.grade,
					maxStudents: form.data.maxStudents,
					avatarUrl: form.data.avatarUrl,
					avatarType: form.data.avatarType,
					teacherId: session.user.id,
					organizationId: session.user.organizationId!
				}
			});

			return message(form, `Class "${newClass.name}" created successfully!`);
		} catch (error) {
			console.error('Failed to create class:', error);
			return message(form, 'Failed to create class. Please try again.', {
				status: 500
			});
		}
	}
};
