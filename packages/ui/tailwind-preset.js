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

  // Safelist for dynamically generated classes (e.g., ConfirmationDialog button colors)
  safelist: [
    // ConfirmationDialog confirm button - base classes
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'px-4',
    'py-2',
    'text-base',
    'text-white',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',

    // ConfirmationDialog confirm button - danger color
    'bg-danger-600',
    'hover:bg-danger-700',
    'focus:ring-danger-500',

    // ConfirmationDialog confirm button - primary color
    'bg-primary-600',
    'hover:bg-primary-700',
    'focus:ring-primary-500',

    // ConfirmationDialog confirm button - success color
    'bg-success-600',
    'hover:bg-success-700',
    'focus:ring-success-500',

    // ConfirmationDialog confirm button - warning color
    'bg-warning-600',
    'hover:bg-warning-700',
    'focus:ring-warning-500',

    // ConfirmationDialog confirm button - secondary color
    'bg-secondary-600',
    'hover:bg-secondary-700',
    'focus:ring-secondary-500',
  ],
}
