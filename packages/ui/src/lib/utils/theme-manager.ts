/**
 * Theme Manager Utility
 * Provides functions for dynamic theme loading and switching
 */

import { THEME_INFO, type ThemeName } from '../themes/index.js';

// Re-export theme types and info
export type { ThemeName };
export const THEMES = THEME_INFO;

/**
 * Dynamically loads a theme's CSS file
 * For now, this is a simplified version that just applies theme classes
 * In the future, this could be enhanced to dynamically import CSS
 */
export async function loadTheme(themeName: ThemeName): Promise<void> {
  const theme = THEMES[themeName];
  if (!theme) {
    throw new Error(`Theme "${themeName}" not found`);
  }

  // For now, just resolve immediately
  // Real theme CSS loading would happen via static imports in the app
  return Promise.resolve();
}

/**
 * Applies theme class to document body
 */
export function applyThemeClass(themeName: ThemeName): void {
  // Remove existing theme classes
  document.body.classList.remove(...Object.keys(THEMES).map(name => `theme-${name}`));
  
  // Add new theme class
  document.body.classList.add(`theme-${themeName}`);
}

/**
 * Sets theme in localStorage for persistence
 */
export function setStoredTheme(themeName: ThemeName): void {
  localStorage.setItem('preferred-theme', themeName);
}

/**
 * Gets theme from localStorage
 */
export function getStoredTheme(): ThemeName | null {
  const stored = localStorage.getItem('preferred-theme');
  return stored && stored in THEMES ? (stored as ThemeName) : null;
}

/**
 * Switches to a new theme (loads CSS and applies classes)
 */
export async function switchTheme(themeName: ThemeName): Promise<void> {
  try {
    await loadTheme(themeName);
    applyThemeClass(themeName);
    setStoredTheme(themeName);
    
    console.log(`✅ Switched to ${THEMES[themeName].displayName} theme`);
  } catch (error) {
    console.error(`❌ Failed to switch to ${themeName} theme:`, error);
    throw error;
  }
}

/**
 * Initializes theme system on app startup
 */
export function initializeThemeSystem(defaultTheme: ThemeName = 'parent'): void {
  // Check for stored theme preference
  const storedTheme = getStoredTheme();
  const themeToLoad = storedTheme || defaultTheme;
  
  // Apply theme class immediately (before CSS loads)
  applyThemeClass(themeToLoad);
  
  // Load theme CSS
  loadTheme(themeToLoad).catch(error => {
    console.warn(`Failed to load preferred theme ${themeToLoad}, falling back to default`);
    if (themeToLoad !== defaultTheme) {
      switchTheme(defaultTheme);
    }
  });
}

/**
 * Gets current active theme
 */
export function getCurrentTheme(): ThemeName | null {
  const themeClasses = document.body.classList;
  for (const [themeName] of Object.entries(THEMES)) {
    if (themeClasses.contains(`theme-${themeName}`)) {
      return themeName as ThemeName;
    }
  }
  return null;
}

/**
 * Theme switching hook for Svelte (returns reactive theme state)
 * Traditional reactive store pattern for compatibility outside component context
 */
export function createThemeStore() {
  let currentTheme: ThemeName = 'parent';
  let listeners: Set<() => void> = new Set();
  
  function notify() {
    listeners.forEach(listener => listener());
  }
  
  return {
    get theme() { return currentTheme; },
    
    async switchTo(themeName: ThemeName) {
      await switchTheme(themeName);
      currentTheme = themeName;
      notify();
    },
    
    initialize(defaultTheme: ThemeName = 'parent') {
      const storedTheme = getStoredTheme();
      currentTheme = storedTheme || defaultTheme;
      initializeThemeSystem(defaultTheme);
      notify();
    },
    
    // Add subscription functionality for reactivity
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}