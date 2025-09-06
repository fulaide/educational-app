import { redirect, error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { prisma } from '@educational-app/database'

export const load: PageServerLoad = async ({ params, url, cookies }) => {
	const { token } = params
	
	if (!token) {
		throw error(400, 'Verification token is required')
	}

	try {
		// Find the verification record
		const verification = await prisma.emailVerification.findUnique({
			where: { token },
			include: { user: true }
		})

		if (!verification) {
			return {
				success: false,
				message: 'Invalid verification link. The link may have expired or been used already.'
			}
		}

		// Check if already verified
		if (verification.verified) {
			return {
				success: true,
				message: 'Your email has already been verified! You can now access all features.',
				alreadyVerified: true
			}
		}

		// Check if expired
		if (verification.expiresAt < new Date()) {
			return {
				success: false,
				message: 'This verification link has expired. Please request a new verification email.',
				expired: true,
				email: verification.email
			}
		}

		// Verify the email
		await prisma.$transaction(async (tx) => {
			// Mark verification as completed
			await tx.emailVerification.update({
				where: { id: verification.id },
				data: { verified: true }
			})

			// Update user's email verification status
			await tx.user.update({
				where: { id: verification.userId },
				data: { 
					isVerified: true,
					emailVerified: new Date() // Auth.js compatibility
				}
			})
		})

		console.log('[EMAIL_VERIFY] Email verified successfully for user:', verification.email)

		return {
			success: true,
			message: 'Email verified successfully! You now have full access to your account.',
			email: verification.email
		}

	} catch (err) {
		console.error('[EMAIL_VERIFY] Verification error:', err)
		throw error(500, 'An error occurred while verifying your email. Please try again.')
	}
}