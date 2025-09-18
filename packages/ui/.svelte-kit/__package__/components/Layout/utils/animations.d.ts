/**
 * Layout Animation System
 * Mobile-first responsive animations and transitions
 */
export declare const ANIMATION_DURATIONS: {
    readonly fast: 150;
    readonly normal: 250;
    readonly slow: 350;
    readonly extra_slow: 500;
};
export declare const EASING_FUNCTIONS: {
    readonly 'ease-out': "cubic-bezier(0.16, 1, 0.3, 1)";
    readonly 'ease-in-out': "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly 'ease-bounce': "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    readonly 'ease-spring': "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    readonly 'ease-smooth': "cubic-bezier(0.25, 0.8, 0.25, 1)";
    readonly 'ease-sharp': "cubic-bezier(0.4, 0, 0.6, 1)";
};
export declare const ANIMATION_CSS_VARS: {
    readonly '--duration-fast': "150ms";
    readonly '--duration-normal': "250ms";
    readonly '--duration-slow': "350ms";
    readonly '--duration-extra-slow': "500ms";
    readonly '--ease-out': "cubic-bezier(0.16, 1, 0.3, 1)";
    readonly '--ease-in-out': "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly '--ease-bounce': "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    readonly '--ease-spring': "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    readonly '--ease-smooth': "cubic-bezier(0.25, 0.8, 0.25, 1)";
    readonly '--ease-sharp': "cubic-bezier(0.4, 0, 0.6, 1)";
};
export declare const ANIMATION_PRESETS: {
    readonly fadeIn: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
        readonly keyframes: {
            readonly from: {
                readonly opacity: 0;
            };
            readonly to: {
                readonly opacity: 1;
            };
        };
    };
    readonly fadeOut: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
        readonly keyframes: {
            readonly from: {
                readonly opacity: 1;
            };
            readonly to: {
                readonly opacity: 0;
            };
        };
    };
    readonly slideInLeft: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
        readonly keyframes: {
            readonly from: {
                readonly transform: "translateX(-100%)";
            };
            readonly to: {
                readonly transform: "translateX(0)";
            };
        };
    };
    readonly slideInRight: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
        readonly keyframes: {
            readonly from: {
                readonly transform: "translateX(100%)";
            };
            readonly to: {
                readonly transform: "translateX(0)";
            };
        };
    };
    readonly slideInUp: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
        readonly keyframes: {
            readonly from: {
                readonly transform: "translateY(100%)";
            };
            readonly to: {
                readonly transform: "translateY(0)";
            };
        };
    };
    readonly slideInDown: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.16, 1, 0.3, 1)";
        readonly keyframes: {
            readonly from: {
                readonly transform: "translateY(-100%)";
            };
            readonly to: {
                readonly transform: "translateY(0)";
            };
        };
    };
    readonly scaleIn: {
        readonly duration: 250;
        readonly easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        readonly keyframes: {
            readonly from: {
                readonly transform: "scale(0.9)";
                readonly opacity: 0;
            };
            readonly to: {
                readonly transform: "scale(1)";
                readonly opacity: 1;
            };
        };
    };
    readonly scaleOut: {
        readonly duration: 150;
        readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly keyframes: {
            readonly from: {
                readonly transform: "scale(1)";
                readonly opacity: 1;
            };
            readonly to: {
                readonly transform: "scale(0.9)";
                readonly opacity: 0;
            };
        };
    };
    readonly spin: {
        readonly duration: 1000;
        readonly easing: "linear";
        readonly keyframes: {
            readonly from: {
                readonly transform: "rotate(0deg)";
            };
            readonly to: {
                readonly transform: "rotate(360deg)";
            };
        };
    };
    readonly pulse: {
        readonly duration: 2000;
        readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly keyframes: {
            readonly '0%, 100%': {
                readonly opacity: 1;
            };
            readonly '50%': {
                readonly opacity: 0.5;
            };
        };
    };
    readonly bounce: {
        readonly duration: 1000;
        readonly easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        readonly keyframes: {
            readonly '0%, 20%, 53%, 80%, 100%': {
                readonly transform: "translateY(0)";
            };
            readonly '40%, 43%': {
                readonly transform: "translateY(-8px)";
            };
            readonly '70%': {
                readonly transform: "translateY(-4px)";
            };
            readonly '90%': {
                readonly transform: "translateY(-2px)";
            };
        };
    };
};
export interface ResponsiveAnimation {
    mobile?: Partial<AnimationConfig>;
    tablet?: Partial<AnimationConfig>;
    desktop?: Partial<AnimationConfig>;
}
export interface AnimationConfig {
    duration: number;
    easing: string;
    delay?: number;
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
    iterationCount?: number | 'infinite';
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}
export declare class AnimationUtils {
    /**
     * Check if user prefers reduced motion
     */
    static prefersReducedMotion(): boolean;
    /**
     * Get animation duration based on user preferences
     */
    static getAnimationDuration(duration: number): number;
    /**
     * Create animation with reduced motion support
     */
    static createAnimation(element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation | null;
    /**
     * Apply responsive animation based on screen size
     */
    static applyResponsiveAnimation(element: Element, animations: ResponsiveAnimation, breakpoints: {
        tablet: number;
        desktop: number;
    }): Animation | null;
    /**
     * Stagger animations for multiple elements
     */
    static staggerAnimation(elements: Element[], baseAnimation: AnimationConfig, staggerDelay?: number): Animation[];
    /**
     * Create entrance animation
     */
    static createEntranceAnimation(element: Element, type?: keyof typeof ANIMATION_PRESETS, options?: Partial<AnimationConfig>): Animation | null;
    /**
     * Create exit animation
     */
    static createExitAnimation(element: Element, type?: keyof typeof ANIMATION_PRESETS, options?: Partial<AnimationConfig>): Animation | null;
    /**
     * Create hover animation
     */
    static createHoverAnimation(element: HTMLElement): void;
    /**
     * Create focus animation
     */
    static createFocusAnimation(element: HTMLElement): void;
}
export declare function animate(element: Element, config?: {
    type?: keyof typeof ANIMATION_PRESETS;
    duration?: number;
    easing?: string;
    delay?: number;
    trigger?: 'immediate' | 'intersection';
    threshold?: number;
}): {
    destroy(): void;
};
export type { ResponsiveAnimation, AnimationConfig };
