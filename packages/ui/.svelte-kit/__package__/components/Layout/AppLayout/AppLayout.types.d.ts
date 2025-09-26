/**
 * Layout System Types
 * TypeScript definitions for the responsive dashboard layout system
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';
export interface BreakpointConfig {
    mobile: number;
    tablet: number;
    desktop: number;
    wide: number;
}
export interface SidebarState {
    isOpen: boolean;
    isCollapsed: boolean;
    isPersistent: boolean;
    width: {
        expanded: number;
        collapsed: number;
    };
}
export interface DrawerState {
    isOpen: boolean;
    content: string | null;
    size: 'small' | 'medium' | 'large' | 'full';
}
export interface LayoutContextValue {
    breakpoint: Breakpoint;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    showSidebarOnMobile: boolean;
    sidebar: SidebarState & {
        toggle: () => void;
        open: () => void;
        close: () => void;
        collapse: () => void;
        expand: () => void;
        setPersistent: (persistent: boolean) => void;
    };
    drawer: DrawerState & {
        open: (content?: string, size?: DrawerState['size']) => void;
        close: () => void;
        toggle: () => void;
    };
    theme: {
        name: string;
        isDark: boolean;
    };
}
export interface AppLayoutProps {
    /**
     * Theme variant to apply
     */
    theme?: 'light' | 'dark' | 'auto';
    /**
     * Initial sidebar state
     */
    sidebarCollapsed?: boolean;
    /**
     * Whether sidebar should persist its state
     */
    sidebarPersistent?: boolean;
    /**
     * Custom CSS class for the layout container
     */
    class?: string;
    /**
     * Whether to show sidebar on mobile (default: false)
     */
    showSidebarOnMobile?: boolean;
    /**
     * Custom breakpoint configuration
     */
    breakpoints?: Partial<BreakpointConfig>;
    /**
     * Background image URL for the layout wrapper
     */
    backgroundImage?: string;
    /**
     * Custom background CSS class (default: 'bg-gray-100')
     */
    backgroundClass?: string;
}
export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    icon?: string | any;
    badge?: string | number;
    children?: NavigationItem[];
    isActive?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
}
export interface NavigationSection {
    title?: string;
    items: NavigationItem[];
}
export interface LayoutEvents {
    sidebarToggle: {
        isOpen: boolean;
        isCollapsed: boolean;
    };
    drawerToggle: {
        isOpen: boolean;
        content: string | null;
    };
    breakpointChange: {
        breakpoint: Breakpoint;
        previous: Breakpoint;
    };
}
export declare const LAYOUT_STORAGE_KEYS: {
    readonly SIDEBAR_COLLAPSED: "layout:sidebar:collapsed";
    readonly SIDEBAR_PERSISTENT: "layout:sidebar:persistent";
    readonly THEME_PREFERENCE: "layout:theme:preference";
};
