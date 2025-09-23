<script lang="ts">
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import type { SidebarItemProps } from './Sidebar.types.js';
  
  interface Props extends SidebarItemProps {}
  
  let {
    id,
    label,
    href,
    icon,
    badge,
    children = [],
    isActive = false,
    isDisabled = false,
    level = 0,
    isCollapsed = false,
    isMobile = false,
    onClick
  }: Props = $props();

  // Get layout context for theme and state management
  const layout = getLayoutContext();
  
  // Local state for child menu expansion
  let isExpanded = $state(false);
  let hasChildren = $derived(children && children.length > 0);
  
  // Handle item click
  function handleClick(event: MouseEvent) {
    event.preventDefault();
    
    if (isDisabled) return;
    
    // If has children, toggle expansion
    if (hasChildren && !href) {
      isExpanded = !isExpanded;
      return;
    }
    
    // Navigate if has href
    if (href) {
      window.location.href = href;
    }
    
    // Call custom onClick handler
    onClick?.();
    
    // Close mobile sidebar after navigation
    if (isMobile && layout.sidebar.isOpen) {
      layout.sidebar.close();
    }
  }
  
  // Handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event as any);
    }
    
    if (event.key === 'ArrowRight' && hasChildren && !isExpanded) {
      isExpanded = true;
    }
    
    if (event.key === 'ArrowLeft' && hasChildren && isExpanded) {
      isExpanded = false;
    }
  }
  
  // Dynamic classes
  let itemClasses = $derived.by(() => {
    const classes = [
      'sidebar-item',
      'group',
      'relative',
      'flex',
      'items-center',
      'w-full',
      'text-left',
      'transition-all',
      'duration-200',
      'ease-out'
    ];
    
    // State classes
    if (isActive) classes.push('active');
    if (isDisabled) classes.push('disabled', 'opacity-50', 'cursor-not-allowed');
    else classes.push('hover:bg-sidebar-item-hover', 'cursor-pointer');
    
    // Spacing based on level and collapsed state
    if (isCollapsed && level === 0) {
      classes.push('justify-center flex-col', 'p-3', 'mx-2', 'rounded-lg');
    } else {
      classes.push('px-4', 'py-3');
      if (level > 0) classes.push(`pl-${4 + level * 4}`);
    }
    
    return classes.join(' ');
  });
  
  let iconClasses = $derived.by(() => {
    const classes = [
      'sidebar-item-icon',
      'flex-shrink-0',
      'w-5', 'h-5',
      'transition-colors',
      'duration-200'
    ];
    
    if (isActive) classes.push('text-sidebar-item-icon-active');
    else classes.push('text-sidebar-item-icon', 'group-hover:text-sidebar-item-icon-hover');
    
    if (isCollapsed && level === 0) {
      classes.push('w-6', 'h-6');
    }
    
    return classes.join(' ');
  });
  
  let textClasses = $derived.by(() => {
    const classes = [
      'sidebar-item-text',
      'flex-1',
      'font-medium',
      'text-sm',
      'transition-colors',
      'duration-200'
    ];
    
    if (isActive) classes.push('text-sidebar-item-text-active');
    else classes.push('text-sidebar-item-text', 'group-hover:text-sidebar-item-text-hover');
    
    return classes.join(' ');
  });
</script>

<!-- Main navigation item -->
<li class="sidebar-item-wrapper">
  <button
    type="button"
    class={itemClasses}
    onclick={handleClick}
    onkeydown={handleKeyDown}
    disabled={isDisabled}
    aria-expanded={hasChildren ? isExpanded : undefined}
    aria-current={isActive ? 'page' : undefined}
    title={isCollapsed && level === 0 ? label : undefined}
  >
    <!-- Icon -->
    {#if icon}
      <span class={iconClasses} aria-hidden="true">
        {#if typeof icon === 'string'}
          <!-- Check if it's an emoji (single character or common emoji patterns) -->
          {#if icon.length <= 2 && !icon.includes('-') && !icon.includes(' ')}
            <!-- Emoji icon -->
            <span class="text-lg leading-none">{icon}</span>
          {:else}
            <!-- CSS class icon -->
            <i class={icon}></i>
          {/if}
        {:else}
          <!-- Custom icon content -->
          {@render icon()}
        {/if}
      </span>
    {/if}
    
    <!-- Text content (hidden when collapsed at top level) -->
    {#if !isCollapsed || level > 0}
      <span class={textClasses}>
        {label}
      </span>
      
      <!-- Badge -->
      {#if badge}
        <span class="sidebar-item-badge ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
          {badge}
        </span>
      {/if}
      
      <!-- Expand/collapse arrow for items with children -->
      {#if hasChildren}
        <span 
          class="sidebar-item-arrow ml-2 w-4 h-4 transition-transform duration-200 {isExpanded ? 'rotate-90' : ''}"
          aria-hidden="true"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      {/if}
    {/if}
  </button>
  
  <!-- Tooltip for collapsed items -->
  {#if isCollapsed && level === 0}
    <div class="sidebar-tooltip absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-tooltip text-tooltip-foreground text-sm rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
      {label}
      {#if badge}
        <span class="ml-2 px-1.5 py-0.5 text-xs rounded bg-primary text-primary-foreground">
          {badge}
        </span>
      {/if}
    </div>
  {/if}
  
  <!-- Child items -->
  {#if hasChildren && isExpanded && (!isCollapsed || level > 0)}
    <ul class="sidebar-children ml-4 mt-1 space-y-1 border-l border-sidebar-border">
      {#each children as child (child.id)}
        <svelte:self
          {...child}
          level={level + 1}
          {isCollapsed}
          {isMobile}
          onClick={() => child.onClick?.()}
        />
      {/each}
    </ul>
  {/if}
</li>

<style>
  /* Sidebar item styles integrated with theme system */
  :global(.sidebar-item) {
    /* Base styling handled by Tailwind classes and theme variables */
  }
  
  :global(.sidebar-item.active) {
    background-color: var(--sidebar-item-active-bg, rgb(59 130 246 / 0.1));
    color: var(--sidebar-item-active-text, rgb(59 130 246));
  }
  
  :global(.sidebar-item:focus-visible) {
    outline: 2px solid var(--focus-ring, rgb(59 130 246));
    outline-offset: -2px;
  }
  
  /* Smooth animations */
  :global(.sidebar-children) {
    animation: slideDown 200ms ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :global(.sidebar-item) {
      border: 1px solid transparent;
    }
    
    :global(.sidebar-item:hover),
    :global(.sidebar-item.active) {
      border-color: currentColor;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    :global(.sidebar-item),
    :global(.sidebar-item-arrow),
    :global(.sidebar-tooltip),
    :global(.sidebar-children) {
      transition: none;
      animation: none;
    }
  }
</style>