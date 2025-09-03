import type { Snippet } from 'svelte';
export type ThemeType = 'student' | 'teacher' | 'parent' | 'admin';
interface Props {
    theme: ThemeType;
    children: Snippet;
}
declare const ThemeProvider: import("svelte").Component<Props, {}, "">;
type ThemeProvider = ReturnType<typeof ThemeProvider>;
export default ThemeProvider;
