import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import type { StudentTokenPayload } from '@educational-app/auth/client'
import { isTokenExpired } from '@educational-app/auth/client'

const STORAGE_KEY = 'student-session'

export interface StudentSession {
	token: string
	user: {
		id: string
		uuid: string
		name: string | null
		grade: number | null
		organizationId: string | null
	}
	expiresAt: number
}

/**
 * Client-side authentication service using Svelte 5 runes
 * Manages student session state and authentication flows
 */
class AuthService {
	session = $state<StudentSession | null>(null)
	isLoading = $state(true)
	isOnline = $state(browser ? navigator.onLine : true)
	error = $state<string | null>(null)

	constructor() {
		if (browser) {
			// Load session from localStorage on init
			this.loadSession()

			// Listen for online/offline events
			window.addEventListener('online', () => {
				this.isOnline = true
			})
			window.addEventListener('offline', () => {
				this.isOnline = false
			})

			// Listen for storage events (logout from another tab)
			window.addEventListener('storage', (e) => {
				if (e.key === STORAGE_KEY) {
					this.loadSession()
				}
			})
		}
	}

	/**
	 * Load session from localStorage
	 */
	loadSession() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (!stored) {
				this.session = null
				this.isLoading = false
				return
			}

			const session: StudentSession = JSON.parse(stored)

			// Check if token is expired
			if (isTokenExpired(session.token)) {
				this.logout()
				return
			}

			this.session = session
		} catch (error) {
			console.error('Failed to load session:', error)
			this.session = null
		} finally {
			this.isLoading = false
		}
	}

	/**
	 * Store session in localStorage
	 */
	private storeSession(session: StudentSession) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
			this.session = session
		} catch (error) {
			console.error('Failed to store session:', error)
			throw new Error('Failed to save session')
		}
	}

	/**
	 * Authenticate with QR code data
	 */
	async authenticateWithQR(qrData: {
		uuid: string
		studentName?: string
		organizationId: string
		nonce: string
		signature: string
		version: number
		expires: number
	}): Promise<{ success: boolean; error?: string }> {
		this.error = null

		try {
			// Call server endpoint
			const response = await fetch('/scan-qr', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'qr',
					qrData
				})
			})

			const result = await response.json()

			if (!response.ok || !result.success) {
				this.error = result.message || 'Authentication failed'
				return { success: false, error: this.error }
			}

			// Store session
			this.storeSession({
				token: result.token,
				user: result.user,
				expiresAt: result.expiresAt
			})

			return { success: true }
		} catch (error) {
			console.error('QR authentication error:', error)
			this.error = 'Network error. Please try again.'
			return { success: false, error: this.error }
		}
	}

	/**
	 * Authenticate with manual UUID entry
	 */
	async authenticateWithUUID(uuid: string): Promise<{ success: boolean; error?: string }> {
		this.error = null

		try {
			// Call server endpoint
			const response = await fetch('/scan-qr', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'uuid',
					uuid: uuid.trim()
				})
			})

			const result = await response.json()

			if (!response.ok || !result.success) {
				this.error = result.message || 'Authentication failed'
				return { success: false, error: this.error }
			}

			// Store session
			this.storeSession({
				token: result.token,
				user: result.user,
				expiresAt: result.expiresAt
			})

			return { success: true }
		} catch (error) {
			console.error('UUID authentication error:', error)
			this.error = 'Network error. Please try again.'
			return { success: false, error: this.error }
		}
	}

	/**
	 * Authenticate with database token (from teacher portal QR codes)
	 */
	async authenticateWithToken(token: string): Promise<{ success: boolean; error?: string }> {
		this.error = null

		try {
			// Call server endpoint
			const response = await fetch('/scan-qr', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'token',
					token: token.trim()
				})
			})

			const result = await response.json()

			if (!response.ok || !result.success) {
				this.error = result.message || 'Authentication failed'
				return { success: false, error: this.error }
			}

			// Store session
			this.storeSession({
				token: result.token,
				user: result.user,
				expiresAt: result.expiresAt
			})

			return { success: true }
		} catch (error) {
			console.error('Token authentication error:', error)
			this.error = 'Network error. Please try again.'
			return { success: false, error: this.error }
		}
	}

	/**
	 * Logout and clear session
	 */
	async logout() {
		try {
			// Clear server-side cookie
			await fetch('/api/logout', { method: 'POST' })

			// Clear client-side storage
			localStorage.removeItem(STORAGE_KEY)
			this.session = null
			this.error = null

			// Redirect to login page
			if (browser) {
				goto('/scan-qr')
			}
		} catch (error) {
			console.error('Logout error:', error)
		}
	}

	/**
	 * Check if user is authenticated
	 */
	get isAuthenticated(): boolean {
		return this.session !== null && !isTokenExpired(this.session.token)
	}

	/**
	 * Get current user
	 */
	get currentUser() {
		return this.session?.user || null
	}

	/**
	 * Get auth token for API requests
	 */
	get token(): string | null {
		return this.session?.token || null
	}

	/**
	 * Get remaining session time
	 */
	get sessionTimeRemaining(): {
		expired: boolean
		days: number
		hours: number
		minutes: number
	} {
		if (!this.session) {
			return { expired: true, days: 0, hours: 0, minutes: 0 }
		}

		const now = Date.now()
		const remaining = this.session.expiresAt - now

		if (remaining <= 0) {
			return { expired: true, days: 0, hours: 0, minutes: 0 }
		}

		const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
		const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

		return { expired: false, days, hours, minutes }
	}
}

// Create singleton instance
export const authService = new AuthService()
