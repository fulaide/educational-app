/**
 * Theme Manager Utility
 * Provides functions for dynamic theme loading and switching
 */
import { type ThemeName } from '../themes/index.js';
export type { ThemeName };
export declare const THEMES: Record<ThemeName, import("../themes/index.js").ThemeInfo>;
/**
 * Dynamically loads a theme's CSS file
 * For now, this is a simplified version that just applies theme classes
 * In the future, this could be enhanced to dynamically import CSS
 */
export declare function loadTheme(themeName: ThemeName): Promise<void>;
/**
 * Applies theme class to document body
 */
export declare function applyThemeClass(themeName: ThemeName): void;
/**
 * Sets theme in localStorage for persistence
 */
export declare function setStoredTheme(themeName: ThemeName): void;
/**
 * Gets theme from localStorage
 */
export declare function getStoredTheme(): ThemeName | null;
/**
 * Switches to a new theme (loads CSS and applies classes)
 */
export declare function switchTheme(themeName: ThemeName): Promise<void>;
/**
 * Initializes theme system on app startup
 */
export declare function initializeThemeSystem(defaultTheme?: ThemeName): void;
/**
 * Gets current active theme
 */
export declare function getCurrentTheme(): ThemeName | null;
/**
 * Theme switching hook for Svelte (returns reactive theme state)
 * Traditional reactive store pattern for compatibility outside component context
 */
export declare function createThemeStore(): {
    readonly theme: ThemeName;
    switchTo(themeName: ThemeName): Promise<void>;
    initialize(defaultTheme?: ThemeName): void;
    subscribe(listener: () => void): () => boolean;
};
