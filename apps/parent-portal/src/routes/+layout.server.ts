import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Pass user locale to the client if user is authenticated
	return {
		userLocale: locals.user?.locale || null,
		user: locals.user ? {
			id: locals.user.id,
			email: locals.user.email,
			name: locals.user.name,
			role: locals.user.role,
			locale: locals.user.locale
		} : null
	};
};