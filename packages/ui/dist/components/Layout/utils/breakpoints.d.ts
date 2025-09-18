/**
 * Responsive Breakpoint Utilities
 * Mobile-first breakpoint detection and management
 */
import type { Breakpoint, BreakpointConfig } from '../AppLayout/AppLayout.types.js';
export declare const DEFAULT_BREAKPOINTS: BreakpointConfig;
/**
 * Get current breakpoint based on window width
 */
export declare function getCurrentBreakpoint(width?: number, breakpoints?: BreakpointConfig): Breakpoint;
/**
 * Check if current viewport matches breakpoint
 */
export declare function isBreakpoint(target: Breakpoint, width?: number, breakpoints?: BreakpointConfig): boolean;
/**
 * Create a media query string for a breakpoint
 */
export declare function createMediaQuery(breakpoint: Breakpoint, breakpoints?: BreakpointConfig): string;
/**
 * Reactive breakpoint store for Svelte (using traditional approach)
 */
export declare function createBreakpointStore(breakpoints?: BreakpointConfig): {
    readonly current: Breakpoint;
    readonly width: number;
    readonly isMobile: boolean;
    readonly isTablet: boolean;
    readonly isDesktop: boolean;
    readonly isWide: boolean;
    isAtLeast(breakpoint: Breakpoint): boolean;
    subscribe(listener: () => void): () => boolean;
    destroy(): void;
};
/**
 * CSS custom properties for breakpoints
 */
export declare const BREAKPOINT_CSS_VARS: {
    readonly '--bp-mobile': "0px";
    readonly '--bp-tablet': "768px";
    readonly '--bp-desktop': "1024px";
    readonly '--bp-wide': "1440px";
};
/**
 * Enhanced breakpoint utilities with animation support
 */
export declare const RESPONSIVE_GRID_CLASSES: {
    readonly '1-col': "grid-cols-1";
    readonly '2-col': "grid-cols-1 md:grid-cols-2";
    readonly '3-col': "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    readonly '4-col': "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    readonly auto: "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]";
};
export declare const RESPONSIVE_SPACING_CLASSES: {
    readonly none: "gap-0";
    readonly sm: "gap-2 md:gap-3";
    readonly md: "gap-4 md:gap-6";
    readonly lg: "gap-6 md:gap-8";
    readonly xl: "gap-8 md:gap-10";
};
export declare const RESPONSIVE_PADDING_CLASSES: {
    readonly none: "p-0";
    readonly sm: "p-3 md:p-4";
    readonly md: "p-4 md:p-6";
    readonly lg: "p-6 md:p-8";
    readonly xl: "p-8 md:p-12";
};
/**
 * Tailwind-compatible breakpoint classes
 */
export declare const BREAKPOINT_CLASSES: {
    readonly mobile: "";
    readonly tablet: "md:";
    readonly desktop: "lg:";
    readonly wide: "xl:";
};
/**
 * Container max-width utilities
 */
export declare const CONTAINER_CLASSES: {
    readonly sm: "max-w-sm";
    readonly md: "max-w-md";
    readonly lg: "max-w-lg";
    readonly xl: "max-w-xl";
    readonly '2xl': "max-w-2xl";
    readonly '3xl': "max-w-3xl";
    readonly '4xl': "max-w-4xl";
    readonly full: "max-w-full";
};
/**
 * Responsive text size utilities
 */
export declare const RESPONSIVE_TEXT_CLASSES: {
    readonly xs: "text-xs";
    readonly sm: "text-sm md:text-base";
    readonly md: "text-base md:text-lg";
    readonly lg: "text-lg md:text-xl";
    readonly xl: "text-xl md:text-2xl";
    readonly '2xl': "text-2xl md:text-3xl";
    readonly '3xl': "text-3xl md:text-4xl";
};
