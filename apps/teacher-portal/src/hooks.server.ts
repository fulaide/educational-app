import { SvelteKitAuth } from '@auth/sveltekit'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from '@auth/sveltekit/providers/credentials'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { prisma } from '@educational-app/database'
import bcryptjs from 'bcryptjs'
import { UserRole } from '@educational-app/types'

export const { handle: authHandle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
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
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				const user = await prisma.user.findUnique({
					where: { 
						email: credentials.email as string,
						role: 'PARENT'
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
			}
		}),
		Credentials({
			id: 'student-login',
			name: 'Student Login',
			credentials: {
				uuid: { label: 'Student Code', type: 'text' }
			},
			async authorize(credentials) {
				if (!credentials?.uuid) {
					return null
				}

				const user = await prisma.user.findUnique({
					where: { 
						uuid: credentials.uuid as string,
						role: 'STUDENT'
					}
				})

				if (!user || !user.isActive) {
					return null
				}

				await prisma.user.update({
					where: { id: user.id },
					data: { lastLoginAt: new Date() }
				})

				return {
					id: user.id,
					name: user.name,
					role: user.role,
					uuid: user.uuid,
					grade: user.grade,
					organizationId: user.organizationId
				}
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
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
		error: '/auth/error'
	},
	session: {
		strategy: 'jwt',
		maxAge: 24 * 60 * 60 // 24 hours
	},
	secret: process.env.AUTH_SECRET
})

// Role-based access control middleware
const authorizationHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth()
	
	if (session?.user) {
		event.locals.user = session.user
	}

	// Protected routes check
	const url = new URL(event.request.url)
	const pathname = url.pathname

	// Define protected routes
	const teacherRoutes = ['/dashboard', '/students', '/classes', '/assessments']
	const parentRoutes = ['/parent-dashboard', '/children', '/progress']
	const adminRoutes = ['/admin']

	if (session?.user) {
		const userRole = session.user.role

		// Check if user is trying to access unauthorized routes
		if (userRole === 'TEACHER' && parentRoutes.some(route => pathname.startsWith(route))) {
			return new Response('Forbidden', { status: 403 })
		}
		
		if (userRole === 'PARENT' && teacherRoutes.some(route => pathname.startsWith(route))) {
			return new Response('Forbidden', { status: 403 })
		}
		
		if (userRole !== 'ADMIN' && adminRoutes.some(route => pathname.startsWith(route))) {
			return new Response('Forbidden', { status: 403 })
		}
	} else if ([...teacherRoutes, ...parentRoutes, ...adminRoutes].some(route => pathname.startsWith(route))) {
		// Redirect to sign in if accessing protected routes without authentication
		return new Response(null, {
			status: 302,
			headers: { location: '/auth/signin' }
		})
	}

	return resolve(event)
}

export const handle = sequence(authHandle, authorizationHandle)