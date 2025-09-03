import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies }) => {
	// Clear the session cookie
	cookies.delete('session', { path: '/' })
	
	console.log('[SIGNOUT] Session cleared, redirecting to signin')
	
	// Redirect to signin page
	throw redirect(302, '/auth/signin')
}