import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	logout: async (event) => {
		// Clear any local session data if needed
		// For now, just redirect to home page
		throw redirect(302, '/')
	}
}