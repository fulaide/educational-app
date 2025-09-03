import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@educational-app/database'
import { randomBytes } from 'crypto'

const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key'

// Create prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
	default: async ({ request, cookies, getClientAddress }) => {
		const data = await request.formData()
		const email = data.get('email') as string
		const password = data.get('password') as string
		const callbackUrl = data.get('callbackUrl') as string || '/dashboard'

		if (!email || !password) {
			return fail(400, { error: 'Please fill in all fields' })
		}

		// Mock authentication for development (same as in hooks.server.ts)
		if (email === 'teacher@test.com' && password === 'password123') {
			try {
				// Generate unique token ID for JWT and database session tracking
				const tokenId = randomBytes(32).toString('hex')
				const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

				// Create JWT session token with tokenId
				const userData = {
					id: 'mock-teacher-id',
					email: 'teacher@test.com',
					name: 'Test Teacher',
					role: 'TEACHER',
					organizationId: 'mock-org-id',
					jti: tokenId // JWT ID claim for token tracking
				}
				
				const token = jwt.sign(userData, JWT_SECRET, { 
					expiresIn: '24h',
					jwtid: tokenId
				})
				
				// Create database session record
				await prisma.userSession.create({
					data: {
						userId: userData.id,
						tokenId: tokenId,
						deviceInfo: request.headers.get('user-agent') || null,
						ipAddress: getClientAddress(),
						userAgent: request.headers.get('user-agent') || null,
						expiresAt: expiresAt
					}
				})
				
				// Set session cookie
				cookies.set('session', token, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 24 * 60 * 60 // 24 hours in seconds
				})
				
				console.log('[SIGNIN] Session created for:', email, 'with token ID:', tokenId)
				// Redirect to callback URL
				throw redirect(302, callbackUrl)
			} catch (error) {
				console.error('[SIGNIN] Error creating session:', error)
				return fail(500, { error: 'Failed to create session. Please try again.' })
			}
		} else {
			return fail(401, { error: 'Invalid credentials. Please try again.' })
		}
	}
}