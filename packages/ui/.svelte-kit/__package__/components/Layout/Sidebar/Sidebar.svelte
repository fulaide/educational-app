<script lang="ts">
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import type { SidebarProps } from './Sidebar.types.js';
  import { 
    ChevronLeft, 
    ChevronRight, 
    BarChart3, 
    GraduationCap, 
    Puzzle, 
    FileText, 
    TrendingUp,
    User,
    LogOut,
    Home,
    Settings,
    HelpCircle
  } from 'lucide-svelte';

  // Icon mapping for common icons
  const iconMap = {
    'BarChart3': BarChart3,
    'GraduationCap': GraduationCap,
    'Puzzle': Puzzle,
    'FileText': FileText,
    'TrendingUp': TrendingUp,
    'User': User,
    'LogOut': LogOut,
    'Home': Home,
    'Settings': Settings,
    'HelpCircle': HelpCircle
  } as const;

  function getIconComponent(iconName: string | undefined) {
    if (!iconName) return null;
    return iconMap[iconName as keyof typeof iconMap] || null;
  }
  
  interface Props extends SidebarProps {
    children?: import('svelte').Snippet;
  }
  
  let {
    navigation = [],
    brand,
    footer,
    onNavigate,
    children
  }: Props = $props();

  const layout = getLayoutContext();
  
  // Derived state from layout context
  let isCollapsed = $derived(layout.sidebar.isCollapsed);
  let isMobile = $derived(layout.isMobile);
  let showSidebarOnMobile = $derived(layout.showSidebarOnMobile);
  
  // Derived sidebar visibility - simple logic
  let shouldShowSidebar = $derived(() => {
    // Show on desktop always, show on mobile if prop is true OR if opened via toggle
    const isOpen = layout.sidebar.isOpen;
    return !isMobile || showSidebarOnMobile || isOpen;
  });
  
  // Toggle sidebar
  function toggleSidebar() {
    layout.sidebar.toggle();
  }
</script>

