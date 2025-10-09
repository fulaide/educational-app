import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export interface AuthUser {
	id: string;
	email?: string;
	name?: string;
	role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
	organizationId?: string;
	uuid?: string;
	grade?: number;
}

export interface AuthSession {
	user: AuthUser;
	expires: string;
}

export async function requireAuth(locals: RequestEvent['locals']): Promise<AuthSession> {
	// Check if user is already set in locals (from hooks)
	if (!locals.user) {
		throw redirect(303, '/auth/signin');
	}

	return {
		user: locals.user,
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h from now
	};
}

export async function requireRole(locals: RequestEvent['locals'], requiredRole: AuthUser['role']): Promise<AuthSession> {
	const session = await requireAuth(locals);
	
	if (session.user.role !== requiredRole) {
		throw redirect(303, '/auth/signin');
	}
	
	return session;
}

export async function getOptionalAuth(locals: RequestEvent['locals']): Promise<AuthSession | null> {
	if (!locals.user) {
		return null;
	}

	return {
		user: locals.user,
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h from now
	};
}
