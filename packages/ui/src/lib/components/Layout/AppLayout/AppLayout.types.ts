/**
 * Layout System Types
 * TypeScript definitions for the responsive dashboard layout system
 */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface BreakpointConfig {
  mobile: number;    // 0px
  tablet: number;    // 768px  
  desktop: number;   // 1024px
  wide: number;      // 1440px
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
  // Breakpoint information
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Mobile configuration
  showSidebarOnMobile: boolean;
  
  // Sidebar state and controls
  sidebar: SidebarState & {
    toggle: () => void;
    open: () => void;
    close: () => void;
    collapse: () => void;
    expand: () => void;
    setPersistent: (persistent: boolean) => void;
  };
  
  // Drawer state and controls
  drawer: DrawerState & {
    open: (content?: string, size?: DrawerState['size']) => void;
    close: () => void;
    toggle: () => void;
  };
  
  // Theme integration
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
  icon?: string | any; // Support both string icons and Svelte component icons
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

// Event types for layout interactions
export interface LayoutEvents {
  sidebarToggle: { isOpen: boolean; isCollapsed: boolean };
  drawerToggle: { isOpen: boolean; content: string | null };
  breakpointChange: { breakpoint: Breakpoint; previous: Breakpoint };
}

// Storage keys for persistence
export const LAYOUT_STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'layout:sidebar:collapsed',
  SIDEBAR_PERSISTENT: 'layout:sidebar:persistent',
  THEME_PREFERENCE: 'layout:theme:preference',
} as const;