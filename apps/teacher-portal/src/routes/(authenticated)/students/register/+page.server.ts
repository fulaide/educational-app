import { fail } from '@sveltejs/kit';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { db } from '@educational-app/database';
import { generateUUID } from '$lib/utils/uuid';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { Actions, PageServerLoad } from './$types';

const studentRegistrationSchema = zfd.formData({
	studentName: z.string().min(1).optional(),
	grade: zfd.numeric(z.number().min(1).max(12)),
	studentCount: zfd.numeric(z.number().min(1).max(30))
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await requireRole(locals, 'TEACHER');

	return {
		user: session.user
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER');
		const teacherId = session.user.id;
		
		try {
			const formData = await request.formData();
			const parsed = studentRegistrationSchema.parse(formData);
			
			const { studentName, grade, studentCount } = parsed;

			// Generate students
			const studentsToCreate = [];
			
			for (let i = 0; i < studentCount; i++) {
				const uuid = generateUUID();
				const name = studentCount === 1 && studentName 
					? studentName 
					: `Student ${i + 1}`;

				studentsToCreate.push({
					role: 'STUDENT' as const,
					name,
					uuid,
					grade,
					organizationId: session.user.organizationId,
					isActive: true,
					isVerified: true, // Students don't need email verification
					settings: JSON.stringify({
						createdBy: teacherId,
						createdAt: new Date().toISOString()
					})
				});
			}

			// Create students in database
			const result = await db.user.createMany({
				data: studentsToCreate,
				skipDuplicates: true
			});

			console.log(`Created ${result.count} students for teacher ${teacherId}`);

			return {
				success: true,
				createdCount: result.count,
				students: studentsToCreate.map(s => ({ name: s.name, uuid: s.uuid }))
			};

		} catch (error) {
			console.error('Student registration error:', error);
			
			if (error instanceof z.ZodError) {
				return fail(400, { 
					error: 'Invalid form data: ' + error.errors.map(e => e.message).join(', ') 
				});
			}

			return fail(500, { 
				error: 'Failed to create students. Please try again.' 
			});
		}
	}
};