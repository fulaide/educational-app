import { StudentQRData, validateQRData } from './qr-generator'

export interface OfflineQRCache {
	organizationId: string
	validStudents: Array<{
		uuid: string
		name: string
		className?: string
		active: boolean
	}>
	trustedSignatures: string[] // Pre-approved signature patterns
	lastUpdated: number
	expiresAt: number
}

export interface OfflineValidationResult {
	isValid: boolean
	studentData?: {
		uuid: string
		name: string
		className?: string
	}
	error?: string
	offline: boolean
	cached: boolean
}

/**
 * Offline QR validation service for situations with limited internet connectivity
 */
export class OfflineQRService {
	private cache: Map<string, OfflineQRCache> = new Map()
	private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
	private readonly STORAGE_KEY = 'qr_offline_cache'

	constructor() {
		this.loadFromLocalStorage()
	}

	/**
	 * Update offline cache with organization data
	 */
	updateCache(organizationId: string, students: Array<{
		uuid: string
		name: string
		className?: string
		active: boolean
	}>): void {
		const cache: OfflineQRCache = {
			organizationId,
			validStudents: students,
			trustedSignatures: [], // Would be populated with known good signatures
			lastUpdated: Date.now(),
			expiresAt: Date.now() + this.CACHE_DURATION
		}

		this.cache.set(organizationId, cache)
		this.saveToLocalStorage()
	}

	/**
	 * Validate QR code offline using cached data
	 */
	validateOffline(qrDataString: string, allowExpiredCache: boolean = false): OfflineValidationResult {
		try {
			// First, try standard validation (includes signature check)
			const standardResult = validateQRData(qrDataString)
			
			if (!standardResult.isValid || !standardResult.data) {
				return {
					isValid: false,
					error: standardResult.error || 'Invalid QR code',
					offline: true,
					cached: false
				}
			}

			const qrData = standardResult.data
			const cache = this.cache.get(qrData.organizationId)

			// Check if we have cached data for this organization
			if (!cache) {
				return {
					isValid: false,
					error: 'No offline data available for this organization',
					offline: true,
					cached: false
				}
			}

			// Check if cache is expired
			if (!allowExpiredCache && Date.now() > cache.expiresAt) {
				return {
					isValid: false,
					error: 'Offline data is outdated. Please connect to internet to refresh.',
					offline: true,
					cached: true
				}
			}

			// Check if student is in the valid list
			const student = cache.validStudents.find(s => s.uuid === qrData.uuid)
			if (!student) {
				return {
					isValid: false,
					error: 'Student not found in offline database',
					offline: true,
					cached: true
				}
			}

			// Check if student is active
			if (!student.active) {
				return {
					isValid: false,
					error: 'Student account is inactive',
					offline: true,
					cached: true
				}
			}

			// Additional offline-specific validations
			if (this.isQRTooOld(qrData)) {
				return {
					isValid: false,
					error: 'QR code is too old for offline validation',
					offline: true,
					cached: true
				}
			}

			return {
				isValid: true,
				studentData: {
					uuid: student.uuid,
					name: student.name,
					className: student.className
				},
				offline: true,
				cached: true
			}

		} catch (error) {
			return {
				isValid: false,
				error: 'Failed to validate QR code offline',
				offline: true,
				cached: false
			}
		}
	}

	/**
	 * Check if device is online
	 */
	isOnline(): boolean {
		return typeof navigator !== 'undefined' && navigator.onLine
	}

	/**
	 * Hybrid validation - try online first, fallback to offline
	 */
	async validateHybrid(qrDataString: string, onlineValidator?: (data: string) => Promise<any>): Promise<OfflineValidationResult> {
		// Try online validation first if available
		if (this.isOnline() && onlineValidator) {
			try {
				const onlineResult = await onlineValidator(qrDataString)
				if (onlineResult.isValid) {
					return {
						...onlineResult,
						offline: false,
						cached: false
					}
				}
			} catch (error) {
				console.warn('Online validation failed, falling back to offline:', error)
			}
		}

		// Fallback to offline validation
		return this.validateOffline(qrDataString, this.isOnline())
	}

	/**
	 * Get cache status for an organization
	 */
	getCacheStatus(organizationId: string): {
		exists: boolean
		lastUpdated?: number
		expiresAt?: number
		studentCount?: number
		isExpired?: boolean
	} {
		const cache = this.cache.get(organizationId)
		
		if (!cache) {
			return { exists: false }
		}

		return {
			exists: true,
			lastUpdated: cache.lastUpdated,
			expiresAt: cache.expiresAt,
			studentCount: cache.validStudents.length,
			isExpired: Date.now() > cache.expiresAt
		}
	}

