import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID for component instances
 */
export function generateId(prefix = 'id'): string {
	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Format XP numbers with appropriate suffixes
 */
export function formatXP(xp: number): string {
	if (xp < 1000) return xp.toString();
	if (xp < 1000000) return `${(xp / 1000).toFixed(1)}K`;
	return `${(xp / 1000000).toFixed(1)}M`;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, total: number): number {
	if (total === 0) return 0;
	return Math.min(100, Math.max(0, (current / total) * 100));
}

/**
 * Get grade-appropriate colors
 */
export function getGradeColor(grade: number): string {
	const colors = [
		'bg-red-100 text-red-800',      // Grade 1
		'bg-orange-100 text-orange-800', // Grade 2
		'bg-yellow-100 text-yellow-800', // Grade 3
		'bg-green-100 text-green-800',   // Grade 4
		'bg-blue-100 text-blue-800',     // Grade 5
		'bg-indigo-100 text-indigo-800',  // Grade 6
		'bg-purple-100 text-purple-800', // Grade 7
		'bg-pink-100 text-pink-800',     // Grade 8
		'bg-gray-100 text-gray-800',     // Grade 9
		'bg-slate-100 text-slate-800',   // Grade 10
		'bg-zinc-100 text-zinc-800',     // Grade 11
		'bg-neutral-100 text-neutral-800' // Grade 12
	];
	
	return colors[Math.max(0, Math.min(grade - 1, colors.length - 1))];
}

/**
 * Format duration in a human-readable format
 */
export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	} else if (minutes > 0) {
		return `${minutes}m ${secs}s`;
	} else {
		return `${secs}s`;
	}
}

/**
 * Validate if a string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

/**
 * Generate a student-friendly display name from UUID
 */
export function generateDisplayName(uuid: string): string {
	// Use the last 6 characters of UUID for a friendly display
	const suffix = uuid.slice(-6).toUpperCase();
	return `Student ${suffix}`;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json) as T;
	} catch {
		return fallback;
	}
}

/**
 * Generate QR code data string for student login
 */
export function generateQRData(uuid: string, organizationId: string): string {
	return JSON.stringify({
		type: 'student_login',
		uuid,
		organizationId,
		timestamp: Date.now()
	});
}

/**
 * Color variant mappings for consistent theming
 */
export const colorVariants = {
	primary: {
		bg: 'bg-primary-500',
		hover: 'hover:bg-primary-600',
		text: 'text-primary-600',
		border: 'border-primary-500',
		ring: 'ring-primary-500'
	},
	secondary: {
		bg: 'bg-secondary-500',
		hover: 'hover:bg-secondary-600',
		text: 'text-secondary-600',
		border: 'border-secondary-500',
		ring: 'ring-secondary-500'
	},
	success: {
		bg: 'bg-success-500',
		hover: 'hover:bg-success-600',
		text: 'text-success-600',
		border: 'border-success-500',
		ring: 'ring-success-500'
	},
	danger: {
		bg: 'bg-danger-500',
		hover: 'hover:bg-danger-600',
		text: 'text-danger-600',
		border: 'border-danger-500',
		ring: 'ring-danger-500'
	},
	warning: {
		bg: 'bg-warning-500',
		hover: 'hover:bg-warning-600',
		text: 'text-warning-600',
		border: 'border-warning-500',
		ring: 'ring-warning-500'
	}
} as const;

export type ColorVariant = keyof typeof colorVariants;