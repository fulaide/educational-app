import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// Temporary: Skip authentication for testing image picker component
	// await requireRole(locals, 'TEACHER');
	
	return {};
}) satisfies PageServerLoad;