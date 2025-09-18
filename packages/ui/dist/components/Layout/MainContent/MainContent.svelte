<script lang="ts">
  import type { MainContentProps } from './MainContent.types.js';
  
  interface Props extends MainContentProps {
    children?: import('svelte').Snippet;
  }
  
  let {
    children
  }: Props = $props();
</script>

<!-- SIMPLE MAIN CONTENT -->
<main class="h-screen bg-background overflow-y-auto">
  {#if children}
    {@render children()}
  {/if}
</main>