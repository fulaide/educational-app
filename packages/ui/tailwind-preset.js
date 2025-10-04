/**
 * Shared Tailwind Preset for Educational App UI Package
 *
 * This preset provides:
 * - Content paths configuration for UI package components
 * - Base theme configuration that apps can extend
 * - Proper scanning of UI package for Tailwind classes
 *
 * Usage in apps:
 * import uiPreset from '@educational-app/ui/tailwind-preset.js'
 * export default {
 *   presets: [uiPreset],
 *   content: ['./src/**\/*.{html,js,svelte,ts}']
 * }
 */

/** @type {import('tailwindcss').Config} */
export default {
  // This is critical: preset includes UI package content paths
  // so apps don't need safelist - Tailwind scans UI components directly
  content: [
    // Include UI package source files
    './node_modules/@educational-app/ui/src/**/*.{html,js,svelte,ts}',
    './node_modules/@educational-app/ui/dist/**/*.{html,js,svelte,ts}',

    // Alternative paths for monorepo development (relative from app directory)
    '../../packages/ui/src/**/*.{html,js,svelte,ts}',
    '../../packages/ui/dist/**/*.{html,js,svelte,ts}',
  ],

  theme: {
    extend: {
      // Apps can extend this theme with their own customizations
      // The actual semantic tokens are defined in CSS @theme blocks
      // which work with Tailwind v4's new theme system

      // Note: With Tailwind v4, semantic tokens defined in @theme blocks
      // in CSS files automatically become available as Tailwind utilities.
      // This preset ensures proper content scanning so those utilities
      // are not purged.
    }
  },

  // No safelist needed! Content paths handle everything
  safelist: [],
}
