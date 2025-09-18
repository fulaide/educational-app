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

let footerClasses = $derived.by(() => {
  const classes = [
    'sidebar-footer',
    'px-4',
    'py-3',
    'min-h-20',
    'border-t',
    'border-sidebar-border'
  ];

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
});
</script>

<div class={footerClasses} {...restProps}>
  {@render children()}
</div>