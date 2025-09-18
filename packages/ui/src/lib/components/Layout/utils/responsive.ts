/**
 * Responsive Utilities
 * Advanced responsive design helpers with mobile-first approach
 */

import { getCurrentBreakpoint, type Breakpoint, type BreakpointConfig, DEFAULT_BREAKPOINTS } from './breakpoints.js';
import { AnimationUtils, type ResponsiveAnimation, ANIMATION_DURATIONS, EASING_FUNCTIONS } from './animations.js';

// Responsive value type that adapts based on screen size
export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

// Responsive configuration for components
export interface ResponsiveConfig {
  breakpoints?: BreakpointConfig;
  enableAnimations?: boolean;
  reducedMotion?: boolean;
}

/**
 * Utility class for responsive design patterns
 */
export class ResponsiveUtils {
  private config: Required<ResponsiveConfig>;
  private currentBreakpoint: Breakpoint = 'desktop';
  private listeners: Set<() => void> = new Set();

  constructor(config: ResponsiveConfig = {}) {
    this.config = {
      breakpoints: config.breakpoints || DEFAULT_BREAKPOINTS,
      enableAnimations: config.enableAnimations ?? true,
      reducedMotion: config.reducedMotion ?? AnimationUtils.prefersReducedMotion()
    };

    if (typeof window !== 'undefined') {
      this.updateBreakpoint();
      window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
      
      // Watch for reduced motion preference changes
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        this.config.reducedMotion = e.matches;
      });
    }
  }

  /**
   * Get responsive value based on current breakpoint
   */
  getResponsiveValue<T>(value: ResponsiveValue<T>, fallback?: T): T | undefined {
    const values = {
      wide: value.wide,
      desktop: value.desktop,
      tablet: value.tablet,
      mobile: value.mobile
    };

    // Start from current breakpoint and work down
    const priorities: Breakpoint[] = ['wide', 'desktop', 'tablet', 'mobile'];
    const startIndex = priorities.indexOf(this.currentBreakpoint);

    for (let i = startIndex; i < priorities.length; i++) {
      const breakpoint = priorities[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }

    return fallback;
  }

  /**
   * Generate responsive CSS classes
   */
  getResponsiveClasses(classes: ResponsiveValue<string>): string {
    const result: string[] = [];

    if (classes.mobile) result.push(classes.mobile);
    if (classes.tablet) result.push(`md:${classes.tablet}`);
    if (classes.desktop) result.push(`lg:${classes.desktop}`);
    if (classes.wide) result.push(`xl:${classes.wide}`);

    return result.join(' ');
  }

  /**
   * Check if current screen matches breakpoint
   */
  matches(breakpoint: Breakpoint): boolean {
    if (typeof window === 'undefined') return breakpoint === 'desktop';
    
    const width = window.innerWidth;
    const bp = this.config.breakpoints[breakpoint];
    
    switch (breakpoint) {
      case 'mobile':
        return width < this.config.breakpoints.tablet;
      case 'tablet':
        return width >= this.config.breakpoints.tablet && width < this.config.breakpoints.desktop;
      case 'desktop':
        return width >= this.config.breakpoints.desktop && width < this.config.breakpoints.wide;
      case 'wide':
        return width >= this.config.breakpoints.wide;
      default:
        return false;
    }
  }

  /**
   * Check if current screen is at least the specified breakpoint
   */
  isAtLeast(breakpoint: Breakpoint): boolean {
    if (typeof window === 'undefined') return true;
    
    const width = window.innerWidth;
    return width >= this.config.breakpoints[breakpoint];
  }

  /**
   * Get current breakpoint
   */
  getCurrentBreakpoint(): Breakpoint {
    return this.currentBreakpoint;
  }

  /**
   * Subscribe to breakpoint changes
   */
  subscribe(listener: (breakpoint: Breakpoint) => void): () => void {
    const wrappedListener = () => listener(this.currentBreakpoint);
    this.listeners.add(wrappedListener);

    // Call immediately with current value
    wrappedListener();

    return () => {
      this.listeners.delete(wrappedListener);
    };
  }

  /**
   * Create responsive grid configuration
   */
  createResponsiveGrid(config: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
    gap?: ResponsiveValue<string>;
    autoFit?: boolean;
    minWidth?: string;
  }): string {
    const classes: string[] = ['grid'];

    if (config.autoFit) {
      classes.push(`grid-cols-[repeat(auto-fit,minmax(${config.minWidth || '280px'},1fr))]`);
    } else {
      if (config.mobile) classes.push(`grid-cols-${config.mobile}`);
      if (config.tablet) classes.push(`md:grid-cols-${config.tablet}`);
      if (config.desktop) classes.push(`lg:grid-cols-${config.desktop}`);
      if (config.wide) classes.push(`xl:grid-cols-${config.wide}`);
    }

    if (config.gap) {
      const gapClasses = this.getResponsiveClasses({
        mobile: config.gap.mobile,
        tablet: config.gap.tablet,
        desktop: config.gap.desktop,
        wide: config.gap.wide
      });
      classes.push(gapClasses);
    }

    return classes.join(' ');
  }

  /**
   * Apply responsive animations
   */
  applyResponsiveAnimation(
    element: Element,
    animations: ResponsiveAnimation,
    options: { trigger?: 'immediate' | 'intersection'; threshold?: number } = {}
  ): void {
    if (!this.config.enableAnimations || this.config.reducedMotion) return;

    const { trigger = 'intersection', threshold = 0.1 } = options;
    
    const runAnimation = () => {
      AnimationUtils.applyResponsiveAnimation(
        element,
        animations,
        { 
          tablet: this.config.breakpoints.tablet, 
          desktop: this.config.breakpoints.desktop 
        }
      );
    };

    if (trigger === 'immediate') {
      setTimeout(runAnimation, 0);
    } else if (trigger === 'intersection' && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold }
      );

      observer.observe(element);
    }
  }

  /**
   * Create staggered entrance animations
   */
  staggerElements(
    elements: Element[],
    options: {
      delay?: number;
      animation?: 'fadeIn' | 'slideInUp' | 'scaleIn';
      duration?: number;
    } = {}
  ): void {
    if (!this.config.enableAnimations || this.config.reducedMotion) return;

    const { delay = 100, animation = 'fadeIn', duration = ANIMATION_DURATIONS.normal } = options;

    elements.forEach((element, index) => {
      setTimeout(() => {
        AnimationUtils.createEntranceAnimation(element, animation, {
          duration,
          easing: EASING_FUNCTIONS['ease-out'],
          delay: 0
        });
      }, index * delay);
    });
  }

  /**
   * Handle container queries (when supported)
   */
  supportsContainerQueries(): boolean {
    if (typeof window === 'undefined') return false;
    return CSS.supports('container-type', 'inline-size');
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
    this.listeners.clear();
  }

  private handleResize(): void {
    this.updateBreakpoint();
  }

  private updateBreakpoint(): void {
    if (typeof window === 'undefined') return;
    
    const newBreakpoint = getCurrentBreakpoint(window.innerWidth, this.config.breakpoints);
    
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.listeners.forEach(listener => listener());
    }
  }
}

