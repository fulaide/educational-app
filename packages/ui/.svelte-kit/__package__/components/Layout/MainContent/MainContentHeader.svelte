<script lang="ts">
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import type { MainContentHeaderProps } from './MainContent.types.js';
  
  interface Props extends MainContentHeaderProps {
    children?: import('svelte').Snippet;
    actionsSnippet?: import('svelte').Snippet;
  }
  
  let {
    title,
    subtitle,
    showBackButton = false,
    onBackClick,
    actions: actionsList = [],
    class: className = '',
    children,
    actionsSnippet
  }: Props = $props();

  const layout = getLayoutContext();
  
  // Derived reactive state
  let isMobile = $derived(layout.isMobile);
  let sidebarIsOpen = $derived(layout.sidebar.isOpen);
  
  // Handle back navigation
  function handleBack() {
    if (onBackClick) {
      onBackClick();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  }
  
  // Handle mobile menu toggle
  function toggleMobileMenu() {
    layout.sidebar.toggle();
  }
  
  // Dynamic header classes
  let headerClasses = $derived.by(() => {
    const classes = [
      'main-content-header',
      'flex',
      'items-center',
      'justify-between',
      'min-h-[64px]',
      'px-4',
      'py-3',
      'bg-background',
      'border-b',
      'border-border',
      'transition-all',
      'duration-200'
    ];
    
    if (isMobile) {
      classes.push('sticky', 'top-0', 'z-30', 'backdrop-blur-sm', 'bg-background/95');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  });
  
  // Handle action clicks
  function handleActionClick(action: any) {
    if (action.href && typeof window !== 'undefined') {
      window.location.href = action.href;
    }
    action.onClick?.();
  }
  
  // Handle keyboard navigation
  function handleActionKeyDown(event: KeyboardEvent, action: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActionClick(action);
    }
  }
</script>

<!-- Main Content Header -->
<header class={headerClasses} role="banner">
  <!-- Left section: Navigation and title -->
  <div class="flex items-center space-x-4 flex-1 min-w-0">
    <!-- Mobile menu button -->
    {#if isMobile}
      <button
        type="button"
        class="mobile-menu-toggle p-2 -ml-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onclick={toggleMobileMenu}
        aria-label={sidebarIsOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={sidebarIsOpen}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if sidebarIsOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    {/if}
    
    <!-- Back button -->
    {#if showBackButton}
      <button
        type="button"
        class="back-button p-2 -ml-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onclick={handleBack}
        aria-label="Go back"
        title="Go back"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    {/if}
    
    <!-- Title and subtitle -->
    {#if title}
      <div class="flex flex-col min-w-0 flex-1">
        <h1 class="text-xl font-semibold text-foreground truncate">
          {title}
        </h1>
        {#if subtitle}
          <p class="text-sm text-muted-foreground truncate mt-0.5">
            {subtitle}
          </p>
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- Right section: Actions -->
  {#if actionsSnippet}
    <div class="flex items-center space-x-2">
      {@render actionsSnippet()}
    </div>
  {:else if actionsList.length > 0}
    <div class="flex items-center space-x-2">
      {#each actionsList as action (action.id)}
        <button
          type="button"
          class="header-action flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary {action?.isDisabled ? 'opacity-50 cursor-not-allowed' : 'text-foreground hover:bg-accent hover:text-accent-foreground'}"
          onclick={() => handleActionClick(action)}
          onkeydown={(e) => handleActionKeyDown(e, action)}
          disabled={action?.isDisabled}
          aria-label={action?.label}
          title={action?.label}
        >
          <!-- Action icon -->
          {#if action?.icon}
            <span class="w-4 h-4 flex-shrink-0" aria-hidden="true">
              {#if typeof action.icon === 'string'}
                <i class={action.icon}></i>
              {:else}
                {@render action.icon()}
              {/if}
            </span>
          {/if}
          
          <!-- Action label (hidden on mobile if icon present) -->
          <span class="{action?.icon && isMobile ? 'sr-only' : ''}">
            {action?.label}
          </span>
          
          <!-- Badge -->
          {#if action?.badge}
            <span class="header-action-badge ml-1 px-1.5 py-0.5 text-xs font-semibold rounded bg-primary text-primary-foreground">
              {action.badge}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
  
  <!-- Custom children content -->
  {#if children}
    {@render children()}
  {/if}
</header>

<style>
  /* Header specific styles */
  .main-content-header {
    /* Backdrop blur fallback for older browsers */
    background-color: var(--background);
  }
  
  /* Support for backdrop-filter */
  @supports (backdrop-filter: blur(8px)) {
    .main-content-header.backdrop-blur-sm {
      backdrop-filter: blur(8px);
      background-color: color-mix(in srgb, var(--background) 95%, transparent);
    }
  }
  
  /* Focus styles for accessibility */
  .mobile-menu-toggle:focus-visible,
  .back-button:focus-visible,
  .header-action:focus-visible {
    outline: 2px solid var(--focus-ring, rgb(59 130 246));
    outline-offset: 2px;
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .main-content-header {
      border-bottom-width: 2px;
    }
    
    .mobile-menu-toggle,
    .back-button,
    .header-action {
      border: 1px solid transparent;
    }
    
    .mobile-menu-toggle:hover,
    .back-button:hover,
    .header-action:hover {
      border-color: currentColor;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .main-content-header,
    .mobile-menu-toggle,
    .back-button,
    .header-action {
      transition: none;
    }
  }
  
  /* Print styles */
  @media print {
    .main-content-header {
      position: static;
      border-bottom: 1px solid var(--border);
      background: transparent;
      backdrop-filter: none;
    }
    
    .mobile-menu-toggle,
    .header-action {
      display: none;
    }
  }
</style>