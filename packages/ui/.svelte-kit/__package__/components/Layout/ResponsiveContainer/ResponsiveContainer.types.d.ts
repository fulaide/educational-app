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
export declare const GRID_PRESETS: {
    readonly 'cards-sm': {
        readonly mobile: 1;
        readonly tablet: 2;
        readonly desktop: 3;
        readonly wide: 4;
    };
    readonly 'cards-md': {
        readonly mobile: 1;
        readonly tablet: 2;
        readonly desktop: 2;
        readonly wide: 3;
    };
    readonly 'cards-lg': {
        readonly mobile: 1;
        readonly tablet: 1;
        readonly desktop: 2;
        readonly wide: 2;
    };
    readonly list: {
        readonly mobile: 1;
        readonly tablet: 1;
        readonly desktop: 1;
        readonly wide: 1;
    };
    readonly masonry: {
        readonly mobile: 1;
        readonly tablet: 2;
        readonly desktop: 3;
        readonly wide: 4;
    };
};
export declare const GAP_PRESETS: {
    readonly tight: {
        readonly mobile: "gap-2";
        readonly tablet: "gap-3";
        readonly desktop: "gap-4";
    };
    readonly normal: {
        readonly mobile: "gap-4";
        readonly tablet: "gap-6";
        readonly desktop: "gap-8";
    };
    readonly loose: {
        readonly mobile: "gap-6";
        readonly tablet: "gap-8";
        readonly desktop: "gap-12";
    };
    readonly 'extra-loose': {
        readonly mobile: "gap-8";
        readonly tablet: "gap-12";
        readonly desktop: "gap-16";
    };
};
export declare const PADDING_PRESETS: {
    readonly none: {
        readonly mobile: "p-0";
        readonly tablet: "p-0";
        readonly desktop: "p-0";
    };
    readonly sm: {
        readonly mobile: "p-3";
        readonly tablet: "p-4";
        readonly desktop: "p-6";
    };
    readonly md: {
        readonly mobile: "p-4";
        readonly tablet: "p-6";
        readonly desktop: "p-8";
    };
    readonly lg: {
        readonly mobile: "p-6";
        readonly tablet: "p-8";
        readonly desktop: "p-12";
    };
    readonly xl: {
        readonly mobile: "p-8";
        readonly tablet: "p-12";
        readonly desktop: "p-16";
    };
};
export declare const CONTAINER_ANIMATION_PRESETS: {
    readonly 'fade-in': {
        readonly mobile: {
            readonly duration: 300;
            readonly easing: "ease-out";
        };
        readonly tablet: {
            readonly duration: 250;
            readonly easing: "ease-out";
        };
        readonly desktop: {
            readonly duration: 200;
            readonly easing: "ease-out";
        };
    };
    readonly 'slide-up': {
        readonly mobile: {
            readonly duration: 400;
            readonly easing: "ease-out";
        };
        readonly tablet: {
            readonly duration: 350;
            readonly easing: "ease-out";
        };
        readonly desktop: {
            readonly duration: 300;
            readonly easing: "ease-out";
        };
    };
    readonly 'scale-in': {
        readonly mobile: {
            readonly duration: 350;
            readonly easing: "ease-bounce";
        };
        readonly tablet: {
            readonly duration: 300;
            readonly easing: "ease-bounce";
        };
        readonly desktop: {
            readonly duration: 250;
            readonly easing: "ease-bounce";
        };
    };
};
export type GridPreset = keyof typeof GRID_PRESETS;
export type GapPreset = keyof typeof GAP_PRESETS;
export type PaddingPreset = keyof typeof PADDING_PRESETS;
export type ContainerAnimationPreset = keyof typeof CONTAINER_ANIMATION_PRESETS;
