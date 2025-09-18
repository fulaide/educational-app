/**
 * Sidebar Component Types
 * TypeScript definitions for the responsive sidebar navigation
 */

import type { NavigationItem, NavigationSection } from '../AppLayout/AppLayout.types.js';

export interface SidebarProps {
  /**
   * Navigation items to display in the sidebar
   */
  navigation?: NavigationSection[];
  
  /**
   * Brand logo configuration
   */
  brand?: {
    name: string;
    logo?: string;
    href?: string;
    onClick?: () => void;
  };
  
  /**
   * Footer content (e.g., user profile, settings)
   */
  footer?: {
    user?: {
      name: string;
      email?: string;
      avatar?: string;
    };
    actions?: NavigationItem[];
  };
  
  /**
   * Custom CSS class
   */
  class?: string;
  
  /**
   * Whether to show the sidebar on mobile (overrides default behavior)
   */
  showOnMobile?: boolean;
  
  /**
   * Whether to show backdrop on mobile when sidebar is open
   */
  showBackdrop?: boolean;
  
  /**
   * Custom width for expanded sidebar (default: 280px)
   */
  expandedWidth?: number;
  
  /**
   * Custom width for collapsed sidebar (default: 64px)
   */
  collapsedWidth?: number;
  
  /**
   * Position of the sidebar
   */
  position?: 'left' | 'right';
  
  /**
   * Callback when navigation item is clicked
   */
  onNavigate?: (item: NavigationItem) => void;
  
  /**
   * Callback when mobile sidebar is opened/closed
   */
  onMobileToggle?: (isOpen: boolean) => void;
}

export interface SidebarItemProps extends NavigationItem {
  /**
   * Nesting level for indentation
   */
  level?: number;
  
  /**
   * Whether the sidebar is collapsed (for icon-only display)
   */
  isCollapsed?: boolean;
  
  /**
   * Whether this is a mobile view
   */
  isMobile?: boolean;
  
  /**
   * Click handler
   */
  onClick?: () => void;
}

export interface MobileNavProps {
  /**
   * Whether the mobile nav is open
   */
  isOpen: boolean;
  
  /**
   * Navigation items
   */
  navigation: NavigationSection[];
  
  /**
   * Brand configuration
   */
  brand?: SidebarProps['brand'];
  
  /**
   * Footer configuration
   */
  footer?: SidebarProps['footer'];
  
  /**
   * Callback when nav is closed
   */
  onClose: () => void;
  
  /**
   * Callback when navigation item is clicked
   */
  onNavigate?: (item: NavigationItem) => void;
}

// Animation states for sidebar
export type SidebarState = 'expanded' | 'collapsed' | 'hidden' | 'mobile-open';

// Touch gesture configuration for mobile
export interface TouchGestureConfig {
  threshold: number;      // Minimum swipe distance
  velocity: number;       // Minimum swipe velocity  
  direction: 'horizontal' | 'vertical';
  element: HTMLElement;
}