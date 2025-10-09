/**
 * Responsive Breakpoint Utilities
 * Mobile-first breakpoint detection and management
 */

import type { Breakpoint, BreakpointConfig } from '../AppLayout/AppLayout.types.js';

export const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 0,      // 0px and up
  tablet: 768,    // 768px and up (md: in Tailwind)
  desktop: 1024,  // 1024px and up (lg: in Tailwind)
  wide: 1440,     // 1440px and up (xl: in Tailwind)
} as const;

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(
  width: number = typeof window !== 'undefined' ? window.innerWidth : 1024,
  breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS
): Breakpoint {
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Check if current viewport matches breakpoint
 */
export function isBreakpoint(
  target: Breakpoint,
  width: number = typeof window !== 'undefined' ? window.innerWidth : 1024,
  breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS
): boolean {
  const current = getCurrentBreakpoint(width, breakpoints);
  
  // Handle breakpoint hierarchy
  switch (target) {
    case 'mobile':
      return current === 'mobile';
    case 'tablet':
      return current === 'tablet' || current === 'desktop' || current === 'wide';
    case 'desktop':
      return current === 'desktop' || current === 'wide';
    case 'wide':
      return current === 'wide';
    default:
      return false;
  }
}

/**
 * Create a media query string for a breakpoint
 */
export function createMediaQuery(
  breakpoint: Breakpoint,
  breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS
): string {
  const width = breakpoints[breakpoint];
  return `(min-width: ${width}px)`;
}

/**
 * Reactive breakpoint store for Svelte with runes support
 */
export function createBreakpointStore(breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS) {
  let currentBreakpoint: Breakpoint = 'desktop';
  let currentWidth: number = 1024;
  let listeners: Set<() => void> = new Set();
  
  // Update breakpoint on window resize
  function updateBreakpoint() {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    const breakpoint = getCurrentBreakpoint(width, breakpoints);
    
    let changed = false;
    if (currentWidth !== width) {
      currentWidth = width;
      changed = true;
    }
    
    if (currentBreakpoint !== breakpoint) {
      currentBreakpoint = breakpoint;
      changed = true;
    }
    
    if (changed) {
      console.log('Breakpoint changed:', { width: currentWidth, breakpoint: currentBreakpoint, isMobile: currentBreakpoint === 'mobile' });
      // Use setTimeout to ensure listeners are called after current execution
      setTimeout(() => {
        listeners.forEach(listener => {
          try {
            listener();
          } catch (error) {
            console.error('Error in breakpoint listener:', error);
          }
        });
      }, 0);
    }
  }
  
  // Initialize and set up event listener
  if (typeof window !== 'undefined') {
    updateBreakpoint();
    // Use setTimeout to ensure initial call happens after component initialization
    setTimeout(() => {
      window.addEventListener('resize', updateBreakpoint, { passive: true });
    }, 0);
  }
  
  return {
    get current() {
      return currentBreakpoint;
    },
    get width() {
      return currentWidth;
    },
    get isMobile() {
      return currentBreakpoint === 'mobile';
    },
    get isTablet() {
      return currentBreakpoint === 'tablet';
    },
    get isDesktop() {
      return currentBreakpoint === 'desktop' || currentBreakpoint === 'wide';
    },
    get isWide() {
      return currentBreakpoint === 'wide';
    },
    // Check if current breakpoint is at least the specified one
    isAtLeast(breakpoint: Breakpoint) {
      const priorities: Record<Breakpoint, number> = {
        mobile: 0,
        tablet: 1,
        desktop: 2,
        wide: 3
      };
      return priorities[currentBreakpoint] >= priorities[breakpoint];
    },
    // Subscribe to changes
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    // Force update (useful for debugging)
    forceUpdate() {
      updateBreakpoint();
    },
    // Cleanup function for when component is destroyed
    destroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateBreakpoint);
      }
      listeners.clear();
    }
  };
}

/**
 * CSS custom properties for breakpoints
 */
export const BREAKPOINT_CSS_VARS = {
  '--bp-mobile': '0px',
  '--bp-tablet': '768px',
  '--bp-desktop': '1024px', 
  '--bp-wide': '1440px',
} as const;

/**
 * Enhanced breakpoint utilities with animation support
 */
export const RESPONSIVE_GRID_CLASSES = {
  '1-col': 'grid-cols-1',
  '2-col': 'grid-cols-1 md:grid-cols-2',
  '3-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  'auto': 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'
} as const;

export const RESPONSIVE_SPACING_CLASSES = {
  none: 'gap-0',
  sm: 'gap-2 md:gap-3',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
  xl: 'gap-8 md:gap-10'
} as const;

export const RESPONSIVE_PADDING_CLASSES = {
  none: 'p-0',
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
  xl: 'p-8 md:p-12'
} as const;

/**
 * Tailwind-compatible breakpoint classes
 */
export const BREAKPOINT_CLASSES = {
  mobile: '',
  tablet: 'md:',
  desktop: 'lg:',
  wide: 'xl:',
} as const;

/**
 * Container max-width utilities
 */
export const CONTAINER_CLASSES = {
  sm: 'max-w-sm',    // 640px
  md: 'max-w-md',    // 768px
  lg: 'max-w-lg',    // 1024px
  xl: 'max-w-xl',    // 1280px
  '2xl': 'max-w-2xl', // 1536px
  '3xl': 'max-w-3xl', // 1728px
  '4xl': 'max-w-4xl', // 1920px
  full: 'max-w-full'
} as const;

/**
 * Responsive text size utilities
 */
export const RESPONSIVE_TEXT_CLASSES = {
  xs: 'text-xs',
  sm: 'text-sm md:text-base',
  md: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl',
  '2xl': 'text-2xl md:text-3xl',
  '3xl': 'text-3xl md:text-4xl'
} as const;