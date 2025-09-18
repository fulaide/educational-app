/**
 * Layout Context
 * Svelte context for sharing layout state across components
 */

import { getContext, setContext } from 'svelte';
import type { LayoutContextValue, SidebarState, DrawerState, Breakpoint } from '../AppLayout/AppLayout.types.js';
import { createBreakpointStore } from './breakpoints.js';

const LAYOUT_CONTEXT_KEY = Symbol('layout-context');

/**
 * Create layout context with reactive state management
 */
export function createLayoutContext(initialState?: {
  sidebarCollapsed?: boolean;
  sidebarPersistent?: boolean;
  theme?: { name: string; isDark: boolean };
}) {
  // Initialize breakpoint detection
  const breakpointStore = createBreakpointStore();
  
  // Reactive breakpoint state for use with $effect
  const breakpointState = $state({
    current: breakpointStore.current as Breakpoint,
    isMobile: breakpointStore.isMobile,
    isTablet: breakpointStore.isTablet,
    isDesktop: breakpointStore.isDesktop
  });
  
  // Update reactive state when breakpoint changes
  const unsubscribeBreakpoint = breakpointStore.subscribe(() => {
    breakpointState.current = breakpointStore.current;
    breakpointState.isMobile = breakpointStore.isMobile;
    breakpointState.isTablet = breakpointStore.isTablet;
    breakpointState.isDesktop = breakpointStore.isDesktop;
  });
  
  // Sidebar state management (using runes for reactivity within component context)
  const sidebarState = $state<SidebarState>({
    isOpen: !initialState?.sidebarCollapsed,
    isCollapsed: initialState?.sidebarCollapsed ?? false,
    isPersistent: initialState?.sidebarPersistent ?? true,
    width: {
      expanded: 280,
      collapsed: 64
    }
  });
  
  // Drawer state management (using runes for reactivity within component context)
  const drawerState = $state<DrawerState>({
    isOpen: false,
    content: null,
    size: 'medium'
  });
  
  // Theme state (using runes for reactivity within component context)
  const themeState = $state({
    name: initialState?.theme?.name ?? 'default',
    isDark: initialState?.theme?.isDark ?? false
  });
  
  // Sidebar controls
  const sidebarControls = {
    toggle: () => {
      if (breakpointState.isMobile) {
        sidebarState.isOpen = !sidebarState.isOpen;
      } else {
        sidebarState.isCollapsed = !sidebarState.isCollapsed;
      }
      persistSidebarState();
    },
    
    open: () => {
      sidebarState.isOpen = true;
      if (!breakpointState.isMobile) {
        sidebarState.isCollapsed = false;
      }
      persistSidebarState();
    },
    
    close: () => {
      if (breakpointState.isMobile) {
        sidebarState.isOpen = false;
      } else {
        sidebarState.isCollapsed = true;
      }
      persistSidebarState();
    },
    
    collapse: () => {
      if (!breakpointState.isMobile) {
        sidebarState.isCollapsed = true;
        persistSidebarState();
      }
    },
    
    expand: () => {
      sidebarState.isCollapsed = false;
      sidebarState.isOpen = true;
      persistSidebarState();
    },
    
    setPersistent: (persistent: boolean) => {
      sidebarState.isPersistent = persistent;
      persistSidebarState();
    }
  };
  
  // Drawer controls
  const drawerControls = {
    open: (content?: string, size: DrawerState['size'] = 'medium') => {
      drawerState.isOpen = true;
      drawerState.content = content ?? null;
      drawerState.size = size;
    },
    
    close: () => {
      drawerState.isOpen = false;
      drawerState.content = null;
    },
    
    toggle: () => {
      if (drawerState.isOpen) {
        drawerControls.close();
      } else {
        drawerControls.open();
      }
    }
  };
  
  // Persistence helpers
  function persistSidebarState() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.setItem('layout:sidebar:collapsed', String(sidebarState.isCollapsed));
      localStorage.setItem('layout:sidebar:persistent', String(sidebarState.isPersistent));
    } catch (error) {
      console.warn('Failed to persist sidebar state:', error);
    }
  }
  
  function loadSidebarState() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const collapsed = localStorage.getItem('layout:sidebar:collapsed');
      const persistent = localStorage.getItem('layout:sidebar:persistent');
      
      if (collapsed !== null) {
        sidebarState.isCollapsed = collapsed === 'true';
        sidebarState.isOpen = !sidebarState.isCollapsed;
      }
      
      if (persistent !== null) {
        sidebarState.isPersistent = persistent === 'true';
      }
    } catch (error) {
      console.warn('Failed to load sidebar state:', error);
    }
  }
  
  // Auto-adjust sidebar based on breakpoint changes
  $effect(() => {
    if (breakpointState.isMobile) {
      // On mobile, sidebar should be closed by default
      sidebarState.isOpen = false;
      sidebarState.isCollapsed = false; // Collapsed state doesn't apply to mobile
    } else {
      // On desktop/tablet, restore persisted state
      loadSidebarState();
    }
  });
  
  // Create the context value
  const contextValue: LayoutContextValue = {
    // Breakpoint information
    get breakpoint() {
      return breakpointState.current;
    },
    get isMobile() {
      return breakpointState.isMobile;
    },
    get isTablet() {
      return breakpointState.isTablet;
    },
    get isDesktop() {
      return breakpointState.isDesktop;
    },
    
    // Sidebar state and controls
    sidebar: {
      get isOpen() {
        return sidebarState.isOpen;
      },
      get isCollapsed() {
        return sidebarState.isCollapsed;
      },
      get isPersistent() {
        return sidebarState.isPersistent;
      },
      get width() {
        return sidebarState.width;
      },
      ...sidebarControls
    },
    
    // Drawer state and controls
    drawer: {
      get isOpen() {
        return drawerState.isOpen;
      },
      get content() {
        return drawerState.content;
      },
      get size() {
        return drawerState.size;
      },
      ...drawerControls
    },
    
    // Theme integration
    theme: {
      get name() {
        return themeState.name;
      },
      get isDark() {
        return themeState.isDark;
      }
    }
  };
  
  return {
    contextValue,
    cleanup: () => {
      unsubscribeBreakpoint();
      breakpointStore.destroy();
    }
  };
}

/**
 * Set layout context in component tree
 */
export function setLayoutContext(context: ReturnType<typeof createLayoutContext>) {
  setContext(LAYOUT_CONTEXT_KEY, context.contextValue);
  return context;
}

/**
 * Get layout context from component tree
 */
export function getLayoutContext(): LayoutContextValue {
  const context = getContext<LayoutContextValue>(LAYOUT_CONTEXT_KEY);
  
  if (!context) {
    throw new Error(
      'Layout context not found. Make sure to wrap your app with <AppLayout> component.'
    );
  }
  
  return context;
}

/**
 * Optional hook-style getter that returns null if context doesn't exist
 */
export function useLayoutContext(): LayoutContextValue | null {
  try {
    return getLayoutContext();
  } catch {
    return null;
  }
}