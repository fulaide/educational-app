import type { PageServerLoad } from './$types'
import { prisma } from '@educational-app/database'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	
	// If user is authenticated, get additional verification data
	let emailVerificationStatus = null
	if (user?.id) {
		const dbUser = await prisma.user.findUnique({
			where: { id: user.id },
			select: {
				isVerified: true,
				emailVerified: true,
				emailVerifications: {
					where: { verified: false, expiresAt: { gt: new Date() } },
					orderBy: { createdAt: 'desc' },
					take: 1,
					select: { createdAt: true }
				}
			}
		})
		
		emailVerificationStatus = {
			isVerified: dbUser?.isVerified || false,
			emailVerified: dbUser?.emailVerified,
			hasPendingVerification: dbUser?.emailVerifications?.length > 0
		}
	}
	
	return {
		user: user || null,
		emailVerificationStatus
	}
}