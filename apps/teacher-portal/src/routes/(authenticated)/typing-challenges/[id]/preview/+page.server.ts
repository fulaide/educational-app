import { error } from '@sveltejs/kit';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { PageServerLoad } from './$types';

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
		console.error('[Typing Challenge Preview] Error:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to load typing challenge');
	}
};
