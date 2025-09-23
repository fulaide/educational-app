/**
 * Layout Context
 * Svelte context for sharing layout state across components
 */
import type { LayoutContextValue } from '../AppLayout/AppLayout.types.js';
/**
 * Create layout context with reactive state management
 */
export declare function createLayoutContext(initialState?: {
    sidebarCollapsed?: boolean;
    sidebarPersistent?: boolean;
    showSidebarOnMobile?: boolean;
    theme?: {
        name: string;
        isDark: boolean;
    };
}): {
    contextValue: LayoutContextValue;
    cleanup: () => void;
};
/**
 * Set layout context in component tree
 */
export declare function setLayoutContext(context: ReturnType<typeof createLayoutContext>): {
    contextValue: LayoutContextValue;
    cleanup: () => void;
};
/**
 * Get layout context from component tree
 */
export declare function getLayoutContext(): LayoutContextValue;
/**
 * Optional hook-style getter that returns null if context doesn't exist
 */
export declare function useLayoutContext(): LayoutContextValue | null;
