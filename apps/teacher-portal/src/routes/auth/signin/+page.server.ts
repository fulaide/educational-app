import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import jwt from 'jsonwebtoken'
import { prisma } from '@educational-app/database'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

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
		callbackUrl: event.url.searchParams.get('callbackUrl') || '/dashboard',
		passwordReset: event.url.searchParams.get('passwordReset') === 'success'
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

		try {
			// Find user in database
			const user = await prisma.user.findUnique({
				where: { email },
				include: { organization: true }
			})

			if (!user) {
				return fail(400, { error: 'Invalid email or password' })
			}

			// Verify password
			const isValidPassword = await bcrypt.compare(password, user.password || '')
			if (!isValidPassword) {
				return fail(400, { error: 'Invalid email or password' })
			}

			// Check if user is active
			if (!user.isActive) {
				return fail(400, { error: 'Account is deactivated. Please contact support.' })
			}

			// Check if email is verified
			if (!user.isVerified) {
				return fail(400, { 
					error: 'Please verify your email address before signing in.', 
					email: user.email,
					needsVerification: true
				})
			}
			// Generate unique token ID for JWT session tracking
			const tokenId = randomBytes(32).toString('hex')

			// Create JWT session token with user data
			const userData = {
				id: user.id,
				email: user.email!,
				name: user.name,
				role: user.role,
				organizationId: user.organizationId
			}
			
			const token = jwt.sign(userData, JWT_SECRET, { 
				expiresIn: '24h',
				jwtid: tokenId
			})
			
			// Create database session record
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
			await prisma.userSession.create({
				data: {
					userId: userData.id,
					tokenId: tokenId,
					deviceInfo: request.headers.get('user-agent') || null,
					ipAddress: '::1', // For local development
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
			
			// Update user last login time
			await prisma.user.update({
				where: { id: user.id },
				data: { lastLoginAt: new Date() }
			})
			
			// Redirect to callback URL
			throw redirect(302, callbackUrl)
		} catch (error: any) {
			// Re-throw redirect errors (these are not actual errors)
			if (error?.status === 302 || error?.constructor?.name === 'Redirect') {
				throw error
			}
			console.error('[SIGNIN] Database error:', error)
			return fail(500, { error: 'Something went wrong. Please try again.' })
		}
	}
}