/**
 * Theme Management System - Semantic Tokens Only Approach
 *
 * This system provides semantic design tokens that map directly to meaningful colors
 * without an unnecessary primitive layer (no --color-blue-50, etc.)
 *
 * Architecture:
 * - Semantic tokens only (--color-primary, --color-secondary, --color-danger, etc.)
 * - Tailwind v4 @theme directive compatibility with --color-* namespace
 * - Theme switching by overriding semantic tokens
 * - Clean component usage with semantic classes like bg-primary-500, text-danger-600
 */
export type ThemeName = 'parent' | 'student' | 'teacher' | 'admin';
export interface ThemeInfo {
    name: ThemeName;
    displayName: string;
    description: string;
    primaryColor: string;
}
export declare const THEME_INFO: Record<ThemeName, ThemeInfo>;
/**
 * Apply theme to document by adding theme class
 * @param theme - Theme to apply
 */
export declare function applyTheme(theme: ThemeName): void;
/**
 * Get current theme from localStorage or default to teacher
 */
export declare function getCurrentTheme(): ThemeName;
/**
 * Initialize theme system on app startup
 */
export declare function initializeTheme(): ThemeName;
