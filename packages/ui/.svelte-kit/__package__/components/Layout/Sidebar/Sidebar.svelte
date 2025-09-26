<script lang="ts">
  import { PanelRightClose, PanelRightOpen } from 'lucide-svelte';
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  
  interface Props {
    navigation?: Array<{
      title?: string;
      items?: Array<{
        id: string;
        label: string;
        icon?: any;
        isActive?: boolean;
        badge?: string | number;
        href?: string;
      }>;
    }>;
    brand?: {
      name: string;
      logo?: string;
    };
    footer?: {
      user?: {
        name: string;
        email?: string;
        avatar?: string;
      };
      actions?: Array<{
        id: string;
        label: string;
        icon?: any;
      }>;
    };
    onNavigate?: (item: any) => void;
    adSlot?: import('svelte').Snippet;
  }

  let { navigation = [], brand, footer, onNavigate, adSlot }: Props = $props();

  // Get layout context
  const layout = getLayoutContext();

  // State management matching layout-debug
  let isMobileMenuOpen = $state(false);
  
  // Tooltip state management
  let activeTooltip = $state<string | null>(null);
  let tooltipPosition = $state({ x: 0, y: 0 });
  
  // Toggle functions
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
  
  function toggleDesktopSidebar() {
    layout.sidebar.toggle();
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
  
  // Tooltip functions
  function showTooltip(event: MouseEvent, label: string) {
    // Show tooltips for collapsed desktop sidebar OR tablet sidebar (always icon-only)
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    if (!layout.sidebar.isCollapsed && !isTablet) return;
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    tooltipPosition = {
      x: rect.right + 8,
      y: rect.top + rect.height / 2
    };
    activeTooltip = label;
  }
  
  function hideTooltip() {
    activeTooltip = null;
  }
</script>

<!-- Desktop Sidebar - Dynamic width with collapse toggle (lg+) -->
<aside 
  id="Sidebar" 
  class="navbar fixed inset-y-4 z-50 mx-4 rounded-2xl shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] overflow-hidden hidden lg:flex lg:flex-col bg-primary-300/20 backdrop-blur-md transition-all duration-300 ease-in-out {layout.sidebar.isCollapsed ? 'lg:w-16' : 'lg:w-64'}"
>
  <div class="flex flex-col flex-1 min-h-0">
    
    <!-- Header -->
    <div class="">
      <div class="flex items-center justify-between h-16 px-4 bg-white/10">
        <a href="/" aria-current="page" class="hide-text w-inline-block w--current flex items-center {layout.sidebar.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} transition-all duration-200">
          <div class="text-size-regular text-primary-700 no-wrap text-xl font-semibold whitespace-nowrap">
            {brand?.name || 'SparkLabs'}
          </div>
        </a>

        <div class="">
          <button
            onclick={toggleDesktopSidebar}
            class="p-2 flex items-center justify-center rounded text-primary-700 hover:text-primary-800 hover:bg-primary-500/10 transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >	
            {#if layout.sidebar.isCollapsed}
              <PanelRightClose class="w-5 h-5 " />
            {:else}
              <PanelRightOpen class="w-5 h-5 " />
            {/if}
          </button>
        </div>
      </div>
      <div class="border-t border-primary-500/40 w-full h-px"></div>
    </div>
    
    <!-- Navigation Links -->
    <div class="nav__links flex-1 px-2 py-6 space-y-1 overflow-y-auto">
      {#each navigation as section}
        {#if section.title && !layout.sidebar.isCollapsed}
          <div class="px-3 py-2 text-xs font-semibold text-primary-500 uppercase tracking-wider">
            {section.title}
          </div>
        {/if}
        
        {#if section.items}
          {#each section.items as item}
            <div class="relative group">
              <button 
                type="button"
                onclick={() => onNavigate?.(item)}
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 w-full {item.isActive ? 'bg-primary-100/50 text-primary-900 border border-primary-500/70' : 'text-primary-700 hover:bg-primary-500/10 hover:text-primary-900'}"
                onmouseenter={(e) => showTooltip(e, item.label)}
                onmouseleave={hideTooltip}
              >
                <div class="mr-3 w-6 h-6 bg-primary-300/30 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div class="flex items-center justify-center text-primary-800">
                    {#if typeof item.icon === 'string'}
                      <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                    {:else if item.icon}
                      <item.icon class="w-4 h-4" />
                    {:else}
                      <span class="text-sm">•</span>
                    {/if}
                  </div>
                </div>
                <div class="hide-text is--nav flex-1 text-left {layout.sidebar.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} transition-all duration-200">
                  <p class="mb-0 whitespace-nowrap text-left">{item.label}</p>
                </div>
              </button>
            </div>
          {/each}
        {/if}
      {/each}
    </div>
    
    <!-- Footer -->
    <div class="flex-shrink-0 p-4 space-y-4 {layout.sidebar.isCollapsed ? 'px-2' : 'px-4'}">
      <div class="border-t border-primary-500/40 w-full h-px mb-4"></div>

      {#if adSlot}
        {@render adSlot()}
      {/if}

      {#if footer?.user}
        <div class="flex items-center {layout.sidebar.isCollapsed ? 'gap-0' : 'gap-3'}">
          <div class="w-12 h-12 bg-primary-300/80 border border-primary-500/20 rounded-full overflow-hidden flex items-center justify-center">
            <span class="text-primary-800 font-medium text-sm">
              {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div class="overflow-hidden {layout.sidebar.isCollapsed ? 'w-0 hidden' : 'w-auto'}">
            <p class="text-primary-700 mb-0.5 text-sm">{footer.user.name}</p>
            {#if footer.user.email}
              <span class="text-primary-600 text-xs">{footer.user.email}</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
</aside>

<!-- Tablet Sidebar - Collapsed to icons (md to lg) -->
<div class="navbar fixed inset-y-4 mx-4 shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] rounded-2xl overflow-hidden z-50 hidden md:flex lg:hidden md:w-16 md:flex-col bg-primary-300/20 backdrop-blur-md">
  <div class="flex flex-col flex-1 min-h-0">
    
    <!-- Header - Icon only -->
    <div class="">
      <div class="flex items-center justify-center h-16 bg-white/10">
        <div class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
          <span class="text-primary-800 font-bold text-sm">S</span>
        </div>
      </div>
      <div class="border-t border-primary-500/40 w-full h-px"></div>
    </div>
    
    <!-- Navigation - Icons only with tooltips -->
    <div class="nav__links flex-1 px-2 py-6 space-y-1 overflow-y-scroll overflow-x-hidden">
      {#each navigation as section}
        {#if section.items}
          {#each section.items as item}
            <div class="relative group">
              <button 
                type="button"
                onclick={() => onNavigate?.(item)}
                class="flex items-center justify-center p-3 rounded-lg transition-colors duration-200 {item.isActive ? 'bg-primary-100/50 text-primary-900 border border-primary-500/70' : 'text-primary-700 hover:bg-primary-500/10 hover:text-primary-900'}"
                onmouseenter={(e) => showTooltip(e, item.label)}
                onmouseleave={hideTooltip}
              >
                <div class="w-6 h-6 bg-primary-300/30 text-primary-800 rounded flex items-center justify-center">
                  {#if typeof item.icon === 'string'}
                    <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                  {:else if item.icon}
                    <item.icon class="w-4 h-4" />
                  {:else}
                    <span class="text-sm">•</span>
                  {/if}
                </div>
              </button>
            </div>
          {/each}
        {/if}
      {/each}
    </div>
    
    <!-- Footer - Compact -->
    <div class="flex-shrink-0 p-2 space-y-4">
      <div class="border-t border-primary-500/40 w-full h-px mb-4"></div>

      <div class="w-12 h-12 bg-primary-300/30 backdrop-blur-3xl rounded border border-primary-500/20 flex items-center justify-center">
        <span class="text-primary-500 text-xs">Ad</span>
      </div>

      {#if footer?.user}
        <div class="flex items-center">
          <div class="w-12 h-12 bg-primary-300/80 border border-primary-500/20 rounded-full overflow-hidden flex items-center justify-center">
            <span class="text-primary-800 font-medium text-xs">
              {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Mobile Navigation Bar (md:hidden) -->
<div class="md:hidden fixed top-0 left-0 right-0 z-30 bg-primary-300/20 backdrop-blur-md border border-white/30 rounded-2xl m-4 shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)]">
  <div class="flex items-center justify-between h-16 px-6">
    <div class="text-primary-700 text-xl font-semibold">{brand?.name || 'SparkLabs'}</div>
    <button
      onclick={toggleMobileMenu}
      class="p-2 rounded-lg hover:bg-primary-500/10 transition-colors flex items-center justify-center cursor-pointer"
      aria-label="Toggle navigation"
    >
      {#if isMobileMenuOpen}
        <PanelRightClose class="w-5 h-5 text-primary-700" />
      {:else}
        <PanelRightOpen class="w-5 h-5 text-primary-700" />
      {/if}
    </button>
  </div>
</div>

<!-- Mobile Menu Overlay -->
<div class="md:hidden fixed inset-0 z-40 {isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}">
  <!-- Backdrop - only visible when menu is open -->
  {#if isMobileMenuOpen}
    <button 
      class="fixed inset-0 bg-white/5 transition-opacity duration-300 ease-in-out"
      onclick={closeMobileMenu}
      aria-label="Close mobile menu"
    ></button>
  {/if}
  
  <!-- Mobile Sidebar Panel -->
  <div class="navbar fixed inset-y-0 left-0 w-80 bg-primary-300/20 backdrop-blur-3xl transform transition-transform duration-300 ease-in-out shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
    <div class="flex flex-col h-full">
      
      <!-- Navigation - No header duplication -->
      <div class="nav__links flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {#each navigation as section}
          {#if section.items}
            {#each section.items as item}
              <button 
                type="button"
                onclick={() => {
                  onNavigate?.(item);
                  closeMobileMenu();
                }}
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 w-full {item.isActive ? 'bg-primary-100/50 text-primary-900 border border-primary-500/70' : 'text-primary-700 hover:bg-primary-500/10 hover:text-primary-900'}"
              >
                <div class="mr-3 w-6 h-6 bg-primary-300/30 text-primary-800 rounded flex items-center justify-center">
                  <div class="">
                    {#if typeof item.icon === 'string'}
                      <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                    {:else if item.icon}
                      <item.icon class="w-4 h-4" />
                    {:else}
                      <span class="text-sm">•</span>
                    {/if}
                  </div>
                </div>
                <div class="hide-text is--nav flex-1 text-left">
                  <p class="mb-0">{item.label}</p>
                </div>
              </button>
            {/each}
          {/if}
        {/each}
      </div>
      
      <!-- Footer -->
      <div class="flex-shrink-0 p-4 space-y-4 border-t border-primary-500/40">
        {#if adSlot}
          {@render adSlot()}
        {/if}

        {#if footer?.user}
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary-300/80 border border-primary-500/20 rounded-full overflow-hidden flex items-center justify-center">
              <span class="text-primary-800 font-medium text-sm">
                {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div class="overflow-hidden w-auto">
              <p class="text-primary-700 mb-0.5 text-sm">{footer.user.name}</p>
              {#if footer.user.email}
                <span class="text-primary-600 text-xs">{footer.user.email}</span>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Tooltip Portal - Shows when activeTooltip is set -->
{#if activeTooltip}
  <div 
    class="fixed z-[200] px-3 py-2 bg-white/95 backdrop-blur-md text-primary-800 text-sm rounded-lg border border-white/70 shadow-xl whitespace-nowrap pointer-events-none"
    style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; transform: translateY(-50%);"
  >
    {activeTooltip}
    <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/95 border-l border-b border-white/70 rotate-45"></div>
  </div>
{/if}

<style>
  /* Custom scrollbar for sidebar */
  .navbar, .nav__links {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  .navbar::-webkit-scrollbar, .nav__links::-webkit-scrollbar {
    width: 0px;
    display: none; /* Safari and Chrome */
  }
  
  .navbar::-webkit-scrollbar-track, .nav__links::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .navbar::-webkit-scrollbar-thumb, .nav__links::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
  }
  
  .navbar::-webkit-scrollbar-thumb:hover, .nav__links::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
</style>