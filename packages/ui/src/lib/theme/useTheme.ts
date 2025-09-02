import { getContext } from 'svelte';
import type { ThemeType } from './ThemeProvider.svelte';

interface ThemeContext {
	current: ThemeType;
	setTheme: (theme: ThemeType) => void;
}

/**
 * Hook to access the current theme context
 * Must be called within a component that's wrapped by ThemeProvider
 */
export function useTheme(): ThemeContext {
	const context = getContext<ThemeContext>('theme');
	
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	
	return context;
}