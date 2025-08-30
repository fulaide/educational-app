// Main auth package exports
export * from './qr-generator'

// Types
export interface AuthUser {
	id: string
	email?: string
	name?: string
	role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN'
	organizationId?: string
	uuid?: string
	grade?: number
}

export interface AuthSession {
	user: AuthUser
	expires: string
}

// Constants
export const AUTH_PROVIDERS = {
	TEACHER: 'teacher-login',
	PARENT: 'parent-login',
	STUDENT: 'student-login'
} as const

export const ROLE_PERMISSIONS = {
	STUDENT: ['read:own-progress', 'write:own-activities'],
	TEACHER: ['read:class-data', 'write:assessments', 'manage:students'],
	PARENT: ['read:child-progress', 'communicate:teachers'],
	ADMIN: ['manage:all', 'system:admin']
} as const

// Utility functions
export function hasPermission(
	userRole: string,
	requiredPermission: string
): boolean {
	const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]
	return rolePermissions?.includes(requiredPermission as any) || false
}

export function isValidRole(role: string): role is keyof typeof ROLE_PERMISSIONS {
	return role in ROLE_PERMISSIONS
}