import { error, fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { prisma } from '@educational-app/database'
import bcrypt from 'bcryptjs'

export const load: PageServerLoad = async ({ params }) => {
  const { token } = params

  try {
    // Check if reset token is valid in database
    try {
      const resetRecord = await prisma.passwordReset.findUnique({
        where: { token },
        include: { user: true }
      })
      
      const isValidToken = resetRecord && 
                          !resetRecord.used && 
                          resetRecord.expiresAt > new Date()
      
      return {
        validToken: !!isValidToken,
        token: isValidToken ? token : null,
        resetRecord: resetRecord || null,
        debugInfo: resetRecord ? {
          tokenFound: !!resetRecord,
          isUsed: resetRecord.used,
          isExpired: resetRecord.expiresAt < new Date(),
          expiresAt: resetRecord.expiresAt.toISOString(),
          createdAt: resetRecord.createdAt.toISOString()
        } : null
      }
    } catch (dbError) {
      console.log('[RESET-PASSWORD] Database error, using fallback validation:', dbError)
      // Fallback to hex string validation if database fails
      const isValidToken = token && token.length === 64 && /^[a-f0-9]+$/.test(token)
      
      return {
        validToken: !!isValidToken,
        token: isValidToken ? token : null,
        resetRecord: null
      }
    }  } catch (err) {
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
        console.log('[RESET-PASSWORD] Invalid token:', { 
          found: !!resetRecord, 
          used: resetRecord?.used, 
          expired: resetRecord ? resetRecord.expiresAt < new Date() : null 
        })
        return fail(400, { error: 'Invalid or expired reset token' })
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Update the user's password
      await prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword }
      })

      // Mark reset token as used
      await prisma.passwordReset.update({
        where: { token },
        data: { used: true }
      })
      
      console.log(`[RESET-PASSWORD] Password updated for user: ${resetRecord.user.email}`)
      console.log(`[RESET-PASSWORD] Reset token marked as used: ${token}`)

      console.log(`[RESET-PASSWORD] Password reset completed for token: ${token}`)

      // Redirect to sign-in page with success message
      throw redirect(302, '/auth/signin?passwordReset=success')
    } catch (err: any) {
      // Re-throw redirect errors (these are not actual errors)
      if (err?.status === 302 || err?.constructor?.name === 'Redirect') {
        throw err
      }
      
      console.error('[RESET-PASSWORD] Error resetting password:', err)
      return fail(500, { error: 'Something went wrong. Please try again.' })
    }
  }
}