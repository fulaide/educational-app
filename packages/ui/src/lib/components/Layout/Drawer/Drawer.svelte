<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import type { DrawerProps, SwipeDirection, TouchEventData } from './Drawer.types.js';
  import DrawerFooter from './DrawerFooter.svelte';
  import DrawerHeader from './DrawerHeader.svelte';
  
  interface Props extends DrawerProps {
    children?: import('svelte').Snippet;
    header?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }
  
  let {
    isOpen = $bindable(false),
    open = $bindable(false),
    position = 'right',
    size = 'md',
    width,
    height,
    showBackdrop = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    enableSwipeGestures = true,
    swipeThreshold = 50,
    swipeVelocity = 0.3,
    blurBackdrop = true,
    class: className = '',
    title,
    showCloseButton = true,
    headerActions = [],
    persistent = false,
    zIndex = 50,
    animationDuration = 300,
    animationEasing = 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    padding = 'md',
    onOpen,
    onClose,
    onAnimationComplete,
    onSwipe,
    children,
    header,
    footer
  }: Props = $props();

  // Use a single internal state that syncs with both bindable props
  let drawerOpen = $state(open || isOpen);

  // Sync external changes to internal state
  $effect(() => {
    drawerOpen = open;
  });

  // Sync internal state back to both bindable props
  $effect(() => {
    if (drawerOpen !== isOpen) {
      isOpen = drawerOpen;
    }
    if (drawerOpen !== open) {
      open = drawerOpen;
    }
  });

  const layout = getLayoutContext();

  let drawerElement: HTMLDivElement;
  let backdropElement: HTMLDivElement;

  // Touch gesture state
  let touchData: TouchEventData | null = null;
  let isDragging = $state(false);
  let dragProgress = $state(0);

  // Reactive state
  let isMobile = $derived(layout.isMobile);
  
  // Size configurations
  const sizeConfig = {
    horizontal: {
      sm: '320px',
      md: '400px',
      lg: '500px',
      xl: '600px',
      full: '100vw'
    },
    vertical: {
      sm: '200px',
      md: '300px',
      lg: '400px',
      xl: '500px',
      full: '100vh'
    }
  };

  // Padding configurations
  const paddingConfig = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  // Calculate drawer dimensions
  let drawerDimensions = $derived.by(() => {
    const isHorizontal = position === 'left' || position === 'right';
    const sizeMap = isHorizontal ? sizeConfig.horizontal : sizeConfig.vertical;
    
    if (isHorizontal) {
      // For desktop horizontal drawers, we need to account for the positioning
      const drawerWidth = width || sizeMap[size];
      return {
        width: isMobile ? drawerWidth : drawerWidth,
        height: height || (isMobile ? '100vh' : 'calc(100vh - 2rem)'),
        maxWidth: isMobile ? '85vw' : undefined
      };
    } else {
      return {
        width: width || (isMobile ? '100vw' : 'calc(100vw - 2rem)'),
        height: height || sizeMap[size],
        maxHeight: isMobile ? '85vh' : undefined
      };
    }
  });
  
  // Style with CSS custom properties and proper positioning
  let drawerStyle = $derived.by(() => {
    const drawerWidth = drawerDimensions.width;
    let style = `z-index: 52; --drawer-width: ${drawerWidth}; width: var(--drawer-width); height: ${drawerDimensions.height}; max-width: ${drawerDimensions.maxWidth || 'none'}; max-height: ${drawerDimensions.maxHeight || 'none'};`;
    
    // Add proper positioning for right drawer on desktop
    if (!isMobile && position === 'right') {
      style += ` left: calc(100vw - var(--drawer-width) - 1rem);`;
    } else if (!isMobile && position === 'left') {
      style += ` right: calc(100vw - var(--drawer-width) - 1rem);`;
    }
    
    return style;
  });
  
  // Dynamic classes
  let backdropClasses = $derived.by(() => {
    const classes = [
      'drawer-backdrop',
      'fixed',
      'inset-0',
      'bg-gray-100/70'
    ];
    
    if (blurBackdrop) {
      classes.push('backdrop-blur-sm');
    }
    
    return classes.join(' ');
  });
  
  let drawerClasses = $derived.by(() => {
    const classes = [
      'drawer',
      'fixed',
      'flex',
      'flex-col'
    ];
    
    // Responsive styling: Desktop vs Mobile
    if (isMobile) {
      // Mobile: Full screen overlay with positioning
      classes.push(
        'bg-white/90',
        'backdrop-blur-md',
        'text-white'
      );
      
      // Mobile positioning
      if (position === 'right') {
        classes.push('right-0', 'top-0', 'bottom-0');
      } else if (position === 'left') {
        classes.push('left-0', 'top-0', 'bottom-0');
      } else if (position === 'top') {
        classes.push('top-0', 'left-0', 'right-0');
      } else if (position === 'bottom') {
        classes.push('bottom-0', 'left-0', 'right-0');
      }
    } else {
      // Desktop: Inset with rounded corners (like sidebar)
      classes.push(
        'inset-y-4',
        'rounded-2xl',
        // 'shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)]',
				'shadow-xl',
        'bg-white/90',
        'backdrop-blur-xl',
        'text-gray-600',
        'overflow-hidden',
				'border',
				'border-gray-500/20'
      );
      
      // Desktop positioning - use fixed positioning with CSS custom properties
      if (position === 'right') {
        classes.push('top-4', 'bottom-4', 'right-4');
      } else if (position === 'left') {
        classes.push('top-4', 'bottom-4', 'left-4');
      } else if (position === 'top') {
        classes.push('top-4', 'left-4', 'right-4');
      } else if (position === 'bottom') {
        classes.push('bottom-4', 'left-4', 'right-4');
      }
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  });
  
  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (persistent || !closeOnBackdropClick) return;
    
    if (event.target === backdropElement) {
      closeDrawer();
    }
  }
  
  // Handle escape key
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && closeOnEscape && drawerOpen && !persistent) {
      closeDrawer();
    }
  }

  // Close drawer
  function closeDrawer() {
    if (persistent) return;
    drawerOpen = false;
    onClose?.();
  }
  
  // Touch gesture handling
  function handleTouchStart(event: TouchEvent) {
    if (!enableSwipeGestures || persistent) return;
    
    const touch = event.touches[0];
    touchData = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      startTime: Date.now(),
      element: drawerElement
    };
  }
  
  function handleTouchMove(event: TouchEvent) {
    if (!touchData || !enableSwipeGestures) return;
    
    const touch = event.touches[0];
    touchData.currentX = touch.clientX;
    touchData.currentY = touch.clientY;
    
    const deltaX = touch.clientX - touchData.startX;
    const deltaY = touch.clientY - touchData.startY;
    const isHorizontal = position === 'left' || position === 'right';
    const primaryDelta = isHorizontal ? deltaX : deltaY;
    const secondaryDelta = isHorizontal ? Math.abs(deltaY) : Math.abs(deltaX);
    
    // Check if gesture is in the right direction
    const isValidDirection = 
      (position === 'left' && deltaX < 0) ||
      (position === 'right' && deltaX > 0) ||
      (position === 'top' && deltaY < 0) ||
      (position === 'bottom' && deltaY > 0);
    
    if (Math.abs(primaryDelta) > 10 && Math.abs(primaryDelta) > secondaryDelta && isValidDirection) {
      isDragging = true;
      event.preventDefault();
      
      // Calculate drag progress
      const maxDistance = isHorizontal ? drawerElement.offsetWidth : drawerElement.offsetHeight;
      dragProgress = Math.min(Math.abs(primaryDelta) / maxDistance, 1);
      
      // Apply transform during drag
      const transform = `translate${isHorizontal ? 'X' : 'Y'}(${primaryDelta}px)`;
      drawerElement.style.transform = transform;
      
      // Update backdrop opacity
      if (backdropElement) {
        backdropElement.style.opacity = String(1 - dragProgress * 0.5);
      }
      
      onSwipe?.(getSwipeDirection(deltaX, deltaY), dragProgress);
    }
  }
  
  function handleTouchEnd(event: TouchEvent) {
    if (!touchData || !isDragging) {
      touchData = null;
      return;
    }
    
    const deltaTime = Date.now() - touchData.startTime;
    const deltaX = touchData.currentX - touchData.startX;
    const deltaY = touchData.currentY - touchData.startY;
    const isHorizontal = position === 'left' || position === 'right';
    const primaryDelta = isHorizontal ? deltaX : deltaY;
    const velocity = Math.abs(primaryDelta) / deltaTime;
    
    // Reset transforms
    drawerElement.style.transform = '';
    if (backdropElement) {
      backdropElement.style.opacity = '';
    }
    
    // Determine if should close
    const shouldClose =
      Math.abs(primaryDelta) > swipeThreshold ||
      velocity > swipeVelocity;

    if (shouldClose && drawerOpen) {
      closeDrawer();
    }
    
    isDragging = false;
    dragProgress = 0;
    touchData = null;
  }
  
  function getSwipeDirection(deltaX: number, deltaY: number): SwipeDirection {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    }
    return deltaY > 0 ? 'down' : 'up';
  }
  
  // Focus management
  function manageFocus() {
    if (drawerOpen && drawerElement) {
      // Focus first interactive element
      const firstFocusable = drawerElement.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') as HTMLElement;
      firstFocusable?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }
  
  // Effects
  $effect(() => {
    manageFocus();
  });
  
  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  });
