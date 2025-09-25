<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createLayoutContext, setLayoutContext } from '../utils/layoutContext.svelte.js';

  interface Props {
    children?: import('svelte').Snippet;
    theme?: string;
    class?: string;
  }

  let { children, theme = 'auto', class: className = '' }: Props = $props();
  
  // Create layout context immediately (not onMount to support SSR)
  const layoutContext = createLayoutContext({
    sidebarCollapsed: false,
    sidebarPersistent: true,
    showSidebarOnMobile: false,
    theme: { name: theme, isDark: false }
  });
  
  setLayoutContext(layoutContext);
  
  onDestroy(() => {
    layoutContext.cleanup();
  });
</script>

<div class="wrapper bg-gray-100 mx-auto w-full flex font-family-primary {className}">
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .wrapper {
    background-repeat: no-repeat;
    background-size: cover;
  }

  :global(html, body) {
    background-color: var(--color-gray-100);
  }
</style>