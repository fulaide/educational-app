import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const load = (async ({ locals, cookies }) => {
	// Check if user is logged in as a student
	const sessionToken = cookies.get('session');
	
	if (!sessionToken) {
		throw redirect(303, '/auth/student');
	}

	try {
		const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key';
		const decoded = jwt.verify(sessionToken, JWT_SECRET) as any;
		
		if (decoded.role !== 'STUDENT') {
			throw redirect(303, '/auth/student');
		}

		// TODO: Load student's learning progress, assignments, etc.
		// For now, just return the student data
		return {
			student: {
				id: decoded.id,
				name: decoded.name,
				uuid: decoded.uuid,
				grade: decoded.grade,
				organizationId: decoded.organizationId
			}
		};
	} catch (error) {
		console.error('Invalid session token:', error);
		// Clear invalid session
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/auth/student');
	}
}) satisfies PageServerLoad;
