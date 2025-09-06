import type { Handle } from '@sveltejs/kit'
import { prisma } from '@educational-app/database'
import jwt from 'jsonwebtoken'

// Define UserRole enum for our custom authentication system
const UserRole = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER', 
  PARENT: 'PARENT',
  ADMIN: 'ADMIN'
} as const;

// Role-based access control middleware
const authorizationHandle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url)
	const pathname = url.pathname
	
	console.log(`[PARENT AUTH] Processing: ${event.request.method} ${pathname}`)

	// Skip auth routes and SvelteKit internal routes to avoid redirect loops
	if (pathname.startsWith('/auth/') || 
		pathname.startsWith('/_app/') ||
		pathname.startsWith('/_svelte_kit_') ||
		pathname.startsWith('/favicon.ico') ||
		pathname.endsWith('.css') ||
		pathname.endsWith('.js') ||
		pathname.endsWith('.ico')) {
		console.log(`[PARENT AUTH] Skipping auth check for: ${pathname}`)
		return resolve(event)
	}
	
	// For __data.json routes, extract the base route and check if it's protected
	let routeToCheck = pathname
	if (pathname.includes('/__data.json')) {
		routeToCheck = pathname.replace('/__data.json', '')
		console.log(`[PARENT AUTH] Checking data route: ${pathname} → base route: ${routeToCheck}`)
	}

	// Check for custom session cookie
	const sessionToken = event.cookies.get('session')
	let user = null
	
	if (sessionToken) {
		try {
			const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key'
			const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
			
			// For now, just validate JWT token without database check
			user = decoded
			event.locals.user = user
			console.log(`[PARENT AUTH] Valid session for user: ${user.email}`)
		} catch (error) {
			console.log('[PARENT AUTH] Invalid session token, clearing cookie')
			// Invalid token, clear cookie
			event.cookies.delete('session', { path: '/' })
		}
	}

	// Define protected routes for parents
	const parentRoutes = ['/dashboard', '/children', '/progress', '/link-child']
	const isProtectedRoute = parentRoutes.some(route => routeToCheck.startsWith(route))

	if (isProtectedRoute) {
		if (user) {
			const userRole = user.role

			// Only allow parents to access protected parent portal routes
			if (userRole !== 'PARENT') {
				return new Response('Forbidden - Parent Portal Access Only', { status: 403 })
			}
		} else {
			// Redirect to signin for protected routes
			const redirectUrl = `/auth/signin?callbackUrl=${encodeURIComponent(routeToCheck)}`
			console.log(`[PARENT AUTH] Redirecting ${pathname} → ${redirectUrl}`)
			return new Response(null, {
				status: 302,
				headers: { 
					location: redirectUrl
				}
			})
		}
	}

	return resolve(event)
}

// Use only our custom authorization middleware
export const handle = authorizationHandle