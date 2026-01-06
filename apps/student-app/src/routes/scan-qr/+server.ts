import { json } from '@sveltejs/kit'
import type { RequestEvent } from '@sveltejs/kit'
import { prisma } from '@educational-app/database'
import { createStudentToken, validateQRData } from '@educational-app/auth'

/**
 * Server endpoint for student authentication
 * Handles both QR code scanning and manual UUID entry
 */
export async function POST({ request, cookies }: RequestEvent) {
	try {
		const body = await request.json()
		const { type, qrData, uuid } = body

		console.log('[AUTH] Authentication request:', { type, hasQRData: !!qrData, hasUUID: !!uuid })

		let student: any = null

		if (type === 'qr') {
			// Validate QR code signature
			const validation = validateQRData(JSON.stringify(qrData))

			if (!validation.isValid) {
				return json(
					{
						success: false,
						message: validation.error || 'Invalid QR code'
					},
					{ status: 400 }
				)
			}

			// Look up student by UUID from QR data
			student = await prisma.user.findUnique({
				where: {
					uuid: validation.data!.uuid
				},
				include: {
					organization: true
				}
			})

			// Verify it's a student account
			if (student && student.role !== 'STUDENT') {
				student = null
			}
		} else if (type === 'uuid') {
			// Validate UUID format (both full UUIDs and short 8-character codes)
			const fullUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
			const shortCodeRegex = /^[A-Z0-9]{8}$/i

			const isFullUUID = fullUUIDRegex.test(uuid)
			const isShortCode = shortCodeRegex.test(uuid)

			console.log('[AUTH] UUID authentication attempt:', {
				uuid,
				isFullUUID,
				isShortCode,
				length: uuid.length
			})

			if (!isFullUUID && !isShortCode) {
				return json(
					{
						success: false,
						message: 'Invalid student code format. Please use either the 8-character code or full student ID.'
					},
					{ status: 400 }
				)
			}

			// Look up student by UUID (normalize case)
			const searchUUID = isFullUUID ? uuid.toLowerCase() : uuid.toUpperCase()

			student = await prisma.user.findUnique({
				where: {
					uuid: searchUUID
				},
				include: {
					organization: true
				}
			})

			console.log('[AUTH] UUID lookup result:', {
				searchUUID,
				found: !!student,
				isStudent: student?.role === 'STUDENT'
			})

			// Verify it's a student account
			if (student && student.role !== 'STUDENT') {
				student = null
			}
		} else if (type === 'token') {
			// Look up token in StudentQRCode table (from teacher portal)
			const { token: qrToken } = body

			console.log('[AUTH] Token authentication attempt:', { tokenLength: qrToken?.length })

			const qrCode = await prisma.studentQRCode.findUnique({
				where: { token: qrToken },
				include: {
					student: {
						include: {
							organization: true
						}
					}
				}
			})

			console.log('[AUTH] Token lookup result:', {
				found: !!qrCode,
				expired: qrCode ? qrCode.expiresAt < new Date() : null,
				hasStudent: !!qrCode?.student
			})

			// Check if token exists and is not expired
			if (!qrCode) {
				return json(
					{
						success: false,
						message: 'Invalid QR code. Please try scanning again.'
					},
					{ status: 404 }
				)
			}

			if (qrCode.expiresAt < new Date()) {
				return json(
					{
						success: false,
						message: 'This QR code has expired. Please generate a new one from your teacher.'
					},
					{ status: 400 }
				)
			}

			student = qrCode.student

			// Verify it's a student account
			if (student && student.role !== 'STUDENT') {
				student = null
			}
		} else {
			return json(
				{
					success: false,
					message: 'Invalid authentication type'
				},
				{ status: 400 }
			)
		}

		// Check if student exists
		if (!student) {
			return json(
				{
					success: false,
					message: 'Student not found. Please check your code and try again.'
				},
				{ status: 404 }
			)
		}

		// Check if student account is active
		if (!student.isActive) {
			return json(
				{
					success: false,
					message: 'Your account is not active. Please contact your teacher.'
				},
				{ status: 403 }
			)
		}

		// Generate JWT token
		const token = await createStudentToken({
			id: student.id,
			uuid: student.uuid!,
			name: student.name,
			grade: student.grade,
			organizationId: student.organizationId
		})

		// Create UserSession record for tracking
		const tokenId = crypto.randomUUID()
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

		await prisma.userSession.create({
			data: {
				userId: student.id,
				tokenId,
				expiresAt,
				deviceInfo: request.headers.get('user-agent') || 'Unknown',
				ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
				userAgent: request.headers.get('user-agent') || 'Unknown'
			}
		})

		// Update last login timestamp
		await prisma.user.update({
			where: { id: student.id },
			data: { lastLoginAt: new Date() }
		})

		// Set session cookie (30 days, httpOnly for security)
		cookies.set('student-session', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		})

		// Return success with token and user data
		return json({
			success: true,
			token,
			user: {
				id: student.id,
				uuid: student.uuid,
				name: student.name,
				grade: student.grade,
				organizationId: student.organizationId
			},
			expiresAt: expiresAt.getTime()
		})
	} catch (error) {
		console.error('Authentication error:', error)
		return json(
			{
				success: false,
				message: 'An error occurred during authentication. Please try again.'
			},
			{ status: 500 }
		)
	}
}
