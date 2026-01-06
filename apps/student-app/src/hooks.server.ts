import { redirect, type Handle } from '@sveltejs/kit'
import { verifyStudentToken, type StudentTokenPayload } from '@educational-app/auth'

/**
 * SvelteKit hooks for server-side authentication and route protection
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Protected routes that require authentication
	const protectedPaths = ['/dashboard', '/vocabulary', '/profile', '/settings']
	const isProtectedRoute = protectedPaths.some((path) => event.url.pathname.startsWith(path))

	// Public routes (no authentication required)
	const isPublicRoute =
		event.url.pathname === '/' ||
		event.url.pathname === '/scan-qr' ||
		event.url.pathname.startsWith('/_app')

	// If accessing protected route, verify JWT token
	if (isProtectedRoute) {
		// Try to get token from Authorization header first
		const authHeader = event.request.headers.get('authorization')
		let token: string | null = null

		if (authHeader?.startsWith('Bearer ')) {
			token = authHeader.substring(7)
		}

		// If no header token, try to get from cookie (for browser requests)
		if (!token) {
			token = event.cookies.get('student-session')
		}

		if (!token) {
			// No token found, redirect to login
			throw redirect(303, '/scan-qr')
		}

		// Verify token
		const payload = await verifyStudentToken(token)

		if (!payload) {
			// Invalid or expired token, clear cookie and redirect to login
			event.cookies.delete('student-session', { path: '/' })
			throw redirect(303, '/scan-qr')
		}

		// Inject user data into event.locals for use in load functions and endpoints
		event.locals.user = {
			id: payload.studentId,
			uuid: payload.uuid,
			name: payload.name,
			grade: payload.grade,
			organizationId: payload.organizationId,
			role: payload.role
		}
	}

	// If accessing login page while already authenticated, redirect to dashboard
	if (event.url.pathname === '/scan-qr' && event.cookies.get('student-session')) {
		const token = event.cookies.get('student-session')
		if (token) {
			const payload = await verifyStudentToken(token)
			if (payload) {
				throw redirect(303, '/dashboard')
			}
		}
	}

	const response = await resolve(event)
	return response
}
