/**
 * URL utility functions for dynamic URL generation in development and production
 */

export interface UrlContext {
	url: URL
	request?: Request
}

/**
 * Generates a base URL dynamically based on the current request context
 * Works in both development (with dynamic ports) and production
 */
export function getBaseUrl(context: UrlContext): string {
	const { url } = context
	
	// In development, use the current request's host and protocol
	// In production, this will be the production domain
	const protocol = process.env.NODE_ENV === 'production' ? 'https' : url.protocol
	const host = url.host
	
	return `${protocol}//${host}`
}

/**
 * Generates a full URL for authentication routes
 */
export function getAuthUrl(context: UrlContext, path: string): string {
	const baseUrl = getBaseUrl(context)
	// Ensure path starts with /
	const cleanPath = path.startsWith('/') ? path : `/${path}`
	return `${baseUrl}${cleanPath}`
}

/**
 * Generates a password reset URL
 */
export function getPasswordResetUrl(context: UrlContext, token: string): string {
	return getAuthUrl(context, `/auth/reset-password/${token}`)
}

/**
 * Generates an email verification URL
 */
export function getEmailVerificationUrl(context: UrlContext, token: string): string {
	return getAuthUrl(context, `/auth/verify-email/${token}`)
}

/**
 * Gets the current environment info for logging
 */
export function getEnvironmentInfo(context: UrlContext): {
	protocol: string
	host: string
	port: string | null
	isDevelopment: boolean
} {
	const { url } = context
	const isDevelopment = process.env.NODE_ENV !== 'production'
	
	return {
		protocol: url.protocol.replace(':', ''),
		host: url.hostname,
		port: url.port,
		isDevelopment
	}
}