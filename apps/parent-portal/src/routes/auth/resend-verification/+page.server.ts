import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { prisma } from '@educational-app/database'
import { EmailService, getEmailVerificationUrl } from '@educational-app/auth'
import { randomBytes } from 'crypto'

export const load: PageServerLoad = async ({ url }) => {
	const email = url.searchParams.get('email')
	
	return {
		email: email || ''
	}
}

export const actions: Actions = {
	default: async ({ request, url }) => {
		const data = await request.formData()
		const email = (data.get('email') as string)?.toLowerCase().trim()

		if (!email) {
			return fail(400, { error: 'Email is required', email })
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Please enter a valid email address', email })
		}

		try {
			// Check if user exists
			const user = await prisma.user.findUnique({
				where: { email },
				select: { id: true, email: true, isVerified: true, role: true }
			})

			if (!user) {
				return fail(400, { 
					error: 'No account found with this email address. Please register first.', 
					email 
				})
			}

			if (user.isVerified) {
				return fail(400, { 
					error: 'This email is already verified. You can sign in normally.', 
					email 
				})
			}

			// Check for existing unexpired verification
			const existingVerification = await prisma.emailVerification.findFirst({
				where: {
					userId: user.id,
					verified: false,
					expiresAt: { gt: new Date() }
				}
			})

			if (existingVerification) {
				// Delete the existing one and create a new one for better UX
				await prisma.emailVerification.delete({
					where: { id: existingVerification.id }
				})
			}

			// Generate new verification token
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

			const emailResult = await EmailService.sendParentEmailVerification(
				email, 
				verificationToken, 
				verificationUrl
			)
			
			// Log verification URL for development
			if (process.env.NODE_ENV !== 'production') {
				console.log('[RESEND_VERIFICATION] Verification URL:', verificationUrl)
			}

			if (!emailResult.success) {
				console.error('[RESEND_VERIFICATION] Failed to send email:', emailResult.error)
				
				// In development mode, show helpful message about email restrictions
				if (process.env.NODE_ENV !== 'production') {
					console.log('[RESEND_VERIFICATION] Development mode: Email would be sent to:', email)
					console.log('[RESEND_VERIFICATION] In development, emails can only be sent to lars.vorreiter@me.com due to Resend API restrictions')
					
					// Still return success in development since the token was created
					return {
						success: true,
						message: `Verification email prepared for ${email}! In development mode, check the console logs for the verification link.`,
						email,
						isDevelopment: true
					}
				}
				
				return fail(500, { 
					error: 'Failed to send verification email. Please try again later.', 
					email 
				})
			}

			console.log('[RESEND_VERIFICATION] Verification email sent to:', email)

			return {
				success: true,
				message: 'Verification email sent! Please check your inbox and spam folder.',
				email
			}

		} catch (error) {
			console.error('[RESEND_VERIFICATION] Error:', error)
			return fail(500, { 
				error: 'Something went wrong. Please try again later.', 
				email 
			})
		}
	}
}