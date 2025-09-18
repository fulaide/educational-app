/**
 * ResponsiveContainer Component Types
 * TypeScript definitions for responsive container with grid and animation support
 */

import type { ResponsiveValue, ResponsiveAnimation } from '../utils/responsive.js';

export interface ResponsiveContainerProps {
  /**
   * Responsive grid configuration (number of columns)
   */
  grid?: ResponsiveValue<number>;
  
  /**
   * Grid gap spacing responsive configuration
   */
  gap?: ResponsiveValue<string>;
  
  /**
   * Enable auto-fit grid with minimum column width
   */
  autoFit?: boolean;
  
  /**
   * Minimum width for auto-fit columns
   */
  minWidth?: string;
  
  /**
   * Container maximum width constraint
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  
  /**
   * Responsive padding configuration
   */
  padding?: ResponsiveValue<string>;
  
  /**
   * Center content horizontally
   */
  center?: boolean;
  
  /**
   * Animation configuration for container entrance
   */
  animations?: ResponsiveAnimation;
  
  /**
   * Enable staggered animations for child elements
   */
  staggerChildren?: boolean;
  
  /**
   * Delay between staggered child animations (ms)
   */
  staggerDelay?: number;
  
  /**
   * Animation trigger type
   */
  animationTrigger?: 'immediate' | 'intersection';
  
  /**
   * Intersection threshold for animation trigger (0-1)
   */
  animationThreshold?: number;
  
  /**
   * Custom CSS class
   */
  class?: string;
  
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
  
  /**
   * Container role for accessibility
   */
  role?: string;
}

// Grid layout presets
export const GRID_PRESETS = {
  'cards-sm': {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  },
  'cards-md': {
    mobile: 1,
    tablet: 2,
    desktop: 2,
    wide: 3
  },
  'cards-lg': {
    mobile: 1,
    tablet: 1,
    desktop: 2,
    wide: 2
  },
  'list': {
    mobile: 1,
    tablet: 1,
    desktop: 1,
    wide: 1
  },
  'masonry': {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  }
} as const;

// Gap presets for different content types
export const GAP_PRESETS = {
  'tight': {
    mobile: 'gap-2',
    tablet: 'gap-3',
    desktop: 'gap-4'
  },
  'normal': {
    mobile: 'gap-4',
    tablet: 'gap-6',
    desktop: 'gap-8'
  },
  'loose': {
    mobile: 'gap-6',
    tablet: 'gap-8',
    desktop: 'gap-12'
  },
  'extra-loose': {
    mobile: 'gap-8',
    tablet: 'gap-12',
    desktop: 'gap-16'
  }
} as const;

// Padding presets
export const PADDING_PRESETS = {
  'none': {
    mobile: 'p-0',
    tablet: 'p-0',
    desktop: 'p-0'
  },
  'sm': {
    mobile: 'p-3',
    tablet: 'p-4',
    desktop: 'p-6'
  },
  'md': {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8'
  },
  'lg': {
    mobile: 'p-6',
    tablet: 'p-8',
    desktop: 'p-12'
  },
  'xl': {
    mobile: 'p-8',
    tablet: 'p-12',
    desktop: 'p-16'
  }
} as const;

// Animation presets for containers
export const CONTAINER_ANIMATION_PRESETS = {
  'fade-in': {
    mobile: { duration: 300, easing: 'ease-out' },
    tablet: { duration: 250, easing: 'ease-out' },
    desktop: { duration: 200, easing: 'ease-out' }
  },
  'slide-up': {
    mobile: { duration: 400, easing: 'ease-out' },
    tablet: { duration: 350, easing: 'ease-out' },
    desktop: { duration: 300, easing: 'ease-out' }
  },
  'scale-in': {
    mobile: { duration: 350, easing: 'ease-bounce' },
    tablet: { duration: 300, easing: 'ease-bounce' },
    desktop: { duration: 250, easing: 'ease-bounce' }
  }
} as const;

export type GridPreset = keyof typeof GRID_PRESETS;
export type GapPreset = keyof typeof GAP_PRESETS;
export type PaddingPreset = keyof typeof PADDING_PRESETS;
export type ContainerAnimationPreset = keyof typeof CONTAINER_ANIMATION_PRESETS;