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
  let activeTooltip = $state(null);
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
  function showTooltip(event, label) {
    if (!layout.sidebar.isCollapsed) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
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
  class="navbar fixed inset-y-4 z-50 mx-4 rounded-2xl shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] overflow-hidden hidden lg:flex lg:flex-col bg-gray-300/30 backdrop-blur-md text-white transition-all duration-300 ease-in-out {layout.sidebar.isCollapsed ? 'lg:w-16' : 'lg:w-64'}"
>
  <div class="flex flex-col flex-1 min-h-0">
    
    <!-- Header -->
    <div class="">
      <div class="flex items-center justify-between h-16 px-4 bg-white/10">
        <a href="/" aria-current="page" class="hide-text w-inline-block w--current flex items-center {layout.sidebar.isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'} transition-all duration-200">
          <div class="text-size-regular text-gray-700 no-wrap text-xl font-semibold whitespace-nowrap">
            {brand?.name || 'SparkLabs'}
          </div>
        </a>

        <div class="">
          <button
            onclick={toggleDesktopSidebar}
            class="p-2 flex items-center justify-center rounded hover:bg-gray-500/10 transition-colors"
            aria-label="Toggle sidebar"
          >	
            {#if layout.sidebar.isCollapsed}
              <PanelRightClose class="w-5 h-5 text-gray-600" />
            {:else}
              <PanelRightOpen class="w-5 h-5 text-gray-600" />
            {/if}
          </button>
        </div>
      </div>
      <div class="border-t border-gray-500/20 w-full h-px"></div>
    </div>
    
    <!-- Navigation Links -->
    <div class="nav__links flex-1 px-2 py-6 space-y-1 overflow-y-auto">
      {#each navigation as section}
        {#if section.title && !layout.sidebar.isCollapsed}
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {section.title}
          </div>
        {/if}
        
        {#if section.items}
          {#each section.items as item}
            <div class="relative group">
              <button 
                type="button"
                onclick={() => onNavigate?.(item)}
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 w-full {item.isActive ? 'bg-gray-300/20 text-gray-900 border border-gray-500/20' : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-900'}"
                onmouseenter={(e) => showTooltip(e, item.label)}
                onmouseleave={hideTooltip}
              >
                <div class="mr-3 w-6 h-6 bg-gray-300/70 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div class="flex items-center justify-center">
                    {#if typeof item.icon === 'string'}
                      <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                    {:else if item.icon}
                      <svelte:component this={item.icon} class="w-4 h-4" />
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
      <div class="border-t border-gray-500/20 w-full h-px mb-4"></div>

      {#if adSlot}
        {@render adSlot()}
      {/if}

      {#if footer?.user}
        <div class="flex items-center {layout.sidebar.isCollapsed ? 'gap-0' : 'gap-3'}">
          <div class="w-12 h-12 bg-gray-300/80 border border-gray-500/20 rounded-full overflow-hidden flex items-center justify-center">
            <span class="text-gray-800 font-medium text-sm">
              {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div class="overflow-hidden {layout.sidebar.isCollapsed ? 'w-0 hidden' : 'w-auto'}">
            <p class="text-gray-800 mb-0.5 text-sm">{footer.user.name}</p>
            {#if footer.user.email}
              <span class="text-gray-500 text-xs">{footer.user.email}</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
</aside>

<!-- Tablet Sidebar - Collapsed to icons (md to lg) -->
<div class="navbar fixed inset-y-4 mx-4 shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] rounded-2xl overflow-hidden z-50 hidden md:flex lg:hidden md:w-16 md:flex-col bg-gray-300/30 backdrop-blur-md text-white">
  <div class="flex flex-col flex-1 min-h-0">
    
    <!-- Header - Icon only -->
    <div class="">
      <div class="flex items-center justify-center h-16 bg-white/10">
        <div class="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <span class="text-gray-800 font-bold text-sm">S</span>
        </div>
      </div>
      <div class="border-t border-gray-500/20 w-full h-px"></div>
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
                class="flex items-center justify-center p-3 rounded-lg transition-colors duration-200 {item.isActive ? 'bg-gray-300/20 text-gray-900 border border-gray-500/20' : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-900'}"
              >
                <div class="w-6 h-6 bg-gray-300/70 rounded flex items-center justify-center">
                  {#if typeof item.icon === 'string'}
                    <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                  {:else if item.icon}
                    <svelte:component this={item.icon} class="w-4 h-4" />
                  {:else}
                    <span class="text-sm">•</span>
                  {/if}
                </div>
              </button>
              
              <!-- Tooltip -->
              <div class="absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-white/90 backdrop-blur-md text-gray-800 text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap border border-white/70 shadow-lg">
                {item.label}
                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/90 border-l border-b border-white/70 rotate-45"></div>
              </div>
            </div>
          {/each}
        {/if}
      {/each}
    </div>
    
    <!-- Footer - Compact -->
    <div class="flex-shrink-0 p-2 space-y-4">
      <div class="border-t border-gray-500/20 w-full h-px mb-4"></div>

      <div class="w-12 h-12 bg-gray-300/30 backdrop-blur-3xl rounded border border-gray-500/20 flex items-center justify-center">
        <span class="text-gray-500 text-xs">Ad</span>
      </div>

      {#if footer?.user}
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gray-300/80 border border-gray-500/20 rounded-full overflow-hidden">
            <!-- Avatar -->
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Mobile Navigation Bar (md:hidden) -->
<div class="md:hidden fixed top-0 left-0 right-0 z-30 bg-gray-300/30 backdrop-blur-md border border-white/30 rounded-2xl m-4 shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)]">
  <div class="flex items-center justify-between h-16 px-6">
    <div class="text-gray-800 text-xl font-semibold">{brand?.name || 'SparkLabs'}</div>
    <button
      onclick={toggleMobileMenu}
      class="p-2 rounded-lg hover:bg-gray-500/10 transition-colors flex items-center justify-center"
      aria-label="Toggle navigation"
    >
      {#if isMobileMenuOpen}
        <PanelRightClose class="w-5 h-5 text-gray-600" />
      {:else}
        <PanelRightOpen class="w-5 h-5 text-gray-600" />
      {/if}
    </button>
  </div>
</div>

<!-- Mobile Menu Overlay -->
<div class="md:hidden fixed inset-0 z-40 {isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}">
  <!-- Backdrop - only visible when menu is open -->
  {#if isMobileMenuOpen}
    <div 
      class="fixed inset-0 bg-white/5 transition-opacity duration-300 ease-in-out"
      onclick={closeMobileMenu}
    ></div>
  {/if}
  
  <!-- Mobile Sidebar Panel -->
  <div class="navbar fixed inset-y-0 left-0 w-80 bg-gray-300/30 backdrop-blur-3xl text-white transform transition-transform duration-300 ease-in-out shadow-[inset_0_0_0_0.75px_rgba(0,_0,_0,_0.15)] {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
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
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 w-full {item.isActive ? 'bg-gray-300/20 text-gray-900 border border-gray-500/20' : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-900'}"
              >
                <div class="mr-3 w-6 h-6 bg-gray-300/70 rounded flex items-center justify-center">
                  <div class="">
                    {#if typeof item.icon === 'string'}
                      <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                    {:else if item.icon}
                      <svelte:component this={item.icon} class="w-4 h-4" />
                    {:else}
                      <span class="text-sm">•</span>
                    {/if}
                  </div>
                </div>
                <div class="hide-text is--nav flex-1">
                  <p class="mb-0">{item.label}</p>
                </div>
              </button>
            {/each}
          {/if}
        {/each}
      </div>
      
      <!-- Footer -->
      <div class="flex-shrink-0 p-4 space-y-4 border-t border-gray-500/20">
        {#if adSlot}
          {@render adSlot()}
        {/if}

        {#if footer?.user}
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-300/80 border border-gray-500/20 rounded-full overflow-hidden">
              <!-- Avatar -->
            </div>
            <div class="overflow-hidden w-auto">
              <p class="text-gray-800 mb-0.5 text-sm">{footer.user.name}</p>
              {#if footer.user.email}
                <span class="text-gray-500 text-xs">{footer.user.email}</span>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Tooltip Portal -->
{#if activeTooltip && layout.sidebar.isCollapsed}
  <div 
    class="fixed z-[200] px-3 py-2 bg-white/95 backdrop-blur-md text-gray-800 text-sm rounded-lg border border-white/70 shadow-xl whitespace-nowrap pointer-events-none"
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