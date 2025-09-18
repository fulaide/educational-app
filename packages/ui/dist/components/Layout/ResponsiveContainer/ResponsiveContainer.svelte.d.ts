import type { ResponsiveValue, ResponsiveAnimation } from '../utils/responsive.js';
interface Props {
    /**
     * Responsive grid configuration
     */
    grid?: ResponsiveValue<number>;
    /**
     * Grid gap spacing
     */
    gap?: ResponsiveValue<string>;
    /**
     * Auto-fit grid with minimum column width
     */
    autoFit?: boolean;
    minWidth?: string;
    /**
     * Container max width
     */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
    /**
     * Responsive padding
     */
    padding?: ResponsiveValue<string>;
    /**
     * Center content horizontally
     */
    center?: boolean;
    /**
     * Animation configuration
     */
    animations?: ResponsiveAnimation;
    /**
     * Stagger child animations
     */
    staggerChildren?: boolean;
    staggerDelay?: number;
    /**
     * Custom CSS class
     */
    class?: string;
    /**
     * Children content
     */
    children?: import('svelte').Snippet;
}
declare const ResponsiveContainer: import("svelte").Component<Props, {}, "">;
type ResponsiveContainer = ReturnType<typeof ResponsiveContainer>;
export default ResponsiveContainer;