// Global responsive utilities instance
let globalResponsive: ResponsiveUtils | null = null;

/**
 * Get or create global responsive utils instance
 */
export function getResponsiveUtils(config?: ResponsiveConfig): ResponsiveUtils {
  if (!globalResponsive) {
    globalResponsive = new ResponsiveUtils(config);
  }
  return globalResponsive;
}

/**
 * Svelte action for responsive behavior
 */
export function responsive(
  element: Element,
  config: {
    animations?: ResponsiveAnimation;
    classes?: ResponsiveValue<string>;
    trigger?: 'immediate' | 'intersection';
    threshold?: number;
  } = {}
) {
  const utils = getResponsiveUtils();
  const { animations, classes, trigger, threshold } = config;

  // Apply responsive classes
  if (classes && element instanceof HTMLElement) {
    const responsiveClasses = utils.getResponsiveClasses(classes);
    element.className = `${element.className} ${responsiveClasses}`.trim();
  }

  // Apply animations
  if (animations) {
    utils.applyResponsiveAnimation(element, animations, { trigger, threshold });
  }

  return {
    update(newConfig: typeof config) {
      // Handle updates if needed
    },
    destroy() {
      // Cleanup handled by utils.destroy()
    }
  };
}

// Export types
export type { ResponsiveValue, ResponsiveConfig, ResponsiveAnimation };