/**
 * MainContent Components Export
 * Comprehensive main content area system with header, error states, and loading
 */

// Main content component
export { default as MainContent } from './MainContent.svelte';

// Header component for mobile/desktop navigation
export { default as MainContentHeader } from './MainContentHeader.svelte';

// Error state component
export { default as MainContentError } from './MainContentError.svelte';

// TypeScript definitions
export type {
  MainContentProps,
  MainContentHeaderProps,
  MainContentErrorProps,
  ContentSection,
  GridLayout,
  GridGap,
  ResponsiveGrid
} from './MainContent.types.js';