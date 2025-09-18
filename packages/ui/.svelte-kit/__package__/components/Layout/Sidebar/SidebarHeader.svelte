<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  children: Snippet;
  class?: string;
}

let {
  children,
  class: className = '',
  ...restProps
}: Props = $props();

let headerClasses = $derived.by(() => {
  const classes = [
    'sidebar-header',
    'flex',
    'items-center',
    'min-h-16',
    'h-16',
    'px-4',
    'border-b',
    'border-sidebar-border'
  ];

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
});
</script>

<div class={headerClasses} {...restProps}>
  {@render children()}
</div>