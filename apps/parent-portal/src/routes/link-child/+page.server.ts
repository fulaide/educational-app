import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { prisma } from '@educational-app/database';
import type { Actions, PageServerLoad } from './$types';

const linkChildSchema = z.object({
	studentUuid: z.string().min(8).max(8) // 8-character student code
});

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'PARENT') {
		throw redirect(302, '/auth/signin');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'PARENT') {
			return fail(401, { error: 'Unauthorized' });
		}

		const parentId = locals.user.id;
		
		try {
			const formData = await request.formData();
			console.log('[LINK CHILD] Form data received:', Object.fromEntries(formData));
			
			const parsed = linkChildSchema.parse({
				studentUuid: formData.get('studentUuid')
			});
			const { studentUuid } = parsed;
			
			console.log('[LINK CHILD] Parsed student UUID:', studentUuid);
			console.log('[LINK CHILD] Parent ID:', parentId);

			// Find student by UUID (first 8 characters)
			console.log('[LINK CHILD] Searching for student with UUID starting with:', studentUuid.toUpperCase());
			
			const student = await prisma.user.findFirst({
				where: {
					role: 'STUDENT',
					uuid: {
						startsWith: studentUuid.toLowerCase()
					},
					isActive: true
				}
			});
			
			console.log('[LINK CHILD] Student search result:', student ? `Found ${student.name} (${student.uuid})` : 'Not found');

			if (!student) {
				return fail(404, { 
					error: 'Student not found. Please check the student code and try again.',
					studentUuid
				});
			}

			// Check if this student is already linked to this parent
			console.log('[LINK CHILD] Checking for existing link between parent', parentId, 'and student', student.id);
			
			const existingLink = await prisma.parentChild.findUnique({
				where: {
					parentId_childId: {
						parentId: parentId,
						childId: student.id
					}
				}
			});

			console.log('[LINK CHILD] Existing link result:', existingLink ? 'Already linked' : 'Not linked');

			if (existingLink) {
				return fail(400, { 
					error: 'This student is already linked to your account.',
					studentUuid,
					alreadyLinked: true
				});
			}

			// Create parent-child relationship
			console.log('[LINK CHILD] Creating parent-child relationship...');
			
			const newLink = await prisma.parentChild.create({
				data: {
					parentId: parentId,
					childId: student.id,
					isActive: true
				}
			});
			
			console.log('[LINK CHILD] Successfully created link:', newLink.id);

			console.log(`[LINK CHILD] Parent ${parentId} linked to student ${student.id} (${student.name})`);

			return {
				success: true,
				linkedChild: {
					name: student.name,
					uuid: student.uuid,
					grade: student.grade
				}
			};

		} catch (error: any) {
			console.error('[LINK CHILD] Unexpected error:', error);
			console.error('[LINK CHILD] Error type:', typeof error);
			console.error('[LINK CHILD] Error name:', error?.name);
			console.error('[LINK CHILD] Error message:', error?.message);
			console.error('[LINK CHILD] Error stack:', error?.stack);
			
			if (error instanceof z.ZodError) {
				console.log('[LINK CHILD] Zod validation error:', error.errors);
				return fail(400, { 
					error: 'Please enter a valid 8-character student code.',
					studentUuid: ''
				});
			}

			return fail(500, { 
				error: 'Failed to link child account. Please try again.',
				studentUuid: ''
			});
		}
	}
};