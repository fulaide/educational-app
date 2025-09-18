<script lang="ts">
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import type { SidebarProps } from './Sidebar.types.js';
  
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
  
  // Toggle sidebar
  function toggleSidebar() {
    layout.sidebar.toggle();
  }
</script>

<!-- SIMPLE SIDEBAR -->
<aside class="h-full w-full grid grid-cols-1 overflow-hidden   bg-sidebar border-r border-sidebar-border" style="display: grid; grid-template-rows: max-content auto max-content; will-change: transform, width;">
  <!-- Header -->
  <header class="sidebar-header bg-sidebar-header p-4 flex items-center justify-between min-h-16">
    <!-- Snippet: beforeBrand -->
    {#if children?.beforeBrand}
      {@render children.beforeBrand()}
    {/if}
    
    {#if brand && !isCollapsed}
      <div class="flex items-center space-x-3 min-w-0 flex-1">
        {#if brand.logo}
          <span class="text-2xl flex-shrink-0" role="img" aria-label={brand.name}>{brand.logo}</span>
        {/if}
        <span class="font-semibold text-lg text-sidebar-header-text truncate">{brand.name}</span>
      </div>
    {:else if brand && isCollapsed}
      <div class="flex items-center justify-center w-full">
        {#if brand.logo}
          <span class="text-2xl" role="img" aria-label={brand.name}>{brand.logo}</span>
        {:else}
          <span class="text-lg font-bold">{brand.name.charAt(0)}</span>
        {/if}
      </div>
    {/if}
    
    <!-- Snippet: afterBrand -->
    {#if children?.afterBrand}
      {@render children.afterBrand()}
    {/if}
    
    <button type="button" onclick={toggleSidebar} class="sidebar-toggle p-2 -m-2 rounded-lg text-sidebar-header-text hover:bg-sidebar-header-hover transition-colors" aria-label="Toggle sidebar">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M19 19l-7-7 7-7"></path>
      </svg>
    </button>
  </header>
  
  <!-- Content -->
  <nav class="sidebar-content overflow-y-auto overflow-x-hidden p-4 space-y-1">
    <!-- Snippet: beforeNavigation -->
    {#if children?.beforeNavigation}
      {@render children.beforeNavigation()}
    {/if}
    
    {#if children && !children.beforeNavigation && !children.afterNavigation && !children.footerContent}
      {@render children()}
    {:else if navigation && navigation.length > 0}
      {#each navigation as section}
        <!-- Section Title -->
        {#if section.title && !isCollapsed}
          <div class="px-3 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
            {section.title}
          </div>
        {/if}
        
        <!-- Section Items -->
        {#if section.items}
          {#each section.items as item}
            <button
              type="button"
              onclick={() => {
                item.onClick?.(item);
                onNavigate?.(item);
              }}
              class="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-sidebar-hover {item.isActive ? 'bg-sidebar-active text-sidebar-active-text' : 'text-sidebar-foreground'}"
              title={isCollapsed ? item.label : undefined}
            >
              <!-- Icon -->
              <span class="text-lg flex-shrink-0" role="img" aria-label={item.label}>
                {item.icon || '•'}
              </span>
              
              <!-- Label (hidden when collapsed) -->
              {#if !isCollapsed}
                <span class="flex-1 text-left truncate">{item.label}</span>
                
                <!-- Badge -->
                {#if item.badge}
                  <span class="px-2 py-0.5 text-xs font-medium bg-sidebar-badge text-sidebar-badge-text rounded-full">
                    {item.badge}
                  </span>
                {/if}
              {/if}
            </button>
          {/each}
        {/if}
        
        <!-- Section Separator -->
        {#if !isCollapsed}
          <div class="h-px bg-sidebar-border my-3"></div>
        {:else}
          <div class="h-2"></div>
        {/if}
      {/each}
    {:else}
      <div class="p-2 text-sidebar-foreground text-sm">
        {isCollapsed ? '•••' : 'No navigation items'}
      </div>
    {/if}
    
    <!-- Snippet: afterNavigation -->
    {#if children?.afterNavigation}
      {@render children.afterNavigation()}
    {/if}
  </nav>
  
  <!-- Footer -->
  <footer class="sidebar-footer bg-sidebar-footer p-4 min-h-16">
    {#if children}
      <!-- Snippet injection points -->
      {#if children.footerContent}
        {@render children.footerContent()}
      {:else if footer}
        <!-- Default footer with user info -->
        {#if footer.user && !isCollapsed}
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
        {:else if footer.user && isCollapsed}
          <div class="flex justify-center mb-3">
            <div class="w-8 h-8 bg-sidebar-active rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-sidebar-active-text">
                {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        {/if}
        
        <!-- Footer actions -->
        {#if footer.actions}
          <div class="space-y-1">
            {#each footer.actions as action}
              <button
                type="button"
                onclick={() => {
                  action.onClick?.(action);
                  onNavigate?.(action);
                }}
                class="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-sidebar-hover text-sidebar-foreground"
                title={isCollapsed ? action.label : undefined}
              >
                <span class="text-lg flex-shrink-0" role="img" aria-label={action.label}>
                  {action.icon || '•'}
                </span>
                {#if !isCollapsed}
                  <span class="flex-1 text-left truncate">{action.label}</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      {/if}
    {:else if footer}
      <!-- Default footer when no children -->
      {#if footer.user && !isCollapsed}
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
      {:else if footer.user && isCollapsed}
        <div class="flex justify-center mb-3">
          <div class="w-8 h-8 bg-sidebar-active rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-sidebar-active-text">
              {footer.user.avatar || footer.user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      {/if}
      
      <!-- Footer actions -->
      {#if footer.actions}
        <div class="space-y-1">
          {#each footer.actions as action}
            <button
              type="button"
              onclick={() => {
                action.onClick?.(action);
                onNavigate?.(action);
              }}
              class="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-sidebar-hover text-sidebar-foreground"
              title={isCollapsed ? action.label : undefined}
            >
              <span class="text-lg flex-shrink-0" role="img" aria-label={action.label}>
                {action.icon || '•'}
              </span>
              {#if !isCollapsed}
                <span class="flex-1 text-left truncate">{action.label}</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    {/if}
  </footer>
</aside>