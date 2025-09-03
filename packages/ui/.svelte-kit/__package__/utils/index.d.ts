import { type ClassValue } from 'clsx';
/**
 * Utility function to merge Tailwind classes with proper conflict resolution
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Generate a unique ID for component instances
 */
export declare function generateId(prefix?: string): string;
/**
 * Debounce function for performance optimization
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Format XP numbers with appropriate suffixes
 */
export declare function formatXP(xp: number): string;
/**
 * Calculate progress percentage
 */
export declare function calculateProgress(current: number, total: number): number;
/**
 * Get grade-appropriate colors
 */
export declare function getGradeColor(grade: number): string;
/**
 * Format duration in a human-readable format
 */
export declare function formatDuration(seconds: number): string;
/**
 * Validate if a string is a valid UUID
 */
export declare function isValidUUID(uuid: string): boolean;
/**
 * Generate a student-friendly display name from UUID
 */
export declare function generateDisplayName(uuid: string): string;
/**
 * Safe JSON parse with fallback
 */
export declare function safeJsonParse<T>(json: string, fallback: T): T;
/**
 * Generate QR code data string for student login
 */
export declare function generateQRData(uuid: string, organizationId: string): string;
/**
 * Color variant mappings for consistent theming
 */
export declare const colorVariants: {
    readonly primary: {
        readonly bg: "bg-primary-500";
        readonly hover: "hover:bg-primary-600";
        readonly text: "text-primary-600";
        readonly border: "border-primary-500";
        readonly ring: "ring-primary-500";
    };
    readonly secondary: {
        readonly bg: "bg-secondary-500";
        readonly hover: "hover:bg-secondary-600";
        readonly text: "text-secondary-600";
        readonly border: "border-secondary-500";
        readonly ring: "ring-secondary-500";
    };
    readonly success: {
        readonly bg: "bg-success-500";
        readonly hover: "hover:bg-success-600";
        readonly text: "text-success-600";
        readonly border: "border-success-500";
        readonly ring: "ring-success-500";
    };
    readonly danger: {
        readonly bg: "bg-danger-500";
        readonly hover: "hover:bg-danger-600";
        readonly text: "text-danger-600";
        readonly border: "border-danger-500";
        readonly ring: "ring-danger-500";
    };
    readonly warning: {
        readonly bg: "bg-warning-500";
        readonly hover: "hover:bg-warning-600";
        readonly text: "text-warning-600";
        readonly border: "border-warning-500";
        readonly ring: "ring-warning-500";
    };
};
export type ColorVariant = keyof typeof colorVariants;
