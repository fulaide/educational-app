/**
 * Layout Animation System
 * Mobile-first responsive animations and transitions
 */
// Animation duration constants
export const ANIMATION_DURATIONS = {
    fast: 150,
    normal: 250,
    slow: 350,
    extra_slow: 500
};
// Easing functions for smooth animations
export const EASING_FUNCTIONS = {
    'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'ease-smooth': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    'ease-sharp': 'cubic-bezier(0.4, 0, 0.6, 1)'
};
// CSS Custom Properties for animations
export const ANIMATION_CSS_VARS = {
    '--duration-fast': `${ANIMATION_DURATIONS.fast}ms`,
    '--duration-normal': `${ANIMATION_DURATIONS.normal}ms`,
    '--duration-slow': `${ANIMATION_DURATIONS.slow}ms`,
    '--duration-extra-slow': `${ANIMATION_DURATIONS.extra_slow}ms`,
    '--ease-out': EASING_FUNCTIONS['ease-out'],
    '--ease-in-out': EASING_FUNCTIONS['ease-in-out'],
    '--ease-bounce': EASING_FUNCTIONS['ease-bounce'],
    '--ease-spring': EASING_FUNCTIONS['ease-spring'],
    '--ease-smooth': EASING_FUNCTIONS['ease-smooth'],
    '--ease-sharp': EASING_FUNCTIONS['ease-sharp']
};
// Animation presets for common UI patterns
export const ANIMATION_PRESETS = {
    fadeIn: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-out'],
        keyframes: {
            from: { opacity: 0 },
            to: { opacity: 1 }
        }
    },
    fadeOut: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-out'],
        keyframes: {
            from: { opacity: 1 },
            to: { opacity: 0 }
        }
    },
    slideInLeft: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-out'],
        keyframes: {
            from: { transform: 'translateX(-100%)' },
            to: { transform: 'translateX(0)' }
        }
    },
    slideInRight: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-out'],
        keyframes: {
            from: { transform: 'translateX(100%)' },
            to: { transform: 'translateX(0)' }
        }
    },
    slideInUp: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-out'],
        keyframes: {
            from: { transform: 'translateY(100%)' },
            to: { transform: 'translateY(0)' }
        }
    },
    slideInDown: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-out'],
        keyframes: {
            from: { transform: 'translateY(-100%)' },
            to: { transform: 'translateY(0)' }
        }
    },
    scaleIn: {
        duration: ANIMATION_DURATIONS.normal,
        easing: EASING_FUNCTIONS['ease-bounce'],
        keyframes: {
            from: { transform: 'scale(0.9)', opacity: 0 },
            to: { transform: 'scale(1)', opacity: 1 }
        }
    },
    scaleOut: {
        duration: ANIMATION_DURATIONS.fast,
        easing: EASING_FUNCTIONS['ease-in-out'],
        keyframes: {
            from: { transform: 'scale(1)', opacity: 1 },
            to: { transform: 'scale(0.9)', opacity: 0 }
        }
    },
    spin: {
        duration: 1000,
        easing: 'linear',
        keyframes: {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' }
        }
    },
    pulse: {
        duration: 2000,
        easing: EASING_FUNCTIONS['ease-in-out'],
        keyframes: {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 }
        }
    },
    bounce: {
        duration: 1000,
        easing: EASING_FUNCTIONS['ease-bounce'],
        keyframes: {
            '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
            '40%, 43%': { transform: 'translateY(-8px)' },
            '70%': { transform: 'translateY(-4px)' },
            '90%': { transform: 'translateY(-2px)' }
        }
    }
};
// Animation utilities
export class AnimationUtils {
    /**
     * Check if user prefers reduced motion
     */
    static prefersReducedMotion() {
        if (typeof window === 'undefined')
            return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    /**
     * Get animation duration based on user preferences
     */
    static getAnimationDuration(duration) {
        return this.prefersReducedMotion() ? 0 : duration;
    }
    /**
     * Create animation with reduced motion support
     */
    static createAnimation(element, keyframes, options) {
        if (this.prefersReducedMotion()) {
            // Apply final state immediately for reduced motion
            const finalFrame = keyframes[keyframes.length - 1];
            if (finalFrame && element instanceof HTMLElement) {
                Object.assign(element.style, finalFrame);
            }
            return null;
        }
        return element.animate(keyframes, {
            ...options,
            duration: this.getAnimationDuration(options.duration)
        });
    }
    /**
     * Apply responsive animation based on screen size
     */
    static applyResponsiveAnimation(element, animations, breakpoints) {
        const screenWidth = window.innerWidth;
        let config;
        if (screenWidth >= breakpoints.desktop && animations.desktop) {
            config = animations.desktop;
        }
        else if (screenWidth >= breakpoints.tablet && animations.tablet) {
            config = animations.tablet;
        }
        else {
            config = animations.mobile || {};
        }
        if (!config.duration || !config.easing)
            return null;
        const keyframes = [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ];
        return this.createAnimation(element, keyframes, {
            duration: config.duration,
            easing: config.easing,
            delay: config.delay || 0,
            fill: config.fillMode || 'forwards'
        });
    }
    /**
     * Stagger animations for multiple elements
     */
    static staggerAnimation(elements, baseAnimation, staggerDelay = 100) {
        return elements.map((element, index) => {
            const keyframes = [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ];
            return this.createAnimation(element, keyframes, {
                duration: baseAnimation.duration,
                easing: baseAnimation.easing,
                delay: (baseAnimation.delay || 0) + (index * staggerDelay),
                fill: 'forwards'
            });
        }).filter(Boolean);
    }
    /**
     * Create entrance animation
     */
    static createEntranceAnimation(element, type = 'fadeIn', options) {
        const preset = ANIMATION_PRESETS[type];
        const keyframes = Object.entries(preset.keyframes).map(([key, value]) => ({
            offset: key === 'from' ? 0 : key === 'to' ? 1 : parseFloat(key.replace('%', '')) / 100,
            ...value
        }));
        return this.createAnimation(element, keyframes, {
            duration: preset.duration,
            easing: preset.easing,
            fill: 'forwards',
            ...options
        });
    }
    /**
     * Create exit animation
     */
    static createExitAnimation(element, type = 'fadeOut', options) {
        const preset = ANIMATION_PRESETS[type];
        const keyframes = Object.entries(preset.keyframes).map(([key, value]) => ({
            offset: key === 'from' ? 0 : key === 'to' ? 1 : parseFloat(key.replace('%', '')) / 100,
            ...value
        }));
        return this.createAnimation(element, keyframes, {
            duration: preset.duration,
            easing: preset.easing,
            fill: 'forwards',
            ...options
        });
    }
    /**
     * Create hover animation
     */
    static createHoverAnimation(element) {
        if (this.prefersReducedMotion())
            return;
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
            element.style.transition = `transform ${ANIMATION_DURATIONS.fast}ms ${EASING_FUNCTIONS['ease-out']}`;
        });
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    }
    /**
     * Create focus animation
     */
    static createFocusAnimation(element) {
        if (this.prefersReducedMotion())
            return;
        element.addEventListener('focus', () => {
            element.style.transform = 'scale(1.02)';
            element.style.transition = `transform ${ANIMATION_DURATIONS.fast}ms ${EASING_FUNCTIONS['ease-out']}`;
        });
        element.addEventListener('blur', () => {
            element.style.transform = 'scale(1)';
        });
    }
}
// Svelte action for animations
export function animate(element, config = {}) {
    const { type = 'fadeIn', duration, easing, delay = 0, trigger = 'immediate', threshold = 0.1 } = config;
    function runAnimation() {
        const preset = ANIMATION_PRESETS[type];
        AnimationUtils.createEntranceAnimation(element, type, {
            duration: duration || preset.duration,
            easing: easing || preset.easing,
            delay
        });
    }
    if (trigger === 'immediate') {
        setTimeout(runAnimation, 0);
    }
    else if (trigger === 'intersection' && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    runAnimation();
                    observer.disconnect();
                }
            });
        }, { threshold });
        observer.observe(element);
        return {
            destroy() {
                observer.disconnect();
            }
        };
    }
    return {
        destroy() {
            // Cleanup if needed
        }
    };
}
