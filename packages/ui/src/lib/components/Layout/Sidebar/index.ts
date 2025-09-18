/**
 * Sidebar Components Export
 * Comprehensive responsive sidebar navigation system
 */

// Main Sidebar component
export { default as Sidebar } from './Sidebar.svelte';

// Mobile Navigation overlay component
export { default as MobileNav } from './MobileNav.svelte';

// Individual navigation item component
export { default as SidebarItem } from './SidebarItem.svelte';

// Modular sidebar components
export { default as SidebarHeader } from './SidebarHeader.svelte';
export { default as SidebarFooter } from './SidebarFooter.svelte';
export { default as SidebarNavGroup } from './SidebarNavGroup.svelte';
export { default as MenuItem } from './MenuItem.svelte';

// TypeScript definitions
export type {
  SidebarProps,
  SidebarItemProps,
  MobileNavProps,
  SidebarState,
  TouchGestureConfig
} from './Sidebar.types.js';