{#if shouldShowSidebar()}
  {#if isMobile}
    <!-- Mobile overlay sidebar -->
    <div class="fixed inset-0 z-50 flex lg:hidden">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
        onclick={() => layout.sidebar.close()}
        aria-hidden="true"
      ></div>
      
      <!-- Mobile Sidebar -->
      <aside 
        class="relative flex-1 flex flex-col w-80 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out" 
        style="background-color: var(--sidebar-bg, white);"
      >
        <!-- Mobile Header -->
        <div class="p-4 border-b border-sidebar-border">
          <div class="flex items-center justify-between">
            {#if brand}
              <div class="flex items-center space-x-3">
                {#if brand.logo}
                  <span class="text-2xl" role="img" aria-label={brand.name}>{brand.logo}</span>
                {/if}
                <span class="font-semibold text-lg text-sidebar-header-text">{brand.name}</span>
              </div>
            {/if}
            
            <button 
              type="button" 
              onclick={() => layout.sidebar.close()} 
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" 
              aria-label="Close sidebar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-1">
          {#if navigation && navigation.length > 0}
            {#each navigation as section}
              {#if section.title}
                <div class="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </div>
              {/if}
              
              {#if section.items}
                {#each section.items as item}
                  <button
                    type="button"
                    onclick={() => {
                      if (item.onClick) item.onClick();
                      if (onNavigate) onNavigate(item);
                      layout.sidebar.close(); // Close mobile menu after navigation
                    }}
                    class="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-100 cursor-pointer {item.isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}"
                  >
                    <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {#if item.icon && getIconComponent(item.icon)}
                        {@const IconComponent = getIconComponent(item.icon)}
                        <IconComponent class="w-4 h-4" />
                      {:else if item.icon}
                        <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                      {:else}
                        <span class="w-2 h-2 bg-current rounded-full opacity-50"></span>
                      {/if}
                    </div>
                    <span class="flex-1 text-left">{item.label}</span>
                    {#if item.badge}
                      <span class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {item.badge}
                      </span>
                    {/if}
                  </button>
                {/each}
              {/if}
            {/each}
          {/if}
        </nav>
        
        <!-- Mobile Footer -->
        {#if footer?.user}
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900">
                  {footer.user.name}
                </div>
                {#if footer.user.email}
                  <div class="text-xs text-gray-500">
                    {footer.user.email}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </aside>
    </div>
  {:else}
    <!-- Desktop sidebar -->
    <aside class="h-full w-full grid grid-cols-1 overflow-hidden bg-sidebar border-r border-sidebar-border" style="display: grid; grid-template-rows: max-content auto max-content; will-change: transform, width;">
      <!-- Desktop sidebar content here -->
      <header class="sidebar-header bg-sidebar-header p-4 min-h-16 {isCollapsed ? 'flex flex-col items-center justify-center space-y-2' : 'flex items-center justify-between'}">
        {#if !isCollapsed}
          {#if brand}
            <div class="flex items-center space-x-3 min-w-0 flex-1">
              {#if brand.logo}
                <span class="text-2xl flex-shrink-0" role="img" aria-label={brand.name}>{brand.logo}</span>
              {/if}
              <span class="font-semibold text-lg text-sidebar-header-text truncate">{brand.name}</span>
            </div>
          {/if}
          
          <button 
            type="button" 
            onclick={toggleSidebar} 
            class="sidebar-toggle p-2 -m-2 rounded-lg text-sidebar-header-text hover:bg-sidebar-header-hover transition-colors flex-shrink-0" 
            aria-label="Toggle sidebar"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
        {:else}
          {#if brand}
            <div class="flex items-center justify-center">
              {#if brand.logo}
                <span class="text-2xl" role="img" aria-label={brand.name}>{brand.logo}</span>
              {:else}
                <span class="text-lg font-bold">{brand.name.charAt(0)}</span>
              {/if}
            </div>
          {/if}
          
          <button 
            type="button" 
            onclick={toggleSidebar} 
            class="sidebar-toggle p-1.5 rounded-lg text-sidebar-header-text hover:bg-sidebar-header-hover transition-colors w-8 h-8 flex items-center justify-center" 
            aria-label="Toggle sidebar"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        {/if}
      </header>
      
      <nav class="sidebar-content overflow-y-auto overflow-x-hidden p-4 space-y-1">
        {#if navigation && navigation.length > 0}
          {#each navigation as section}
            {#if section.title && !isCollapsed}
              <div class="px-2 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
                {section.title}
              </div>
            {/if}
            
            {#if section.items}
              {#each section.items as item}
                <button
                  type="button"
                  onclick={() => {
                    item.onClick?.(item);
                    onNavigate?.(item);
                  }}
                  class="w-full flex items-center {isCollapsed ? 'justify-center' : 'space-x-3'} px-2 py-2 text-sm rounded-lg transition-colors hover:bg-sidebar-hover cursor-pointer {item.isActive ? 'bg-sidebar-active text-sidebar-active-text' : 'text-sidebar-foreground'}"
                  title={isCollapsed ? item.label : undefined}
                >
                  <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    {#if item.icon && getIconComponent(item.icon)}
                      {@const IconComponent = getIconComponent(item.icon)}
                      <IconComponent class="w-4 h-4" />
                    {:else if item.icon}
                      <span class="text-sm" role="img" aria-label={item.label}>{item.icon}</span>
                    {:else}
                      <span class="w-2 h-2 bg-current rounded-full opacity-50"></span>
                    {/if}
                  </div>
                  
                  {#if !isCollapsed}
                    <span class="flex-1 text-left truncate">{item.label}</span>
                    {#if item.badge}
                      <span class="px-2 py-0.5 text-xs font-medium bg-sidebar-badge text-sidebar-badge-text rounded-full">
                        {item.badge}
                      </span>
                    {/if}
                  {/if}
                </button>
              {/each}
            {/if}
            
            {#if !isCollapsed}
              <div class="h-px bg-sidebar-border my-3"></div>
            {:else}
              <div class="h-2"></div>
            {/if}
          {/each}
        {/if}
      </nav>
      
      <footer class="sidebar-footer bg-sidebar-footer p-4 min-h-16">
        {#if footer?.user && !isCollapsed}
          <div class="flex items-center space-x-3 mb-3">
            <div class="flex-shrink-0 w-8 h-8 bg-sidebar-active rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-sidebar-active-text">
                {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-sidebar-foreground truncate">
                {footer.user.name}
              </div>
              {#if footer.user.email}
                <div class="text-xs text-sidebar-muted truncate">
                  {footer.user.email}
                </div>
              {/if}
            </div>
          </div>
        {:else if footer?.user && isCollapsed}
          <div class="flex justify-center items-center w-full mb-3">
            <div class="w-8 h-8 bg-sidebar-active rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-sidebar-active-text">
                {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        {/if}
      </footer>
    </aside>
  {/if}
{/if}