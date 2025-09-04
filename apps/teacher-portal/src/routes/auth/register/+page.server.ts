import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { prisma } from '@educational-app/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { EmailService, getEmailVerificationUrl } from '@educational-app/auth'

const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key'

export const load: PageServerLoad = async (event) => {
	// Check for existing session cookie
	const sessionToken = event.cookies.get('session')
	if (sessionToken) {
		try {
			jwt.verify(sessionToken, JWT_SECRET)
			// Already logged in, redirect to dashboard
			throw redirect(302, '/dashboard')
		} catch {
			// Invalid token, continue to registration page
		}
	}
	
	return {}
}

// Registration validation functions
function validateEmail(email: string): string | null {
	if (!email) {
		return 'Email is required'
	}
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return 'Please enter a valid email address'
	}
	
	return null
}

function validatePassword(password: string): string | null {
	if (!password) {
		return 'Password is required'
	}
	
	if (password.length < 8) {
		return 'Password must be at least 8 characters long'
	}
	
	const hasUpperCase = /[A-Z]/.test(password)
	const hasLowerCase = /[a-z]/.test(password)
	const hasNumbers = /\d/.test(password)
	
	if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
		return 'Password must contain uppercase, lowercase, and numeric characters'
	}
	
	return null
}

function validateName(name: string): string | null {
	if (!name) {
		return 'Full name is required'
	}
	
	if (name.trim().length < 2) {
		return 'Please enter your full name'
	}
	
	return null
}

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData()
		const email = (data.get('email') as string)?.toLowerCase().trim()
		const password = data.get('password') as string
		const confirmPassword = data.get('confirmPassword') as string
		const name = (data.get('name') as string)?.trim()

		// Validate inputs
		const emailError = validateEmail(email)
		if (emailError) {
			return fail(400, { error: emailError, email, name })
		}

		const nameError = validateName(name)
		if (nameError) {
			return fail(400, { error: nameError, email, name })
		}

		const passwordError = validatePassword(password)
		if (passwordError) {
			return fail(400, { error: passwordError, email, name })
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', email, name })
		}

		try {
			// Check if user already exists
			const existingUser = await prisma.user.findUnique({
				where: { email }
			})

			if (existingUser) {
				return fail(400, { 
					error: 'An account with this email already exists. Please sign in instead.', 
					email, 
					name 
				})
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 12)

			// Create user (not verified initially)
			const user = await prisma.user.create({
				data: {
					email,
					name,
					password: hashedPassword,
					role: 'TEACHER',
					isActive: true,
					isVerified: false,
					settings: {}
				}
			})

			console.log('[REGISTER] Created new teacher account:', email)

			// Generate email verification token
			const verificationToken = randomBytes(32).toString('hex')
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

			// Create verification record
			await prisma.emailVerification.create({
				data: {
					userId: user.id,
					token: verificationToken,
					email: user.email!,
					expiresAt
				}
			})

			// Send verification email with dynamic URL
			const verificationUrl = getEmailVerificationUrl({ url }, verificationToken)

			const emailResult = await EmailService.sendEmailVerification(
				email, 
				verificationToken, 
				verificationUrl
			)

			if (!emailResult.success) {
				console.error('[REGISTER] Failed to send verification email:', emailResult.error)
				// Don't fail registration, just log the error - user can resend verification later
			}

			console.log('[REGISTER] User registered, verification email sent:', email)

			// Return success with verification message (don't log them in yet)
			return {
				success: true,
				email,
				name,
				message: 'Account created successfully! Please check your email to verify your account before signing in.'
			}

		} catch (error: any) {
			// Re-throw redirect errors
			if (error?.status === 302 || error?.constructor?.name === 'Redirect') {
				throw error
			}
			
			console.error('[REGISTER] Registration error:', error)
			return fail(500, { 
				error: 'Something went wrong during registration. Please try again.', 
				email, 
				name 
			})
		}
	}
}