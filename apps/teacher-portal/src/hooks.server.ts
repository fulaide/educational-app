import { SvelteKitAuth } from '@auth/sveltekit'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from '@auth/sveltekit/providers/credentials'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { PrismaClient } from '@educational-app/database'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Create prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Define UserRole enum locally for now
const UserRole = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER', 
  PARENT: 'PARENT',
  ADMIN: 'ADMIN'
} as const;

export const { handle: authHandle, signIn, signOut } = SvelteKitAuth({
	// adapter: PrismaAdapter(prisma), // Temporarily disabled to debug
	providers: [
		Credentials({
			id: 'teacher-login',
			name: 'Teacher Login',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				// Mock authentication for development
				if (credentials.email === 'teacher@test.com' && credentials.password === 'password123') {
					return {
						id: 'mock-teacher-id',
						email: 'teacher@test.com',
						name: 'Test Teacher',
						role: 'TEACHER',
						organizationId: 'mock-org-id'
					}
				}

				return null

				// Original database code (commented for debugging)
				/*
				const user = await prisma.user.findUnique({
					where: { 
						email: credentials.email as string,
						role: 'TEACHER'
					}
				})

				if (!user || !user.password || !user.isActive) {
					return null
				}

				const isValid = await bcryptjs.compare(
					credentials.password as string,
					user.password
				)

				if (!isValid) {
					return null
				}

				// Update last login
				await prisma.user.update({
					where: { id: user.id },
					data: { lastLoginAt: new Date() }
				})

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					organizationId: user.organizationId
				}
				*/
			}
		}),
		Credentials({
			id: 'parent-login',
			name: 'Parent Login',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				return null // Not used in teacher portal
			}
		}),
		Credentials({
			id: 'student-login',
			name: 'Student Login',
			credentials: {
				uuid: { label: 'Student Code', type: 'text' }
			},
			async authorize(credentials) {
				return null // Not used in teacher portal
			}
		})
	],
	callbacks: {
		async session({ session, token }) {
			if (token?.sub) {
				session.user.id = token.sub
				session.user.role = token.role as UserRole
				session.user.organizationId = token.organizationId as string
				session.user.uuid = token.uuid as string
				session.user.grade = token.grade as number
			}
			return session
		},
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role
				token.organizationId = user.organizationId
				token.uuid = user.uuid
				token.grade = user.grade
			}
			return token
		}
	},
	// pages: {
	//	signIn: '/auth/signin'
	// },
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60 // 24 hours
	},
	secret: process.env.AUTH_SECRET
})

// Role-based access control middleware
const authorizationHandle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url)
	const pathname = url.pathname
	
	console.log(`[AUTH] Processing: ${event.request.method} ${pathname}`)

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