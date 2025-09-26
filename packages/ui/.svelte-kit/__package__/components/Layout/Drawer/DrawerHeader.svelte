<script lang="ts">
  import { Button } from '../../../index.js';
  import { X } from 'lucide-svelte';
  import type { DrawerHeaderProps } from './Drawer.types.js';
  
  interface Props extends DrawerHeaderProps {}
  
  let {
    title,
    showCloseButton = true,
    onClose,
    actions = [],
    class: className = ''
  }: Props = $props();
  
  // Simplified icon resolution - expects component or null
  function getIconComponent(icon: any) {
    if (!icon) return null;
    
    // If it's already a Svelte component or function, return it
    if (typeof icon === 'object' && icon.$render) return icon;
    if (typeof icon === 'function') return icon;
    
    return null;
  }
  
  // Handle action clicks
  function handleActionClick(action: any) {
    if (action.href && typeof window !== 'undefined') {
      window.location.href = action.href;
    }
    action.onClick?.();
  }
  
  // Dynamic header classes
  let headerClasses = $derived.by(() => {
    const classes = [
      'drawer-header',
      'flex',
      'items-center',
      'justify-between',
      'min-h-[60px]',
      'px-4',
      'py-3',
      'bg-gray-100/20',
      'backdrop-blur-sm',
      'border-b',
      'border-gray-500/20',
      'flex-shrink-0'
    ];
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  });
</script>

<!-- Drawer Header -->
<header class={headerClasses}>
  <!-- Title Section -->
  <div class="drawer-header-title flex-1 min-w-0">
    {#if title}
      <h2 class="text-lg font-semibold text-foreground truncate">
        {title}
      </h2>
    {/if}
  </div>
  
  <!-- Actions Section -->
  <div class="drawer-header-actions flex items-center space-x-2">
    <!-- Custom Actions -->
    {#if actions.length > 0}
      {#each actions as action (action.id)}
        <Button
          variant="ghost"
          size="sm"
          disabled={action.isDisabled}
          onclick={() => handleActionClick(action)}
          class="drawer-header-action {action.icon ? " flex gap-2 items-center" : ""}"
        >
          {#snippet children()}
            <!-- Action Icon -->
            {#if action.icon}
              {@const IconComponent = getIconComponent(action.icon)}
              {#if IconComponent}
                <IconComponent class="w-4 h-4 flex-shrink-0" />
              {/if}
            {/if}
            
            <!-- Action Label -->
            <span>{action.label}</span>
            
            <!-- Badge -->
            {#if action.badge}
              <span class="drawer-header-action-badge px-1.5 py-0.5 text-xs font-semibold rounded bg-primary text-primary-foreground">
                {action.badge}
              </span>
            {/if}
          {/snippet}
        </Button>
      {/each}
    {/if}
    
    <!-- Close Button -->
    {#if showCloseButton && !onClose}
      <!-- Spacer when no close handler but button should show -->
      <div class="w-8 h-8"></div>
    {:else if showCloseButton && onClose}
      <Button
        variant="ghost"
        size="sm"
        onclick={onClose}
        class="drawer-close-button p-2"
      >
        {#snippet children()}
          <X class="w-5 h-5" />
          <span class="sr-only">Close drawer</span>
        {/snippet}
      </Button>
    {/if}
  </div>
</header>

<style>
  /* Drawer header styles */
  /* .drawer-header {
    background-color: var(--background);
    border-bottom-color: var(--border);
  } */
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .drawer-header {
      border-bottom-width: 2px;
    }
  }
  
  /* Print styles */
  @media print {
    .drawer-header {
      border-bottom: 1px solid var(--border);
      background: transparent;
    }
    
    .drawer-header :global(.drawer-header-action),
    .drawer-header :global(.drawer-close-button) {
      display: none;
    }
  }
  
  /* Mobile optimizations */
  @media (max-width: 640px) {
    .drawer-header {
      min-height: 56px;
      padding: 0.75rem 1rem;
    }
    
    .drawer-header-title h2 {
      font-size: 1rem;
    }
  }
</style>