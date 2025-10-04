import uiPreset from '@educational-app/ui/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  // Use UI package preset for proper content scanning and theme
  presets: [uiPreset],

  // Only need to scan app-specific files - preset handles UI package
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],

  // No safelist needed! UI preset handles all UI component classes
  safelist: []
};
