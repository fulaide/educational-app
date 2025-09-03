import type { ThemeType } from './ThemeProvider.svelte';
interface ThemeContext {
    current: ThemeType;
    setTheme: (theme: ThemeType) => void;
}
/**
 * Hook to access the current theme context
 * Must be called within a component that's wrapped by ThemeProvider
 */
export declare function useTheme(): ThemeContext;
export {};