	/**
	 * Clear expired caches
	 */
	clearExpiredCaches(): number {
		const now = Date.now()
		let cleared = 0

		for (const [orgId, cache] of this.cache) {
			if (now > cache.expiresAt) {
				this.cache.delete(orgId)
				cleared++
			}
		}

		if (cleared > 0) {
			this.saveToLocalStorage()
		}

		return cleared
	}

	/**
	 * Get all cached organizations
	 */
	getCachedOrganizations(): Array<{
		organizationId: string
		studentCount: number
		lastUpdated: number
		expiresAt: number
		isExpired: boolean
	}> {
		return Array.from(this.cache.entries()).map(([orgId, cache]) => ({
			organizationId: orgId,
			studentCount: cache.validStudents.length,
			lastUpdated: cache.lastUpdated,
			expiresAt: cache.expiresAt,
			isExpired: Date.now() > cache.expiresAt
		}))
	}

	/**
	 * Force refresh cache from server
	 */
	async refreshCache(organizationId: string, fetchFunction: () => Promise<any[]>): Promise<boolean> {
		try {
			const students = await fetchFunction()
			this.updateCache(organizationId, students)
			return true
		} catch (error) {
			console.error('Failed to refresh cache:', error)
			return false
		}
	}

	private isQRTooOld(qrData: StudentQRData): boolean {
		// For offline validation, we're more strict about QR age
		const maxOfflineAge = 2 * 60 * 60 * 1000 // 2 hours
		const qrAge = Date.now() - (qrData.expires - 24 * 60 * 60 * 1000) // Approximate generation time
		return qrAge > maxOfflineAge
	}

	private saveToLocalStorage(): void {
		if (typeof localStorage !== 'undefined') {
			try {
				const cacheData = Object.fromEntries(this.cache)
				localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData))
			} catch (error) {
				console.warn('Failed to save offline cache to localStorage:', error)
			}
		}
	}

	private loadFromLocalStorage(): void {
		if (typeof localStorage !== 'undefined') {
			try {
				const stored = localStorage.getItem(this.STORAGE_KEY)
				if (stored) {
					const cacheData = JSON.parse(stored)
					this.cache = new Map(Object.entries(cacheData))
					
					// Clean expired caches on load
					this.clearExpiredCaches()
				}
			} catch (error) {
				console.warn('Failed to load offline cache from localStorage:', error)
			}
		}
	}

	/**
	 * Export cache for debugging
	 */
	exportCache(): string {
		return JSON.stringify(Object.fromEntries(this.cache), null, 2)
	}

	/**
	 * Get cache size for monitoring
	 */
	getCacheSize(): {
		organizations: number
		totalStudents: number
		memoryUsage: number
	} {
		const totalStudents = Array.from(this.cache.values())
			.reduce((sum, cache) => sum + cache.validStudents.length, 0)
		
		const memoryUsage = JSON.stringify(Object.fromEntries(this.cache)).length

		return {
			organizations: this.cache.size,
			totalStudents,
			memoryUsage
		}
	}
}

// Global offline service instance
export const offlineQRService = new OfflineQRService()

/**
 * Service Worker utilities for offline QR validation
 */
export const OfflineQRWorkerUtils = {
	/**
	 * Register service worker for offline capabilities
	 */
	async registerServiceWorker(): Promise<boolean> {
		if ('serviceWorker' in navigator) {
			try {
				await navigator.serviceWorker.register('/qr-offline-sw.js')
				return true
			} catch (error) {
				console.error('Service worker registration failed:', error)
				return false
			}
		}
		return false
	},

	/**
	 * Check if app is running in standalone mode (PWA)
	 */
	isStandalone(): boolean {
		return window.matchMedia('(display-mode: standalone)').matches ||
			   (window.navigator as any).standalone === true
	},

	/**
	 * Show offline status to user
	 */
	createOfflineIndicator(): HTMLElement {
		const indicator = document.createElement('div')
		indicator.className = 'offline-indicator'
		indicator.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background: #f59e0b;
			color: white;
			padding: 8px;
			text-align: center;
			font-size: 14px;
			z-index: 9999;
			display: none;
		`
		indicator.textContent = '⚠️ Offline mode - Limited functionality available'
		
		// Show/hide based on connection status
		const updateStatus = () => {
			indicator.style.display = navigator.onLine ? 'none' : 'block'
		}
		
		window.addEventListener('online', updateStatus)
		window.addEventListener('offline', updateStatus)
		updateStatus()
		
		return indicator
	}
}