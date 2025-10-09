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
    'drawer-footer',
    'px-4',
    'py-3',
    'border-t',
    'border-gray-500/20',
    'bg-gray-100/20',
    'backdrop-blur-sm',
    'flex-shrink-0'
  ];

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
});
</script>

<footer class={footerClasses} {...restProps}>
  {@render children()}
</footer>