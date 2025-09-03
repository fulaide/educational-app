import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key'

export const load: PageServerLoad = async (event) => {
	// Check for existing session cookie
	const sessionToken = event.cookies.get('session')
	if (sessionToken) {
		try {
			jwt.verify(sessionToken, JWT_SECRET)
			const callbackUrl = event.url.searchParams.get('callbackUrl') || '/dashboard'
			throw redirect(302, callbackUrl)
		} catch {
			// Invalid token, continue to signin page
		}
	}
	
	return {
		callbackUrl: event.url.searchParams.get('callbackUrl') || '/dashboard'
	}
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData()
		const email = data.get('email') as string
		const password = data.get('password') as string
		const callbackUrl = data.get('callbackUrl') as string || '/dashboard'

		if (!email || !password) {
			return fail(400, { error: 'Please fill in all fields' })
		}

		// Mock authentication for development (same as in hooks.server.ts)
		if (email === 'teacher@test.com' && password === 'password123') {
			// Create JWT session token
			const userData = {
				id: 'mock-teacher-id',
				email: 'teacher@test.com',
				name: 'Test Teacher',
				role: 'TEACHER',
				organizationId: 'mock-org-id'
			}
			
			const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' })
			
			// Set session cookie
			cookies.set('session', token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 24 * 60 * 60 // 24 hours in seconds
			})
			
			console.log('[SIGNIN] Session created for:', email)
			// Redirect to callback URL
			throw redirect(302, callbackUrl)
		} else {
			return fail(401, { error: 'Invalid credentials. Please try again.' })
		}
	}
}