/**
 * MainContent Component Types
 * TypeScript definitions for the main content area component
 */

import type { NavigationItem } from '../AppLayout/AppLayout.types.js';

export interface MainContentProps {
  /**
   * Custom CSS class for the main content container
   */
  class?: string;
  
  /**
   * Whether to show a back button in mobile view
   */
  showBackButton?: boolean;
  
  /**
   * Custom back button handler (overrides default navigation)
   */
  onBackClick?: () => void;
  
  /**
   * Page title to display in mobile header
   */
  title?: string;
  
  /**
   * Subtitle or breadcrumb text
   */
  subtitle?: string;
  
  /**
   * Header actions (buttons, dropdowns, etc.)
   */
  headerActions?: NavigationItem[];
  
  /**
   * Whether to show the mobile header
   */
  showMobileHeader?: boolean;
  
  /**
   * Maximum content width constraint
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /**
   * Content padding configuration
   */
  padding?: {
    mobile?: 'none' | 'sm' | 'md' | 'lg';
    desktop?: 'none' | 'sm' | 'md' | 'lg';
  };
  
  /**
   * Scroll behavior configuration
   */
  scrollBehavior?: {
    smooth?: boolean;
    preserveScroll?: boolean;
    scrollToTop?: boolean;
  };
  
  /**
   * Loading state
   */
  isLoading?: boolean;
  
  /**
   * Error state
   */
  error?: {
    title: string;
    message: string;
    retry?: () => void;
  };
}

export interface MainContentHeaderProps {
  /**
   * Page title
   */
  title?: string;
  
  /**
   * Subtitle or breadcrumb
   */
  subtitle?: string;
  
  /**
   * Whether to show back button
   */
  showBackButton?: boolean;
  
  /**
   * Back button click handler
   */
  onBackClick?: () => void;
  
  /**
   * Header action items
   */
  actions?: NavigationItem[];
  
  /**
   * Custom CSS class
   */
  class?: string;
}

export interface MainContentErrorProps {
  /**
   * Error title
   */
  title: string;
  
  /**
   * Error message
   */
  message: string;
  
  /**
   * Retry button handler
   */
  onRetry?: () => void;
  
  /**
   * Custom CSS class
   */
  class?: string;
}

// Content section types for structured layouts
export interface ContentSection {
  id: string;
  title?: string;
  description?: string;
  className?: string;
  children?: any; // Svelte snippet
}

// Grid layout configurations
export type GridLayout = '1-col' | '2-col' | '3-col' | '4-col' | 'auto';
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Responsive grid configuration
export interface ResponsiveGrid {
  mobile: GridLayout;
  tablet: GridLayout;
  desktop: GridLayout;
  gap?: GridGap;
}