import { error, redirect } from '@sveltejs/kit';
import { prisma } from '@educational-app/database';
import { generateStudentQR } from '@educational-app/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || locals.user.role !== 'PARENT') {
		throw redirect(302, '/auth/signin');
	}

	const { childId } = params;
	const parentId = locals.user.id;

	try {
		// Verify parent-child relationship and get child details
		const parentChildLink = await prisma.parentChild.findFirst({
			where: {
				parentId: parentId,
				childId: childId,
				isActive: true
			},
			include: {
				child: {
					select: {
						id: true,
						name: true,
						uuid: true,
						grade: true,
						isActive: true,
						isVerified: true,
						createdAt: true,
						lastLoginAt: true,
						organization: {
							select: {
								name: true,
								type: true
							}
						}
					}
				}
			}
		});

		if (!parentChildLink) {
			throw error(404, 'Child not found or not linked to your account');
		}

		// Generate QR code for the student
		let qrCode = null;
		try {
			console.log('[CHILD MANAGE] Attempting QR generation for:', {
				uuid: parentChildLink.child.uuid,
				name: parentChildLink.child.name,
				hasOrg: !!parentChildLink.child.organization
			});
			
			if (parentChildLink.child.uuid && parentChildLink.child.organization) {
				console.log('[CHILD MANAGE] Generating QR code...');
				const qrResult = await generateStudentQR({
					uuid: parentChildLink.child.uuid,
					studentName: parentChildLink.child.name || 'Student',
					organizationId: parentChildLink.child.organization.id
				}, {
					expiresInHours: 24,
					size: 200
				});
				qrCode = {
					dataURL: qrResult.qrCodeDataURL,
					expires: new Date(qrResult.qrData.expires),
					studentCode: parentChildLink.child.uuid.substring(0, 8).toUpperCase()
				};
				console.log('[CHILD MANAGE] QR generation successful, code length:', qrResult.qrCodeDataURL.length);
			} else {
				console.log('[CHILD MANAGE] Missing UUID or organization for QR generation');
			}
		} catch (qrError) {
			console.error('[CHILD MANAGE] QR generation error:', qrError);
			// Continue without QR code if generation fails
		}

		return {
			child: parentChildLink.child,
			linkInfo: {
				linkedAt: parentChildLink.createdAt,
				isActive: parentChildLink.isActive
			},
			qrCode
		};

	} catch (err: any) {
		console.error('[CHILD MANAGE] Error loading child:', err);
		
		if (err.status) {
			throw err;
		}
		
		throw error(500, 'Failed to load child information');
	}
};