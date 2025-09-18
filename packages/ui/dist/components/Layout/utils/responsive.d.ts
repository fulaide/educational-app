/**
 * Responsive Utilities
 * Advanced responsive design helpers with mobile-first approach
 */
import { type Breakpoint, type BreakpointConfig } from './breakpoints.js';
import { type ResponsiveAnimation } from './animations.js';
export interface ResponsiveValue<T> {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    wide?: T;
}
export interface ResponsiveConfig {
    breakpoints?: BreakpointConfig;
    enableAnimations?: boolean;
    reducedMotion?: boolean;
}
/**
 * Utility class for responsive design patterns
 */
export declare class ResponsiveUtils {
    private config;
    private currentBreakpoint;
    private listeners;
    constructor(config?: ResponsiveConfig);
    /**
     * Get responsive value based on current breakpoint
     */
    getResponsiveValue<T>(value: ResponsiveValue<T>, fallback?: T): T | undefined;
    /**
     * Generate responsive CSS classes
     */
    getResponsiveClasses(classes: ResponsiveValue<string>): string;
    /**
     * Check if current screen matches breakpoint
     */
    matches(breakpoint: Breakpoint): boolean;
    /**
     * Check if current screen is at least the specified breakpoint
     */
    isAtLeast(breakpoint: Breakpoint): boolean;
    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint(): Breakpoint;
    /**
     * Subscribe to breakpoint changes
     */
    subscribe(listener: (breakpoint: Breakpoint) => void): () => void;
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
    }): string;
    /**
     * Apply responsive animations
     */
    applyResponsiveAnimation(element: Element, animations: ResponsiveAnimation, options?: {
        trigger?: 'immediate' | 'intersection';
        threshold?: number;
    }): void;
    /**
     * Create staggered entrance animations
     */
    staggerElements(elements: Element[], options?: {
        delay?: number;
        animation?: 'fadeIn' | 'slideInUp' | 'scaleIn';
        duration?: number;
    }): void;
    /**
     * Handle container queries (when supported)
     */
    supportsContainerQueries(): boolean;
    /**
     * Cleanup event listeners
     */
    destroy(): void;
    private handleResize;
    private updateBreakpoint;
}
/**
 * Get or create global responsive utils instance
 */
export declare function getResponsiveUtils(config?: ResponsiveConfig): ResponsiveUtils;
/**
 * Svelte action for responsive behavior
 */
export declare function responsive(element: Element, config?: {
    animations?: ResponsiveAnimation;
    classes?: ResponsiveValue<string>;
    trigger?: 'immediate' | 'intersection';
    threshold?: number;
}): {
    update(newConfig: typeof config): void;
    destroy(): void;
};
export type { ResponsiveValue, ResponsiveConfig, ResponsiveAnimation };
