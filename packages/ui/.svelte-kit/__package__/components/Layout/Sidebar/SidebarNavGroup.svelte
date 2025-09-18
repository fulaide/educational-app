<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  title?: string;
  isCollapsed?: boolean;
  children: Snippet;
  class?: string;
}

let {
  title,
  isCollapsed = false,
  children,
  class: className = '',
  ...restProps
}: Props = $props();

let groupClasses = $derived.by(() => {
  const classes = ['sidebar-nav-group', 'space-y-1'];

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
});

let titleClasses = $derived.by(() => {
  const classes = [
    'px-3',
    'text-xs',
    'font-semibold',
    'text-sidebar-foreground/60',
    'uppercase',
    'tracking-wider',
    'mb-2'
  ];

  if (isCollapsed) {
    classes.push('sr-only');
  }

  return classes.join(' ');
});
</script>

<div class={groupClasses} {...restProps}>
  {#if title && !isCollapsed}
    <div class={titleClasses}>
      {title}
    </div>
  {/if}
  
  <nav class="space-y-1">
    {@render children()}
  </nav>
</div>