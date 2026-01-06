import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'

/**
 * Logout endpoint - clears the session cookie
 */
export async function POST({ cookies }: RequestEvent) {
	// Clear the session cookie
	cookies.delete('student-session', { path: '/' })

	return json({ success: true })
}
