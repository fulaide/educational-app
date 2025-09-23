/**
 * Simple reactive breakpoint system for Svelte 5 runes
 */
const DEFAULT_BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
};
function getCurrentBreakpoint(width, breakpoints = DEFAULT_BREAKPOINTS) {
    if (width >= breakpoints.wide)
        return 'wide';
    if (width >= breakpoints.desktop)
        return 'desktop';
    if (width >= breakpoints.tablet)
        return 'tablet';
    return 'mobile';
}
/**
 * Create reactive breakpoint state using Svelte 5 runes
 */
export function createReactiveBreakpoint(breakpoints = DEFAULT_BREAKPOINTS) {
    // Initialize with server-safe defaults
    let width = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);
    let current = $derived(getCurrentBreakpoint(width, breakpoints));
    let isMobile = $derived(current === 'mobile');
    let isTablet = $derived(current === 'tablet');
    let isDesktop = $derived(current === 'desktop' || current === 'wide');
    let isWide = $derived(current === 'wide');
    // Set up resize listener
    if (typeof window !== 'undefined') {
        const handleResize = () => {
            width = window.innerWidth;
        };
        window.addEventListener('resize', handleResize, { passive: true });
        // Cleanup function
        const cleanup = () => {
            window.removeEventListener('resize', handleResize);
        };
        // Return cleanup for manual cleanup if needed
        return {
            get width() { return width; },
            get current() { return current; },
            get isMobile() { return isMobile; },
            get isTablet() { return isTablet; },
            get isDesktop() { return isDesktop; },
            get isWide() { return isWide; },
            cleanup
        };
    }
    // Server-side return (no cleanup needed)
    return {
        get width() { return width; },
        get current() { return current; },
        get isMobile() { return isMobile; },
        get isTablet() { return isTablet; },
        get isDesktop() { return isDesktop; },
        get isWide() { return isWide; },
        cleanup: () => { }
    };
}
