import { fail } from '@sveltejs/kit';
import { db } from '@educational-app/database';
import { randomBytes } from 'crypto';
import { requireRole } from '$lib/auth/auth-helpers.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await requireRole(locals, 'TEACHER');

	// Get all students created by this teacher or in their classes
	const students = await db.user.findMany({
		where: {
			role: 'STUDENT',
			OR: [
				{
					organizationId: session.user.organizationId
				},
				{
					studentClasses: {
						some: {
							teacherId: session.user.id
						}
					}
				}
			]
		},
		include: {
			studentQRCodes: {
				where: {
					expiresAt: {
						gt: new Date() // Only non-expired QR codes
					}
				},
				orderBy: {
					createdAt: 'desc'
				},
				take: 1 // Get the most recent active QR code
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	// Transform data for the frontend
	const studentsWithQR = students.map(student => ({
		id: student.id,
		name: student.name,
		uuid: student.uuid,
		grade: student.grade,
		currentQRCode: student.studentQRCodes[0] || null
	}));

	return {
		students: studentsWithQR
	};
};

function generateQRToken(): string {
	return randomBytes(32).toString('hex');
}

export const actions: Actions = {
	generateQR: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER');

		try {
			const formData = await request.formData();
			const studentId = formData.get('studentId') as string;

			if (!studentId) {
				return fail(400, { error: 'Student ID is required' });
			}

			// Verify the student exists and belongs to this teacher
			const student = await db.user.findFirst({
				where: {
					id: studentId,
					role: 'STUDENT',
					OR: [
						{
							organizationId: session.user.organizationId
						},
						{
							studentClasses: {
								some: {
									teacherId: session.user.id
								}
							}
						}
					]
				}
			});

			if (!student) {
				return fail(404, { error: 'Student not found' });
			}

			// Invalidate any existing active QR codes for this student
			await db.studentQRCode.updateMany({
				where: {
					studentId: studentId,
					expiresAt: {
						gt: new Date()
					}
				},
				data: {
					expiresAt: new Date() // Expire immediately
				}
			});

			// Generate new QR code
			const token = generateQRToken();
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

			const qrCode = await db.studentQRCode.create({
				data: {
					studentId: studentId,
					token: token,
					expiresAt: expiresAt,
					createdBy: session.user.id
				}
			});

			console.log(`Generated QR code for student ${studentId}, expires at ${expiresAt}`);

			return {
				success: true,
				message: 'QR code generated successfully'
			};

		} catch (error) {
			console.error('QR code generation error:', error);
			return fail(500, { error: 'Failed to generate QR code' });
		}
	},

	generateBulkQR: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER');

		try {
			const formData = await request.formData();
			const studentIds = formData.getAll('studentIds') as string[];

			if (!studentIds || studentIds.length === 0) {
				return fail(400, { error: 'No students selected' });
			}

			// Verify all students exist and belong to this teacher
			const students = await db.user.findMany({
				where: {
					id: {
						in: studentIds
					},
					role: 'STUDENT',
					OR: [
						{
							organizationId: session.user.organizationId
						},
						{
							studentClasses: {
								some: {
									teacherId: session.user.id
								}
							}
						}
					]
				}
			});

			if (students.length !== studentIds.length) {
				return fail(404, { error: 'Some students not found' });
			}

			// Invalidate existing QR codes for all selected students
			await db.studentQRCode.updateMany({
				where: {
					studentId: {
						in: studentIds
					},
					expiresAt: {
						gt: new Date()
					}
				},
				data: {
					expiresAt: new Date()
				}
			});

			// Generate new QR codes for all students
			const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
			const qrCodesToCreate = studentIds.map(studentId => ({
				studentId: studentId,
				token: generateQRToken(),
				expiresAt: expiresAt,
				createdBy: session.user.id
			}));

			await db.studentQRCode.createMany({
				data: qrCodesToCreate
			});

			console.log(`Generated ${qrCodesToCreate.length} QR codes for bulk operation`);

			return {
				success: true,
				message: `Successfully generated ${qrCodesToCreate.length} QR codes`
			};

		} catch (error) {
			console.error('Bulk QR code generation error:', error);
			return fail(500, { error: 'Failed to generate QR codes' });
		}
	}
};