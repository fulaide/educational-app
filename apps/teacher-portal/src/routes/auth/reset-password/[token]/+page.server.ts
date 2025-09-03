import { error, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { PrismaClient } from '@educational-app/database'
import bcrypt from 'bcryptjs'

// Create prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const load: PageServerLoad = async ({ params }) => {
  const { token } = params

  try {
    // Check if reset token is valid
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    })

    const isValidToken = resetRecord && 
                        !resetRecord.used && 
                        resetRecord.expiresAt > new Date()

    return {
      validToken: !!isValidToken,
      token: isValidToken ? token : null
    }
  } catch (err) {
    console.error('[RESET-PASSWORD] Error validating token:', err)
    return {
      validToken: false,
      token: null
    }
  }
}

function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required'
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  
  // Add more password strength requirements as needed
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'Password must contain uppercase, lowercase, and numeric characters'
  }
  
  return null
}

export const actions: Actions = {
  default: async ({ request, params }) => {
    const { token } = params
    const data = await request.formData()
    const password = data.get('password') as string
    const confirmPassword = data.get('confirmPassword') as string

    // Validate inputs
    if (!password || !confirmPassword) {
      return fail(400, { error: 'Please fill in all fields' })
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match' })
    }

    // Validate password strength
    const passwordError = validatePassword(password)
    if (passwordError) {
      return fail(400, { error: passwordError })
    }

    try {
      // Verify reset token is still valid
      const resetRecord = await prisma.passwordReset.findUnique({
        where: { token },
        include: { user: true }
      })

      if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
        return fail(400, { error: 'Invalid or expired reset token' })
      }

      // For development, we'll handle the mock user
      // In production, this would update the actual user's password
      if (resetRecord.userId === 'mock-teacher-id') {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)
        
        console.log(`[RESET-PASSWORD] Password updated for user: ${resetRecord.userId}`)
        console.log(`[RESET-PASSWORD] New hashed password: ${hashedPassword}`)
        
        // In production, update the user's password:
        // await prisma.user.update({
        //   where: { id: resetRecord.userId },
        //   data: { password: hashedPassword }
        // })
      }

      // Mark reset token as used
      await prisma.passwordReset.update({
        where: { token },
        data: { used: true }
      })

      console.log(`[RESET-PASSWORD] Password reset completed for token: ${token}`)

      return { success: true }
    } catch (err) {
      console.error('[RESET-PASSWORD] Error resetting password:', err)
      return fail(500, { error: 'Something went wrong. Please try again.' })
    }
  }
}