/**
 * Simple reactive breakpoint system for Svelte 5 runes
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';
export interface BreakpointConfig {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
}
/**
 * Create reactive breakpoint state using Svelte 5 runes
 */
export declare function createReactiveBreakpoint(breakpoints?: BreakpointConfig): {
    readonly width: number;
    readonly current: Breakpoint;
    readonly isMobile: boolean;
    readonly isTablet: boolean;
    readonly isDesktop: boolean;
    readonly isWide: boolean;
    cleanup: () => void;
};
