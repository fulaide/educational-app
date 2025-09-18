<script lang="ts">
import type { ComponentType } from 'svelte';

interface Props {
  href?: string;
  icon?: ComponentType;
  iconComponent?: ComponentType;
  iconSrc?: string;
  iconText?: string;
  label: string;
  badge?: string | number;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  class?: string;
}

let {
  href,
  icon,
  iconComponent,
  iconSrc,
  iconText,
  label,
  badge,
  isActive = false,
  isCollapsed = false,
  onClick,
  class: className = '',
  ...restProps
}: Props = $props();

let itemClasses = $derived.by(() => {
  const classes = [
    'menu-item',
    'flex',
    'items-center',
    'w-full',
    'text-sm',
    'font-medium',
    'rounded-md',
    'transition-colors',
    'duration-200',
    'group',
    'relative'
  ];
  
  // Adjust padding and justification based on collapsed state
  if (isCollapsed) {
    classes.push('px-2', 'py-2', 'justify-center');
  } else {
    classes.push('px-3', 'py-2');
  }

  if (isActive) {
    classes.push(
      'bg-sidebar-accent',
      'text-sidebar-accent-foreground',
      'shadow-sm'
    );
  } else {
    classes.push(
      'text-sidebar-foreground/80',
      'hover:bg-sidebar-accent/50',
      'hover:text-sidebar-accent-foreground'
    );
  }

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
});

let iconClasses = $derived.by(() => {
  const classes = ['flex-shrink-0'];
  
  if (isCollapsed) {
    classes.push('mr-0');
  } else {
    classes.push('mr-3');
  }

  return classes.join(' ');
});

let labelClasses = $derived.by(() => {
  const classes = ['truncate'];
  
  if (isCollapsed) {
    classes.push('sr-only');
  }

  return classes.join(' ');
});

function handleClick(event: MouseEvent) {
  if (onClick) {
    event.preventDefault();
    onClick();
  }
}
</script>

{#if href}
  <a
    {href}
    class={itemClasses}
    on:click={handleClick}
    {...restProps}
  >
    <div class={iconClasses}>
      {#if icon}
        <svelte:component this={icon} class="h-5 w-5" />
      {:else if iconComponent}
        <svelte:component this={iconComponent} class="h-5 w-5" />
      {:else if iconSrc}
        <img src={iconSrc} alt="" class="h-5 w-5" />
      {:else if iconText}
        {#if iconText.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)}
          <!-- Emoji icon -->
          <span class="text-lg" role="img" aria-label={label}>
            {iconText}
          </span>
        {:else}
          <!-- Text icon with background -->
          <div class="h-5 w-5 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground rounded">
            {iconText}
          </div>
        {/if}
      {/if}
    </div>
    
    <span class={labelClasses}>
      {label}
    </span>
    
    {#if badge && !isCollapsed}
      <div class="ml-auto">
        <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {badge}
        </span>
      </div>
    {/if}
    
    {#if isCollapsed && (badge || label)}
      <div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {label}
        {#if badge}
          <span class="ml-1 text-red-400">({badge})</span>
        {/if}
      </div>
    {/if}
  </a>
{:else}
  <button
    type="button"
    class={itemClasses}
    on:click={handleClick}
    {...restProps}
  >
    <div class={iconClasses}>
      {#if icon}
        <svelte:component this={icon} class="h-5 w-5" />
      {:else if iconComponent}
        <svelte:component this={iconComponent} class="h-5 w-5" />
      {:else if iconSrc}
        <img src={iconSrc} alt="" class="h-5 w-5" />
      {:else if iconText}
        {#if iconText.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)}
          <!-- Emoji icon -->
          <span class="text-lg" role="img" aria-label={label}>
            {iconText}
          </span>
        {:else}
          <!-- Text icon with background -->
          <div class="h-5 w-5 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground rounded">
            {iconText}
          </div>
        {/if}
      {/if}
    </div>
    
    <span class={labelClasses}>
      {label}
    </span>
    
    {#if badge && !isCollapsed}
      <div class="ml-auto">
        <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {badge}
        </span>
      </div>
    {/if}
    
    {#if isCollapsed && (badge || label)}
      <div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        {label}
        {#if badge}
          <span class="ml-1 text-red-400">({badge})</span>
        {/if}
      </div>
    {/if}
  </button>
{/if}