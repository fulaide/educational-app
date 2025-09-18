<script lang="ts">
  import { onMount } from 'svelte';
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import SidebarItem from './SidebarItem.svelte';
  import type { MobileNavProps, TouchGestureConfig } from './Sidebar.types.js';
  
  interface Props extends MobileNavProps {
    // Snippet support for custom content injection
    headerContent?: import('svelte').Snippet;
    navigationContent?: import('svelte').Snippet;
    footerContent?: import('svelte').Snippet;
    beforeBrand?: import('svelte').Snippet;
    afterBrand?: import('svelte').Snippet;
    beforeNavigation?: import('svelte').Snippet;
    afterNavigation?: import('svelte').Snippet;
  }
  
  let {
    isOpen,
    navigation = [],
    brand,
    footer,
    onClose,
    onNavigate,
    // Snippet props
    headerContent,
    navigationContent,
    footerContent,
    beforeBrand,
    afterBrand,
    beforeNavigation,
    afterNavigation
  }: Props = $props();

  const layout = getLayoutContext();
  
  let overlayElement: HTMLDivElement;
  let sidebarElement: HTMLDivElement;
  
  // Touch gesture handling for swipe-to-close
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  
  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }
  
  function handleTouchMove(event: TouchEvent) {
    if (!isOpen) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // Prevent scrolling if horizontal swipe is detected
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      event.preventDefault();
    }
    
    // Apply real-time transform for swipe feedback
    if (deltaX < 0 && Math.abs(deltaX) > deltaY) {
      const progress = Math.min(Math.abs(deltaX) / 200, 1);
      if (sidebarElement) {
        sidebarElement.style.transform = `translateX(${deltaX}px)`;
        overlayElement.style.opacity = String(1 - progress * 0.5);
      }
    }
  }
  
  function handleTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = Math.abs(touch.clientY - touchStartY);
    const deltaTime = Date.now() - touchStartTime;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    // Reset transform
    if (sidebarElement) {
      sidebarElement.style.transform = '';
      overlayElement.style.opacity = '';
    }
    
    // Check for swipe-to-close gesture
    const isHorizontalSwipe = Math.abs(deltaX) > deltaY;
    const isLeftSwipe = deltaX < -50;
    const isFastSwipe = velocity > 0.3;
    
    if (isHorizontalSwipe && (isLeftSwipe || isFastSwipe)) {
      onClose();
    }
  }
  
  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === overlayElement) {
      onClose();
    }
  }
  
  // Handle escape key
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }
  
  // Focus management
  onMount(() => {
    if (isOpen) {
      // Focus the first interactive element
      const firstButton = sidebarElement?.querySelector('button:not([disabled])');
      if (firstButton instanceof HTMLElement) {
        firstButton.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  });
  
  // Navigation handler
  function handleNavigate(item: any) {
    onNavigate?.(item);
    onClose();
  }
</script>

<!-- Mobile Navigation Overlay -->
{#if isOpen}
  <div
    bind:this={overlayElement}
    class="mobile-nav-overlay fixed inset-0 z-50 flex"
    onclick={handleBackdropClick}
    onkeydown={handleKeyDown}
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
  >
    <!-- Backdrop -->
    <div 
      class="mobile-nav-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      class:opacity-100={isOpen}
      class:opacity-0={!isOpen}
    ></div>
    
    <!-- Sidebar Panel -->
    <div
      bind:this={sidebarElement}
      class="mobile-nav-panel relative flex flex-col w-80 max-w-[80vw] h-full bg-sidebar border-r border-sidebar-border shadow-xl transform transition-transform duration-300 ease-out"
      class:translate-x-0={isOpen}
      class:-translate-x-full={!isOpen}
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
    >
      <!-- Header with brand and close button -->
      <div class="mobile-nav-header flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar-header">
        {#if headerContent}
          <!-- Custom header content -->
          {@render headerContent()}
        {:else}
          <!-- Before brand snippet -->
          {#if beforeBrand}
            {@render beforeBrand()}
          {/if}
          
          <!-- Brand -->
          {#if brand}
            <div class="flex items-center space-x-3">
              {#if brand.logo}
                <img src={brand.logo} alt={brand.name} class="w-8 h-8" />
              {/if}
              <span class="font-semibold text-lg text-sidebar-header-text">{brand.name}</span>
            </div>
          {:else}
            <span class="font-semibold text-lg text-sidebar-header-text">Menu</span>
          {/if}
          
          <!-- After brand snippet -->
          {#if afterBrand}
            {@render afterBrand()}
          {/if}
          
          <!-- Close button -->
          <button
            type="button"
            class="mobile-nav-close p-2 -m-2 rounded-lg text-sidebar-header-text hover:bg-sidebar-header-hover transition-colors"
            onclick={onClose}
            aria-label="Close navigation"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
      
      <!-- Navigation content -->
      <div class="mobile-nav-content flex-1 overflow-y-auto">
        {#if navigationContent}
          <!-- Custom navigation content -->
          {@render navigationContent()}
        {:else}
          <nav class="p-4">
            <!-- Before navigation snippet -->
            {#if beforeNavigation}
              {@render beforeNavigation()}
            {/if}
            
            {#each navigation as section}
              <!-- Section title -->
              {#if section.title}
                <div class="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sidebar-section-title opacity-60">
                  {section.title}
                </div>
              {/if}
              
              <!-- Section items -->
              <ul class="space-y-1 {section.title ? 'mb-6' : ''}">
                {#each section.items as item (item.id)}
                  <SidebarItem
                    {...item}
                    isMobile={true}
                    onClick={() => handleNavigate(item)}
                  />
                {/each}
              </ul>
            {/each}
            
            <!-- After navigation snippet -->
            {#if afterNavigation}
              {@render afterNavigation()}
            {/if}
          </nav>
        {/if}
      </div>
      
      <!-- Footer -->
      {#if footerContent || footer}
        <div class="mobile-nav-footer border-t border-sidebar-border bg-sidebar-footer">
          {#if footerContent}
            <!-- Custom footer content -->
            {@render footerContent()}
          {:else if footer}
            <!-- User info -->
            {#if footer.user}
              <div class="flex items-center p-4">
                {#if footer.user.avatar}
                  <img 
                    src={footer.user.avatar} 
                    alt={footer.user.name}
                    class="w-10 h-10 rounded-full"
                  />
                {:else}
                  <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {footer.user.name.charAt(0).toUpperCase()}
                  </div>
                {/if}
                
                <div class="ml-3 flex-1 min-w-0">
                  <p class="text-sm font-medium text-sidebar-footer-text truncate">
                    {footer.user.name}
                  </p>
                  {#if footer.user.email}
                    <p class="text-xs text-sidebar-footer-text-secondary truncate">
                      {footer.user.email}
                    </p>
                  {/if}
                </div>
              </div>
            {/if}
            
            <!-- Footer actions -->
            {#if footer.actions}
              <ul class="pb-4">
                {#each footer.actions as action (action.id)}
                  <SidebarItem
                    {...action}
                    isMobile={true}
                    onClick={() => handleNavigate(action)}
                  />
                {/each}
              </ul>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Mobile navigation specific styles */
  .mobile-nav-overlay {
    /* Ensure it appears above other content */
    z-index: var(--z-sidebar, 40);
  }
  
  /* Swipe gesture visual feedback */
  .mobile-nav-panel {
    will-change: transform;
  }
  
  /* Safe area support for iOS */
  @supports (padding: max(0px)) {
    .mobile-nav-header {
      padding-top: max(1rem, env(safe-area-inset-top));
    }
    
    .mobile-nav-footer {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .mobile-nav-panel {
      border-width: 2px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .mobile-nav-panel,
    .mobile-nav-backdrop {
      transition: none;
    }
  }
  
  /* Focus styles */
  .mobile-nav-close:focus-visible {
    outline: 2px solid var(--focus-ring, rgb(59 130 246));
    outline-offset: 2px;
  }
</style>