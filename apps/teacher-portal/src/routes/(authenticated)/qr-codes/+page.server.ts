import type { PageServerLoad, Actions } from './$types'
import { error } from '@sveltejs/kit'
import { prisma } from '@educational-app/database'
import { requireRole } from '$lib/auth/auth-helpers.server'
import { generateStudentQRCode, generateClassQRCodesAPI } from '$lib/server/api/qr-router'
import { randomBytes } from 'crypto'

function generateQRToken(): string {
	return randomBytes(32).toString('hex');
}

export const load: PageServerLoad = async ({ locals }) => {
	// Ensure user is authenticated and is a teacher
	const session = await requireRole(locals, 'TEACHER');

	try {
		// Get teacher's classes and students with their QR codes
		const teacherClasses = await prisma.class.findMany({
			where: {
				teacherId: session.user.id
			},
			include: {
				students: {
					select: {
						id: true,
						name: true,
						uuid: true,
						email: true,
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
					}
				},
				organization: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		// Get QR code analytics
		const totalStudents = teacherClasses.reduce((sum, cls) => sum + cls.students.length, 0)
		
		return {
			user: session.user,
			classes: teacherClasses,
			analytics: {
				totalStudents,
				totalClasses: teacherClasses.length,
				totalGenerated: 0, // Will be updated with actual tracking
				totalScanned: 0,
				activeQRCodes: 0
			}
		}
	} catch (err) {
		console.error('Failed to load QR codes page:', err)
		error(500, 'Failed to load data')
	}
}

export const actions: Actions = {
	generateStudentQR: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER')

		const formData = await request.formData()
		const studentId = formData.get('studentId') as string
		// Default to no expiry (10 years = effectively permanent)
		const expiresInHours = parseInt(formData.get('expiresInHours') as string) || (10 * 365 * 24)
		const size = parseInt(formData.get('size') as string) || 256

		try {
			// Get student info
			const student = await prisma.user.findUnique({
				where: { id: studentId },
				select: { id: true, name: true, uuid: true }
			});

			if (!student) {
				return {
					success: false,
					error: 'Student not found'
				};
			}

			// Invalidate any existing active QR codes for this student
			await prisma.studentQRCode.updateMany({
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

			// Generate new QR code token
			const token = generateQRToken();
			const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

			await prisma.studentQRCode.create({
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
				message: 'QR code generated successfully',
				qrCode: token, // Simple hex token for the QR code
				studentName: student.name || `Student ${student.uuid.slice(0, 8)}`,
				expiresAt: expiresAt
			}
		} catch (err) {
			console.error('QR generation failed:', err)
			return {
				success: false,
				error: 'Failed to generate QR code'
			}
		}
	},

	generateClassQR: async ({ request, locals }) => {
		const session = await requireRole(locals, 'TEACHER')

		const formData = await request.formData()
		const classId = formData.get('classId') as string
		const format = formData.get('format') as string || 'individual'
		// Default to no expiry (10 years = effectively permanent)
		const expiresInHours = parseInt(formData.get('expiresInHours') as string) || (10 * 365 * 24)
		const size = parseInt(formData.get('size') as string) || 256

		try {
			// Get class with students
			const classData = await prisma.class.findUnique({
				where: { id: classId },
				include: {
					students: {
						select: { id: true, name: true, uuid: true }
					}
				}
			});

			if (!classData) {
				return {
					success: false,
					error: 'Class not found'
				};
			}

			const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

			// Invalidate existing QR codes for all students in the class
			await prisma.studentQRCode.updateMany({
				where: {
					studentId: {
						in: classData.students.map(s => s.id)
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
			const qrCodesToCreate = classData.students.map(student => ({
				studentId: student.id,
				token: generateQRToken(),
				expiresAt: expiresAt,
				createdBy: session.user.id
			}));

			await prisma.studentQRCode.createMany({
				data: qrCodesToCreate
			});

			console.log(`Generated ${qrCodesToCreate.length} QR codes for class ${classId}`);

			return {
				success: true,
				message: `Successfully generated QR codes for ${classData.students.length} students`,
				format: format,
				studentsCount: classData.students.length
			}
		} catch (err) {
			console.error('Class QR generation failed:', err)
			return {
				success: false,
				error: 'Failed to generate class QR codes'
			}
		}
	}
}