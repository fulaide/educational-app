/**
 * Client-safe auth utilities (no Node.js crypto dependencies)
 */

export interface StudentTokenPayload {
	studentId: string
	uuid: string
	name: string | null
	grade: number | null
	organizationId: string | null
	role: 'STUDENT'
	iat?: number
	exp?: number
	sub?: string
}

/**
 * Check if a token is expired without verifying signature
 * Useful for offline scenarios where we want to check expiration only
 * BROWSER-SAFE: Uses only browser APIs
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
 * BROWSER-SAFE: Uses only browser APIs
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
