import { randomBytes } from 'crypto';

/**
 * Generate a UUID v4 for students
 * Format: XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX
 */
export function generateUUID(): string {
	const bytes = randomBytes(16);
	
	// Set version (4) and variant bits
	bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
	bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
	
	const hex = bytes.toString('hex');
	
	return [
		hex.substring(0, 8),
		hex.substring(8, 12),
		hex.substring(12, 16),
		hex.substring(16, 20),
		hex.substring(20, 32)
	].join('-');
}

/**
 * Generate a shorter student code (8 characters)
 * For easier manual entry: ABC123XY
 */
export function generateStudentCode(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	
	return result;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}