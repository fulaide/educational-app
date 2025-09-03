import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	// Return user data from our custom session system
	return {
		user: event.locals.user || null
	}
}