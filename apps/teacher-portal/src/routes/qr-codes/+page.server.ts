import type { PageServerLoad, Actions } from './$types'
import { PrismaClient } from '@educational-app/database'
import { generateStudentQRCode, generateClassQRCodesAPI } from '$lib/server/api/qr-router'
import { error, redirect } from '@sveltejs/kit'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth()
	
	if (!session?.user) {
		redirect(302, '/auth/signin')
	}

	if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
		error(403, 'Access denied. Teachers only.')
	}

	try {
		// Get teacher's classes and students
		const teacherClasses = await prisma.class.findMany({
			where: {
				teachers: {
					some: {
						id: session.user.id
					}
				}
			},
			include: {
				students: {
					select: {
						id: true,
						name: true,
						uuid: true,
						email: true
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
		const session = await locals.auth()
		if (!session?.user) {
			error(401, 'Not authenticated')
		}

		const formData = await request.formData()
		const studentId = formData.get('studentId') as string
		const expiresInHours = parseInt(formData.get('expiresInHours') as string) || 24
		const size = parseInt(formData.get('size') as string) || 256

		try {
			// Mock QR generation for now
			return {
				success: true,
				qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
				studentName: 'Mock Student',
				expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
			}
		} catch (err) {
			console.error('QR generation failed:', err)
			error(500, 'Failed to generate QR code')
		}
	},

	generateClassQR: async ({ request, locals }) => {
		const session = await locals.auth()
		if (!session?.user) {
			error(401, 'Not authenticated')
		}

		const formData = await request.formData()
		const classId = formData.get('classId') as string
		const format = formData.get('format') as string || 'individual'
		const expiresInHours = parseInt(formData.get('expiresInHours') as string) || 24
		const size = parseInt(formData.get('size') as string) || 256

		try {
			// Mock class QR generation for now
			return {
				success: true,
				qrCodes: [
					{
						studentId: '1',
						studentName: 'Max Mustermann',
						qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
						expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
					}
				]
			}
		} catch (err) {
			console.error('Class QR generation failed:', err)
			error(500, 'Failed to generate class QR codes')
		}
	}
}