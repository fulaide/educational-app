import { redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Get user from auth middleware
	if (!locals.user || locals.user.role !== 'PARENT') {
		throw redirect(302, '/auth/signin');
	}

	try {
		// Get parent's linked children
		const parent = await prisma.user.findUnique({
			where: { id: locals.user.id },
			include: {
				parentChildren: {
					include: {
						child: {
							select: {
								id: true,
								name: true,
								uuid: true,
								grade: true,
								isActive: true,
								createdAt: true,
								// TODO: Add progress tracking data
							}
						}
					}
				}
			}
		});

		const linkedChildren = parent?.parentChildren?.map(pc => pc.child) || [];

		return {
			user: locals.user,
			linkedChildren,
			hasChildren: linkedChildren.length > 0
		};

	} catch (error) {
		console.error('[PARENT DASHBOARD] Database error:', error);
		return {
			user: locals.user,
			linkedChildren: [],
			hasChildren: false,
			error: 'Unable to load dashboard data'
		};
	}
};