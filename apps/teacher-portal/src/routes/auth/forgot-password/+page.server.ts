import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { PrismaClient } from '@educational-app/database'
import { randomBytes } from 'crypto'

// Create prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
  default: async ({ request, getClientAddress }) => {
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
      // For development, we'll only handle the test teacher email
      // In production, this would check against real user database
      if (email === 'teacher@test.com') {
        // Generate secure reset token
        const resetToken = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiry

        // Create password reset record
        await prisma.passwordReset.create({
          data: {
            userId: 'mock-teacher-id',
            token: resetToken,
            expiresAt: expiresAt
          }
        })

        // Log the reset token for development (in production, send email)
        console.log(`[FORGOT-PASSWORD] Reset token for ${email}: http://localhost:5174/auth/reset-password/${resetToken}`)
        
        // TODO: Send actual email in production
        // await sendPasswordResetEmail(email, resetToken)
      }

      // Always return success to prevent user enumeration
      // (Same response whether email exists or not)
      console.log(`[FORGOT-PASSWORD] Password reset requested for: ${email} from IP: ${getClientAddress()}`)
      
      return { success: true }
    } catch (error) {
      console.error('[FORGOT-PASSWORD] Error processing reset request:', error)
      return fail(500, { error: 'Something went wrong. Please try again later.' })
    }
  }
}