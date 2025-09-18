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

  // Initialize layout context - SIMPLE VERSION
  const layoutContext = createLayoutContext({
    sidebarCollapsed,
    sidebarPersistent,
    theme: {
      name: theme === 'auto' ? 'default' : theme,
      isDark: theme === 'dark'
    }
  });

  // Set context for child components
  setLayoutContext(layoutContext);

  // Simple sidebar width
  let sidebarWidth = $derived(() => {
    const isCollapsed = layoutContext.contextValue.sidebar.isCollapsed;
    console.log('AppLayout: sidebarWidth calculation, isCollapsed:', isCollapsed);
    return isCollapsed ? '64px' : '280px';
  });
</script>

<!-- SIMPLE CSS GRID LAYOUT -->
<div 
  class="h-full w-full  overflow-hidden grid "
  style="display: grid; grid-template-columns: {sidebarWidth()} 1fr; grid-template-rows: 1fr; min-width: 100svw; max-width: 100dvw; max-height: 100dvh;"
>
  {#if children}
    {@render children()}
  {/if}
</div>