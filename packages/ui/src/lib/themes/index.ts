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

export const THEME_INFO: Record<ThemeName, ThemeInfo> = {
  parent: {
    name: 'parent',
    displayName: 'Parent Portal',
    description: 'Warm, family-oriented theme with semantic tokens',
    primaryColor: '#10b981'
  },
  student: {
    name: 'student',
    displayName: 'Student Portal', 
    description: 'Bright, engaging theme with semantic tokens',
    primaryColor: '#0ea5e9'
  },
  teacher: {
    name: 'teacher',
    displayName: 'Teacher Portal',
    description: 'Professional green theme with semantic tokens',
    primaryColor: '#79c71b' // Updated to match our semantic green
  },
  admin: {
    name: 'admin',
    displayName: 'Admin Dashboard',
    description: 'Clean, systematic theme with semantic tokens',
    primaryColor: '#6b7280'
  }
};

/**
 * Apply theme to document by adding theme class
 * @param theme - Theme to apply
 */
export function applyTheme(theme: ThemeName) {
  const body = document.body;
  
  // Remove all existing theme classes
  body.className = body.className.replace(/theme-\w+/g, '');
  
  // Add new theme class
  body.classList.add(`theme-${theme}`);
  
  // Store theme preference
  localStorage.setItem('preferred-theme', theme);
}

/**
 * Get current theme from localStorage or default to teacher
 */
export function getCurrentTheme(): ThemeName {
  const stored = localStorage.getItem('preferred-theme') as ThemeName;
  return stored && stored in THEME_INFO ? stored : 'teacher';
}

/**
 * Initialize theme system on app startup
 */
export function initializeTheme() {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
  return currentTheme;
}