import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { prisma } from '@educational-app/database'
import { EmailService, getPasswordResetUrl } from '@educational-app/auth'
import { randomBytes } from 'crypto'

// Rate limiting storage (in production, use Redis or database)
const resetAttempts = new Map<string, { count: number, lastAttempt: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_RESET_ATTEMPTS = 3

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const attempts = resetAttempts.get(email)
  
  if (!attempts) {
    resetAttempts.set(email, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset counter if window has passed
  if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    resetAttempts.set(email, { count: 1, lastAttempt: now })
    return true
  }
  
  // Check if limit exceeded
  if (attempts.count >= MAX_RESET_ATTEMPTS) {
    return false
  }
  
  // Increment counter
  attempts.count += 1
  attempts.lastAttempt = now
  
  return true
}

export const actions: Actions = {
  default: async ({ request, getClientAddress, url }) => {
    const data = await request.formData()
    const email = data.get('email') as string

    if (!email) {
      return fail(400, { error: 'Email address is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return fail(400, { error: 'Please enter a valid email address' })
    }

    // Check rate limit
    if (!checkRateLimit(email)) {
      console.log(`[FORGOT-PASSWORD] Rate limit exceeded for email: ${email}`)
      return fail(429, { 
        error: 'Too many password reset attempts. Please try again in an hour.' 
      })
    }

    try {
      // Look for existing user in database
      const user = await prisma.user.findUnique({
        where: { email: email }
      })

      // If user exists, send reset email
      if (user) {
        // Generate secure reset token
        const resetToken = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry

        // Create password reset token record
        await prisma.passwordReset.create({
          data: {
            userId: user.id,
            token: resetToken,
            expiresAt: expiresAt
          }
        })

        // Send password reset email with dynamic URL
        const resetUrl = getPasswordResetUrl({ url }, resetToken)
        const emailResult = await EmailService.sendPasswordReset(email, resetToken, resetUrl)
        
        if (emailResult.success) {
          console.log(`[FORGOT-PASSWORD] Password reset email sent to: ${email} (MessageID: ${emailResult.messageId})`)
        } else {
          console.error(`[FORGOT-PASSWORD] Failed to send email to: ${email} - ${emailResult.error}`)
          
          // Fallback: Log reset link to console for development
          console.log(`[FORGOT-PASSWORD] Email failed, reset link: ${resetUrl}`)
        }
      } else {
        console.log(`[FORGOT-PASSWORD] Password reset requested for non-existent email: ${email}`)
        // Don't reveal that user doesn't exist - still proceed as if successful for security
      }

      // Always return success to prevent user enumeration
      // (Same response whether email exists or not)
      console.log(`[FORGOT-PASSWORD] Password reset process completed for: ${email} from IP: ${getClientAddress()}`)
      
      return { success: true }
    } catch (error) {
      console.error('[FORGOT-PASSWORD] Error processing reset request:', error)
      return fail(500, { error: 'Something went wrong. Please try again later.' })
    }
  }
}