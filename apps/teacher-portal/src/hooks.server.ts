import type { Handle } from '@sveltejs/kit'
import { prisma } from '@educational-app/database'
import jwt from 'jsonwebtoken'
import { autoCleanupSessions } from '$lib/server/session-cleanup'

// Define UserRole enum for our custom authentication system
const UserRole = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER', 
  PARENT: 'PARENT',
  ADMIN: 'ADMIN'
} as const;

// Role-based access control middleware
const authorizationHandle: Handle = async ({ event, resolve }) => {
	// Add Prisma client to event.locals so it's available in all routes
	event.locals.prisma = prisma;

	const url = new URL(event.request.url)
	const pathname = url.pathname

	console.log(`[AUTH] Processing: ${event.request.method} ${pathname}`)

	// Perform periodic session cleanup (temporarily disabled due to Prisma client issues)
	// autoCleanupSessions().catch(error => {
	//   console.error('[AUTH] Auto cleanup failed:', error)
	// })

	// Skip auth routes and SvelteKit internal routes to avoid redirect loops
	// BUT protect __data.json routes for protected pages
	if (pathname.startsWith('/auth/') || 
		pathname.startsWith('/_app/') ||
		pathname.startsWith('/_svelte_kit_') ||
		pathname.startsWith('/favicon.ico') ||
		pathname.endsWith('.css') ||
		pathname.endsWith('.js') ||
		pathname.endsWith('.ico')) {
		console.log(`[AUTH] Skipping auth check for: ${pathname}`)
		return resolve(event)
	}
	
	// For __data.json routes, extract the base route and check if it's protected
	let routeToCheck = pathname
	if (pathname.includes('/__data.json')) {
		routeToCheck = pathname.replace('/__data.json', '')
		console.log(`[AUTH] Checking data route: ${pathname} → base route: ${routeToCheck}`)
	}

	// Check for custom session cookie
	const sessionToken = event.cookies.get('session')
	let user = null
	
	if (sessionToken) {
		try {
			const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key'
			const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
			
			// TODO: Check if session exists in database and is still valid (disabled until DB running)
			// const sessionRecord = await prisma.userSession.findUnique({
			//   where: { tokenId: decoded.jti }
			// })
			// 
			// if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
			//   console.log('[AUTH] Session expired or not found in database, clearing cookie')
			//   event.cookies.delete('session', { path: '/' })
			// } else {
			//   // Update last active time
			//   await prisma.userSession.update({
			//     where: { tokenId: decoded.jti },
			//     data: { lastActive: new Date() }
			//   })
			//   
			//   user = decoded
			//   event.locals.user = user
			//   console.log(`[AUTH] Valid session for user: ${user.email}`)
			// }
			
			// For now, just validate JWT token without database check
			user = decoded
			event.locals.user = user
			console.log(`[AUTH] Valid session for user: ${user.email}`)
		} catch (error) {
			console.log('[AUTH] Invalid session token, clearing cookie')
			// Invalid token, clear cookie
			event.cookies.delete('session', { path: '/' })
		}
	}

	// Define protected routes
	const teacherRoutes = ['/dashboard', '/students', '/classes', '/assessments']
	const parentRoutes = ['/parent-dashboard', '/children', '/progress']
	const adminRoutes = ['/admin']

	const isProtectedRoute = [...teacherRoutes, ...parentRoutes, ...adminRoutes].some(route => routeToCheck.startsWith(route))

	if (user) {
		const userRole = user.role

		// Check if user is trying to access unauthorized routes
		if (userRole === 'TEACHER' && parentRoutes.some(route => routeToCheck.startsWith(route))) {
			return new Response('Forbidden', { status: 403 })
		}
		
		if (userRole === 'PARENT' && teacherRoutes.some(route => routeToCheck.startsWith(route))) {
			return new Response('Forbidden', { status: 403 })
		}
		
		if (userRole !== 'ADMIN' && adminRoutes.some(route => routeToCheck.startsWith(route))) {
			return new Response('Forbidden', { status: 403 })
		}
	} else if (isProtectedRoute) {
		// For data routes, redirect to signin as well (instead of 401)
		// This prevents SvelteKit from showing error pages
		const redirectUrl = `/auth/signin?callbackUrl=${encodeURIComponent(routeToCheck)}`
		console.log(`[AUTH] Redirecting ${pathname} → ${redirectUrl}`)
		return new Response(null, {
			status: 302,
			headers: { 
				location: redirectUrl
			}
		})
	}

	return resolve(event)
}

// Use only our custom authorization middleware
export const handle = authorizationHandle