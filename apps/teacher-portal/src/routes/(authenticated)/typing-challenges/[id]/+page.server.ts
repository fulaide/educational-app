import { error, fail, redirect } from '@sveltejs/kit';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await requireRole(locals, 'TEACHER');

	try {
		const challenge = await locals.prisma.typingChallenge.findUnique({
			where: {
				id: params.id
			},
			include: {
				texts: {
					orderBy: {
						orderIndex: 'asc'
					}
				},
				creator: {
					select: {
						name: true,
						email: true
					}
				},
				assignments: {
					select: {
						id: true
					}
				},
				_count: {
					select: {
						assignments: true
					}
				}
			}
		});

		if (!challenge) {
			throw error(404, 'Typing challenge not found');
		}

		// Check if the teacher has access to this challenge
		if (challenge.createdBy !== session.user.id) {
			throw error(403, 'You do not have access to this challenge');
		}

		return {
			challenge,
			user: session.user
		};
	} catch (err) {
		console.error('[Typing Challenge Detail] Error:', err);
		console.error('[Typing Challenge Detail] Error details:', JSON.stringify(err, null, 2));
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to load typing challenge');
	}
};

export const actions: Actions = {
	deleteChallenge: async ({ locals, params }) => {
		console.log('[Delete Action] Starting delete action for challenge:', params.id);
		const session = await requireRole(locals, 'TEACHER');

		try {
			// Check ownership
			const challenge = await locals.prisma.typingChallenge.findUnique({
				where: { id: params.id },
				select: {
					createdBy: true,
					_count: {
						select: {
							assignments: true
						}
					}
				}
			});

			console.log('[Delete Action] Challenge found:', !!challenge);

			if (!challenge) {
				console.log('[Delete Action] Challenge not found');
				return fail(404, {
					message: 'Typing challenge not found'
				});
			}

			if (challenge.createdBy !== session.user.id) {
				console.log('[Delete Action] Permission denied');
				return fail(403, {
					message: 'You do not have permission to delete this challenge'
				});
			}

			// Check if challenge is assigned to students
			if (challenge._count.assignments > 0) {
				console.log('[Delete Action] Challenge has assignments:', challenge._count.assignments);
				return fail(400, {
					message: `Cannot delete challenge: it is assigned to ${challenge._count.assignments} student${challenge._count.assignments > 1 ? 's' : ''}. Remove assignments first.`
				});
			}

			// Delete challenge (texts will be cascade deleted)
			await locals.prisma.typingChallenge.delete({
				where: { id: params.id }
			});

			console.log('[Delete Action] Challenge deleted successfully, redirecting...');

			// Redirect to list page with success message
			throw redirect(303, '/typing-challenges?deleted=true');
		} catch (err) {
			// Re-throw redirect errors
			if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
				throw err;
			}

			console.error('[Delete Action] Delete error:', err);
			return fail(500, {
				message: 'Failed to delete typing challenge. Please try again.'
			});
		}
	}
};
