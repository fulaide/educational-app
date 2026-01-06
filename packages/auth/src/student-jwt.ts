import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

/**
 * Student JWT token payload
 */
export interface StudentTokenPayload extends JWTPayload {
	studentId: string
	uuid: string
	name: string | null
	grade: number | null
	organizationId: string | null
	role: 'STUDENT'
}

/**
 * Create a JWT token for student authentication
 * Token expires in 30 days to support offline usage
 */
export async function createStudentToken(student: {
	id: string
	uuid: string
	name: string | null
	grade: number | null
	organizationId: string | null
}): Promise<string> {
	const secret = new TextEncoder().encode(
		process.env.JWT_SECRET || 'your-secret-key-change-in-production'
	)

	const token = await new SignJWT({
		studentId: student.id,
		uuid: student.uuid,
		name: student.name,
		grade: student.grade,
		organizationId: student.organizationId,
		role: 'STUDENT' as const
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('30d') // 30 days for offline support
		.setSubject(student.id)
		.sign(secret)

	return token
}

/**
 * Verify and decode a student JWT token
 * Returns the payload if valid, null if invalid or expired
 */
export async function verifyStudentToken(token: string): Promise<StudentTokenPayload | null> {
	try {
		const secret = new TextEncoder().encode(
			process.env.JWT_SECRET || 'your-secret-key-change-in-production'
		)

		const { payload } = await jwtVerify(token, secret)

		// Validate payload structure
		if (
			!payload.studentId ||
			!payload.uuid ||
			payload.role !== 'STUDENT' ||
			typeof payload.studentId !== 'string' ||
			typeof payload.uuid !== 'string'
		) {
			return null
		}

		return payload as StudentTokenPayload
	} catch (error) {
		// Token is invalid or expired
		console.error('JWT verification failed:', error)
		return null
	}
}

/**
 * Extract token from Authorization header
 * Supports both "Bearer <token>" and plain token formats
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
	if (!authHeader) return null

	if (authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7)
	}

	return authHeader
}

/**
 * Check if a token is expired without verifying signature
 * Useful for offline scenarios where we want to check expiration only
 */
export function isTokenExpired(token: string): boolean {
	try {
		// Decode without verification
		const parts = token.split('.')
		if (parts.length !== 3) return true

		const payload = JSON.parse(atob(parts[1]))
		const exp = payload.exp

		if (!exp) return true

		// Check if expired (exp is in seconds, Date.now() is in milliseconds)
		return Date.now() >= exp * 1000
	} catch (error) {
		return true
	}
}

/**
 * Get remaining time until token expiration
 */
export function getTokenTimeRemaining(token: string): {
	expired: boolean
	days: number
	hours: number
	minutes: number
} {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) {
			return { expired: true, days: 0, hours: 0, minutes: 0 }
		}

		const payload = JSON.parse(atob(parts[1]))
		const exp = payload.exp

		if (!exp) {
			return { expired: true, days: 0, hours: 0, minutes: 0 }
		}

		const now = Date.now()
		const expTime = exp * 1000
		const remaining = expTime - now

		if (remaining <= 0) {
			return { expired: true, days: 0, hours: 0, minutes: 0 }
		}

		const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
		const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

		return { expired: false, days, hours, minutes }
	} catch (error) {
		return { expired: true, days: 0, hours: 0, minutes: 0 }
	}
}
