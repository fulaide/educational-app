import QRCode from 'qrcode'
import { v4 as uuid } from 'uuid'
import { createHash, randomBytes } from 'crypto'

export interface StudentQRData {
	uuid: string
	studentName: string
	className?: string
	organizationId: string
	expires: number // Unix timestamp
	nonce: string // Random nonce for security
	signature: string // HMAC signature for validation
	version: number // QR code version for future compatibility
}

export interface QRGenerationOptions {
	expiresInHours?: number
	size?: number
	margin?: number
	color?: {
		dark?: string
		light?: string
	}
	secretKey?: string // Optional secret key for HMAC signing
}

/**
 * Generate a secure HMAC signature for QR data
 */
function generateSignature(data: Omit<StudentQRData, 'signature'>, secretKey: string): string {
	const dataString = `${data.uuid}:${data.expires}:${data.nonce}:${data.organizationId}:${data.version}`
	return createHash('sha256')
		.update(dataString + secretKey)
		.digest('hex')
		.substring(0, 16) // Truncate for QR code size optimization
}

/**
 * Generate a QR code for student authentication with enhanced security
 */
export async function generateStudentQR(
	studentData: Omit<StudentQRData, 'expires' | 'nonce' | 'signature' | 'version'>,
	options: QRGenerationOptions = {}
): Promise<{
	qrCodeDataURL: string
	qrData: StudentQRData
	plainUuid: string
}> {
	const {
		expiresInHours = 24,
		size = 256,
		margin = 2,
		color = { dark: '#000000', light: '#FFFFFF' },
		secretKey = process.env.QR_SECRET_KEY || 'default-secret-key-change-in-production'
	} = options

	// Generate secure nonce
	const nonce = randomBytes(8).toString('hex')
	const expires = Date.now() + (expiresInHours * 60 * 60 * 1000)
	const version = 1

	// Create QR data without signature first
	const dataForSigning = {
		...studentData,
		expires,
		nonce,
		version
	}

	// Generate secure signature
	const signature = generateSignature(dataForSigning, secretKey)

	// Final QR data with signature
	const qrData: StudentQRData = {
		...dataForSigning,
		signature
	}

	// Generate QR code as data URL with high error correction for security data
	const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
		width: size,
		margin,
		color,
		errorCorrectionLevel: 'H' // High error correction for security
	})

	return {
		qrCodeDataURL,
		qrData,
		plainUuid: studentData.uuid
	}
}

/**
 * Generate multiple QR codes for a class
 */
export async function generateClassQRCodes(
	students: Array<{
		uuid: string
		name: string
		organizationId: string
	}>,
	className: string,
	options: QRGenerationOptions = {}
): Promise<Array<{
	studentId: string
	studentName: string
	qrCodeDataURL: string
	qrData: StudentQRData
}>> {
	const qrCodes = []

	for (const student of students) {
		const { qrCodeDataURL, qrData } = await generateStudentQR(
			{
				uuid: student.uuid,
				studentName: student.name,
				className,
				organizationId: student.organizationId
			},
			options
		)

		qrCodes.push({
			studentId: student.uuid,
			studentName: student.name,
			qrCodeDataURL,
			qrData
		})
	}

	return qrCodes
}

/**
 * Validate QR code data with enhanced security checks
 */
export function validateQRData(
	qrDataString: string, 
	secretKey: string = process.env.QR_SECRET_KEY || 'default-secret-key-change-in-production'
): {
	isValid: boolean
	data?: StudentQRData
	error?: string
} {
	try {
		const data = JSON.parse(qrDataString) as StudentQRData

		// Check required fields including new security fields
		if (!data.uuid || !data.studentName || !data.organizationId || !data.expires || 
			!data.nonce || !data.signature || data.version === undefined) {
			return {
				isValid: false,
				error: 'Missing required fields in QR data'
			}
		}

		// Check QR code version compatibility
		if (data.version !== 1) {
			return {
				isValid: false,
				error: 'Unsupported QR code version'
			}
		}

		// Check expiration
		if (Date.now() > data.expires) {
			return {
				isValid: false,
				error: 'QR code has expired'
			}
		}

		// Verify signature
		const expectedSignature = generateSignature({
			uuid: data.uuid,
			studentName: data.studentName,
			className: data.className,
			organizationId: data.organizationId,
			expires: data.expires,
			nonce: data.nonce,
			version: data.version
		}, secretKey)

		if (expectedSignature !== data.signature) {
			return {
				isValid: false,
				error: 'Invalid QR code signature'
			}
		}

		return {
			isValid: true,
			data
		}
	} catch (error) {
		return {
			isValid: false,
			error: 'Invalid QR code format'
		}
	}
}

/**
 * Check if a QR code is expired
 */
export function isQRExpired(qrData: StudentQRData): boolean {
	return Date.now() > qrData.expires
}

/**
 * Get time remaining until QR code expires
 */
export function getTimeRemaining(qrData: StudentQRData): {
	expired: boolean
	hours: number
	minutes: number
	totalMinutes: number
} {
	const now = Date.now()
	const remaining = qrData.expires - now
	
	if (remaining <= 0) {
		return { expired: true, hours: 0, minutes: 0, totalMinutes: 0 }
	}
	
	const totalMinutes = Math.floor(remaining / (1000 * 60))
	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60
	
	return { expired: false, hours, minutes, totalMinutes }
}

/**
 * Generate a printable QR sheet for a class
 */
export async function generatePrintableQRSheet(
	students: Array<{
		uuid: string
		name: string
		organizationId: string
	}>,
	className: string,
	options: QRGenerationOptions = {}
): Promise<string> {
	const qrCodes = await generateClassQRCodes(students, className, {
		...options,
		size: 200 // Smaller size for print
	})

	// Generate HTML for printing
	const html = `
<!DOCTYPE html>
<html>
<head>
	<title>Student Login QR Codes - ${className}</title>
	<style>
		@page {
			size: A4;
			margin: 1cm;
		}
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 20px;
		}
		.header {
			text-align: center;
			margin-bottom: 30px;
		}
		.qr-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
		}
		.qr-item {
			border: 2px solid #ddd;
			border-radius: 8px;
			padding: 15px;
			text-align: center;
			background: #f9f9f9;
			break-inside: avoid;
		}
		.student-name {
			font-weight: bold;
			margin-bottom: 10px;
			font-size: 16px;
		}
		.qr-image {
			margin: 10px 0;
		}
		.instructions {
			font-size: 12px;
			color: #666;
			margin-top: 10px;
		}
		.footer {
			margin-top: 30px;
			font-size: 12px;
			color: #666;
			text-align: center;
		}
	</style>
</head>
<body>
	<div class="header">
		<h1>Student Login QR Codes</h1>
		<h2>${className}</h2>
		<p>Generated on ${new Date().toLocaleDateString()}</p>
	</div>
	
	<div class="qr-grid">
		${qrCodes.map(qr => `
			<div class="qr-item">
				<div class="student-name">${qr.studentName}</div>
				<div class="qr-image">
					<img src="${qr.qrCodeDataURL}" alt="QR Code for ${qr.studentName}" />
				</div>
				<div class="instructions">
					Scan this QR code to log in<br>
					Student ID: ${qr.studentId.substring(0, 8)}...
				</div>
			</div>
		`).join('')}
	</div>
	
	<div class="footer">
		<p>QR codes expire in 24 hours. Keep these codes secure.</p>
		<p>Educational App Platform - QR Authentication System</p>
	</div>
</body>
</html>
`

	return html
}