import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { PrismaClient } from '@educational-app/database'
import jwt from 'jsonwebtoken'

// Create prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = cookies.get('session')
	
	if (sessionToken) {
		try {
			const JWT_SECRET = process.env.AUTH_SECRET || 'dev-secret-key'
			const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
			
			// Delete session from database
			if (decoded.jti) {
				await prisma.userSession.deleteMany({
					where: { tokenId: decoded.jti }
				})
				console.log('[SIGNOUT] Database session deleted for token:', decoded.jti)
			}
		} catch (error) {
			console.log('[SIGNOUT] Error deleting session from database:', error)
		}
	}
	
	// Clear the session cookie
	cookies.delete('session', { path: '/' })
	
	console.log('[SIGNOUT] Session cleared, redirecting to signin')
	
	// Redirect to signin page
	throw redirect(302, '/auth/signin')
}