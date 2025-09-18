<script lang="ts">
  import type { DrawerHeaderProps } from './Drawer.types.js';
  
  interface Props extends DrawerHeaderProps {}
  
  let {
    title,
    showCloseButton = true,
    onClose,
    actions = [],
    class: className = ''
  }: Props = $props();
  
  // Handle action clicks
  function handleActionClick(action: any) {
    if (action.href && typeof window !== 'undefined') {
      window.location.href = action.href;
    }
    action.onClick?.();
  }
  
  // Handle keyboard navigation for actions
  function handleActionKeyDown(event: KeyboardEvent, action: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActionClick(action);
    }
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
      'bg-background',
      'border-b',
      'border-border',
      'flex-shrink-0'
    ];
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  });
</script>

<!-- Drawer Header -->
<header class={headerClasses} role="banner">
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
        <button
          type="button"
          class="drawer-header-action flex items-center space-x-1.5 px-2.5 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary {action.isDisabled ? 'opacity-50 cursor-not-allowed' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}"
          onclick={() => handleActionClick(action)}
          onkeydown={(e) => handleActionKeyDown(e, action)}
          disabled={action.isDisabled}
          aria-label={action.label}
          title={action.label}
        >
          <!-- Action Icon -->
          {#if action.icon}
            <span class="w-4 h-4 flex-shrink-0" aria-hidden="true">
              {#if typeof action.icon === 'string'}
                <i class={action.icon}></i>
              {:else}
                {@render action.icon()}
              {/if}
            </span>
          {/if}
          
          <!-- Action Label -->
          <span>{action.label}</span>
          
          <!-- Badge -->
          {#if action.badge}
            <span class="drawer-header-action-badge ml-1 px-1.5 py-0.5 text-xs font-semibold rounded bg-primary text-primary-foreground">
              {action.badge}
            </span>
          {/if}
        </button>
      {/each}
    {/if}
    
    <!-- Close Button -->
    {#if showCloseButton && !onClose}
      <!-- Spacer when no close handler but button should show -->
      <div class="w-8 h-8"></div>
    {:else if showCloseButton && onClose}
      <button
        type="button"
        class="drawer-close-button p-2 -m-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onclick={onClose}
        aria-label="Close drawer"
        title="Close drawer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>
</header>

<style>
  /* Drawer header styles */
  .drawer-header {
    /* Ensure proper contrast and spacing */
    background-color: var(--background);
    border-bottom-color: var(--border);
  }
  
  /* Focus styles for accessibility */
  .drawer-header-action:focus-visible,
  .drawer-close-button:focus-visible {
    outline: 2px solid var(--focus-ring, rgb(59 130 246));
    outline-offset: 2px;
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .drawer-header {
      border-bottom-width: 2px;
    }
    
    .drawer-header-action,
    .drawer-close-button {
      border: 1px solid transparent;
    }
    
    .drawer-header-action:hover,
    .drawer-close-button:hover {
      border-color: currentColor;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .drawer-header-action,
    .drawer-close-button {
      transition: none;
    }
  }
  
  /* Print styles */
  @media print {
    .drawer-header {
      border-bottom: 1px solid var(--border);
      background: transparent;
    }
    
    .drawer-header-action,
    .drawer-close-button {
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
    
    .drawer-header-action {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }
  }
</style>