<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import DrawerHeader from './DrawerHeader.svelte';
  import DrawerFooter from './DrawerFooter.svelte';
  import type { DrawerProps, SwipeDirection, TouchEventData, DrawerAnimationState } from './Drawer.types.js';
  
  interface Props extends DrawerProps {
    children?: import('svelte').Snippet;
    header?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }
  
  let {
    isOpen = false,
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
    onOpen,
    onClose,
    onAnimationComplete,
    onSwipe,
    children,
    header,
    footer
  }: Props = $props();

  const layout = getLayoutContext();
  
  let drawerElement: HTMLDivElement;
  let backdropElement: HTMLDivElement;
  let animationState = $state<DrawerAnimationState>('closed');
  
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
  
  // Calculate drawer dimensions
  let drawerDimensions = $derived.by(() => {
    const isHorizontal = position === 'left' || position === 'right';
    const sizeMap = isHorizontal ? sizeConfig.horizontal : sizeConfig.vertical;
    
    if (isHorizontal) {
      return {
        width: width || sizeMap[size],
        height: height || '100vh',
        maxWidth: isMobile ? '85vw' : undefined
      };
    } else {
      return {
        width: width || '100vw',
        height: height || sizeMap[size],
        maxHeight: isMobile ? '85vh' : undefined
      };
    }
  });
  
  // Dynamic classes
  let backdropClasses = $derived.by(() => {
    const classes = [
      'drawer-backdrop',
      'fixed',
      'inset-0',
      'transition-opacity',
      'bg-black/50'
    ];
    
    if (blurBackdrop) {
      classes.push('backdrop-blur-sm');
    }
    
    if (isOpen) {
      classes.push('opacity-100');
    } else {
      classes.push('opacity-0', 'pointer-events-none');
    }
    
    return classes.join(' ');
  });
  
  let drawerClasses = $derived.by(() => {
    const classes = [
      'drawer',
      'fixed',
      'flex',
      'flex-col',
      'bg-background',
      'border',
      'border-border',
      'shadow-2xl',
      'transition-transform',
      'will-change-transform'
    ];
    
    // Position classes
    switch (position) {
      case 'left':
        classes.push('top-0', 'left-0', 'h-full', 'border-r');
        break;
      case 'right':
        classes.push('top-0', 'right-0', 'h-full', 'border-l');
        break;
      case 'top':
        classes.push('top-0', 'left-0', 'w-full', 'border-b');
        break;
      case 'bottom':
        classes.push('bottom-0', 'left-0', 'w-full', 'border-t');
        break;
    }
    
    // Transform classes based on open state
    if (!isOpen && !isDragging) {
      switch (position) {
        case 'left':
          classes.push('-translate-x-full');
          break;
        case 'right':
          classes.push('translate-x-full');
          break;
        case 'top':
          classes.push('-translate-y-full');
          break;
        case 'bottom':
          classes.push('translate-y-full');
          break;
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
    if (event.key === 'Escape' && closeOnEscape && isOpen && !persistent) {
      closeDrawer();
    }
  }
  
  // Close drawer
  function closeDrawer() {
    if (persistent) return;
    
    animationState = 'closing';
    onClose?.();
    
    // Wait for animation to complete
    setTimeout(() => {
      animationState = 'closed';
      onAnimationComplete?.(false);
    }, animationDuration);
  }
  
  // Open drawer
  function openDrawer() {
    animationState = 'opening';
    onOpen?.();
    
    setTimeout(() => {
      animationState = 'open';
      onAnimationComplete?.(true);
    }, animationDuration);
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
    
    if (shouldClose && isOpen) {
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
    if (isOpen && drawerElement) {
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
    if (isOpen) {
      openDrawer();
    } else {
      animationState = 'closed';
    }
    
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

{#if isOpen || animationState !== 'closed'}
  <!-- Backdrop -->
  {#if showBackdrop}
    <div
      bind:this={backdropElement}
      class={backdropClasses}
      style="z-index: {zIndex - 1}; transition-duration: {animationDuration}ms; transition-timing-function: {animationEasing};"
      onclick={handleBackdropClick}
      role="presentation"
      aria-hidden="true"
    ></div>
  {/if}
  
  <!-- Drawer Panel -->
  <div
    bind:this={drawerElement}
    class={drawerClasses}
    style="z-index: {zIndex}; transition-duration: {animationDuration}ms; transition-timing-function: {animationEasing}; width: {drawerDimensions.width}; height: {drawerDimensions.height}; max-width: {drawerDimensions.maxWidth || 'none'}; max-height: {drawerDimensions.maxHeight || 'none'};"
    role="dialog"
    aria-modal="true"
    aria-label={title || 'Drawer'}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
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
    <div class="drawer-content flex-1 overflow-y-auto">
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
    scrollbar-color: var(--scrollbar-thumb, rgba(0,0,0,0.2)) var(--scrollbar-track, transparent);
  }
  
  .drawer-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .drawer-content::-webkit-scrollbar-track {
    background: var(--scrollbar-track, transparent);
  }
  
  .drawer-content::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb, rgba(0,0,0,0.2));
    border-radius: 3px;
  }
  
  .drawer-content::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover, rgba(0,0,0,0.3));
  }
  
  /* Backdrop blur fallback */
  .drawer-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
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