</script>

{#if drawerOpen}
  <!-- Backdrop -->
  {#if showBackdrop}
    <div
      bind:this={backdropElement}
      class={backdropClasses}
      style="z-index: 51;"
      onclick={handleBackdropClick}
      role="presentation"
      aria-hidden="true"
      transition:fade={{ duration: animationDuration }}
    ></div>
  {/if}
  
  <!-- Drawer Panel -->
  <div
    bind:this={drawerElement}
    class={drawerClasses}
    style={drawerStyle}
    role="dialog"
    aria-modal="true"
    aria-label={title || 'Drawer'}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    transition:fly={{ 
      x: position === 'right' ? 400 : position === 'left' ? -400 : 0,
      y: position === 'top' ? -300 : position === 'bottom' ? 300 : 0,
      duration: animationDuration 
    }}
    onintrostart={() => onOpen?.()}
    onintroend={() => onAnimationComplete?.(true)}
    onoutroend={() => onAnimationComplete?.(false)}
  >
    <!-- Header -->
    {#if header}
      {@render header()}
    {:else if title || showCloseButton || headerActions.length > 0}
      <DrawerHeader
        {title}
        {showCloseButton}
        onClose={persistent ? undefined : closeDrawer}
        actions={headerActions}
      />
    {/if}
    
    <!-- Content -->
    <div class="drawer-content flex-1 overflow-y-auto overscroll-contain {paddingConfig[padding]}">
      {#if children}
        {@render children()}
      {/if}
    </div>
    
    <!-- Footer -->
    {#if footer}
      <DrawerFooter>
        {@render footer()}
      </DrawerFooter>
    {/if}
  </div>
{/if}

<style>
  /* Drawer styles integrated with theme system */
  .drawer {
    /* Hardware acceleration for smooth animations */
    transform: translateZ(0);
    will-change: transform;
  }
  
  /* Custom scrollbar for drawer content */
  .drawer-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.3) transparent;
    scroll-behavior: smooth;
  }
  
  .drawer-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .drawer-content::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .drawer-content::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 3px;
  }
  
  .drawer-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.5);
  }
  
  /* Backdrop blur fallback */
  /* .drawer-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
   */
  @supports (backdrop-filter: blur(8px)) {
    .drawer-backdrop.backdrop-blur-sm {
      backdrop-filter: blur(8px);
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .drawer {
      border-width: 2px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .drawer,
    .drawer-backdrop {
      transition: none !important;
    }
  }
  
  /* Print styles */
  @media print {
    .drawer-backdrop {
      display: none;
    }
    
    .drawer {
      position: static;
      transform: none;
      box-shadow: none;
      border: 1px solid var(--border);
      max-width: 100%;
      max-height: auto;
    }
  }
  
  /* Safe area support for mobile */
  @supports (padding: max(0px)) {
    .drawer[style*="left: 0"] {
      padding-left: max(0px, env(safe-area-inset-left));
    }
    
    .drawer[style*="right: 0"] {
      padding-right: max(0px, env(safe-area-inset-right));
    }
    
    .drawer[style*="top: 0"] {
      padding-top: max(0px, env(safe-area-inset-top));
    }
    
    .drawer[style*="bottom: 0"] {
      padding-bottom: max(0px, env(safe-area-inset-bottom));
    }
  }
</style>