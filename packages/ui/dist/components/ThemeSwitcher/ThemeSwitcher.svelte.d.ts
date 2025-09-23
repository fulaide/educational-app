import { type ThemeName } from '../../utils/theme-manager.js';
interface Props {
    /** CSS class for styling */
    class?: string;
    /** Show theme names or just colors */
    showNames?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Default theme to initialize with */
    defaultTheme?: ThemeName;
}
declare const ThemeSwitcher: import("svelte").Component<Props, {}, "">;
type ThemeSwitcher = ReturnType<typeof ThemeSwitcher>;
export default ThemeSwitcher;
