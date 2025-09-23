<script lang="ts">
  import { createLayoutContext, setLayoutContext } from '../utils/layoutContext.svelte.js';
  import type { AppLayoutProps } from './AppLayout.types.js';

  interface Props extends AppLayoutProps {
    children?: import('svelte').Snippet;
  }

  let {
    theme = 'auto',
    sidebarCollapsed = false,
    sidebarPersistent = true,
    class: className = '',
    showSidebarOnMobile = false,
    children
  }: Props = $props();

  // Initialize layout context with proper mobile responsive behavior
  const layoutContext = createLayoutContext({
    sidebarCollapsed: sidebarCollapsed ?? false,
    sidebarPersistent: sidebarPersistent ?? true,
    showSidebarOnMobile: showSidebarOnMobile ?? false,
    theme: {
      name: theme === 'auto' ? 'default' : theme,
      isDark: theme === 'dark'
    }
  });

  // Set context for child components
  setLayoutContext(layoutContext);

  // Responsive sidebar width and visibility logic  
  let sidebarWidth = $derived(() => {
    const context = layoutContext.contextValue;
    const isMobile = context.isMobile;
    const isCollapsed = context.sidebar.isCollapsed;
    
    let width;
    // Mobile logic: show if showSidebarOnMobile prop is true OR if mobile sidebar is opened via toggle
    if (isMobile) {
      const shouldShowOnMobile = showSidebarOnMobile || context.sidebar.isOpen;
      width = shouldShowOnMobile ? '280px' : '0px';
    } else {
      // Desktop gets collapsed/expanded behavior
      width = isCollapsed ? '64px' : '280px';
    }
    
    // console.log('AppLayout width debug:', { isMobile, showSidebarOnMobile, isCollapsed, width, windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR' });
    return width;
  });
  
  // Grid columns based on sidebar visibility
  let gridColumns = $derived(() => {
    const { isMobile } = layoutContext.contextValue;
    const width = sidebarWidth();
    
    // On mobile with sidebar hidden: single column
    if (isMobile && width === '0px') {
      return '1fr';
    }
    
    // Desktop or mobile with sidebar shown: two columns
    return `${width} 1fr`;
  });
</script>

<!-- RESPONSIVE CSS GRID LAYOUT -->
<div 
  class="h-full w-full overflow-hidden grid"
  style="display: grid; grid-template-columns: {gridColumns()}; grid-template-rows: 1fr; min-width: 100svw; max-width: 100dvw; max-height: 100dvh;"
>
  {#if children}
    {@render children()}
  {/if}
</div>