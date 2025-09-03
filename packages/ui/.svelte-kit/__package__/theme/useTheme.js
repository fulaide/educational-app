import { getContext } from 'svelte';
/**
 * Hook to access the current theme context
 * Must be called within a component that's wrapped by ThemeProvider
 */
export function useTheme() {
    const context = getContext('theme');
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
