import type { PageServerLoad } from './$types';
import { requireRole } from '$lib/auth/auth-helpers.server';

export const load = (async ({ locals }) => {
	// Require teacher authentication for this test page
	await requireRole(locals, 'TEACHER');
	
	return {
		message: "Server load function works!"
	};
}) satisfies PageServerLoad;