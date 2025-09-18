<script lang="ts">
  import { onMount } from 'svelte';
  import { getLayoutContext } from '../utils/layoutContext.svelte.js';
  import { animate } from '../utils/animations.js';
  import { responsive } from '../utils/responsive.js';
  import type { ResponsiveValue, ResponsiveAnimation } from '../utils/responsive.js';
  
  interface Props {
    /**
     * Responsive grid configuration
     */
    grid?: ResponsiveValue<number>;
    
    /**
     * Grid gap spacing
     */
    gap?: ResponsiveValue<string>;
    
    /**
     * Auto-fit grid with minimum column width
     */
    autoFit?: boolean;
    minWidth?: string;
    
    /**
     * Container max width
     */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
    
    /**
     * Responsive padding
     */
    padding?: ResponsiveValue<string>;
    
    /**
     * Center content horizontally
     */
    center?: boolean;
    
    /**
     * Animation configuration
     */
    animations?: ResponsiveAnimation;
    
    /**
     * Stagger child animations
     */
    staggerChildren?: boolean;
    staggerDelay?: number;
    
    /**
     * Custom CSS class
     */
    class?: string;
    
    /**
     * Children content
     */
    children?: import('svelte').Snippet;
  }
  
  let {
    grid,
    gap = { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8' },
    autoFit = false,
    minWidth = '280px',
    maxWidth = 'full',
    padding = { mobile: 'p-4', tablet: 'p-6', desktop: 'p-8' },
    center = false,
    animations,
    staggerChildren = false,
    staggerDelay = 100,
    class: className = '',
    children
  }: Props = $props();

  const layout = getLayoutContext();
  
  let containerElement: HTMLDivElement;
  let childElements: Element[] = [];
  
  // Reactive breakpoint state
  let isMobile = $derived(layout.isMobile);
  let isTablet = $derived(layout.isTablet);
  let isDesktop = $derived(layout.isDesktop);
  
  // Generate responsive classes
  let containerClasses = $derived.by(() => {
    const classes = ['responsive-container'];
    
    // Grid configuration
    if (grid || autoFit) {
      classes.push('grid');
      
      if (autoFit) {
        classes.push(`grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`);
      } else if (grid) {
        if (grid.mobile) classes.push(`grid-cols-${grid.mobile}`);
        if (grid.tablet) classes.push(`md:grid-cols-${grid.tablet}`);
        if (grid.desktop) classes.push(`lg:grid-cols-${grid.desktop}`);
        if (grid.wide) classes.push(`xl:grid-cols-${grid.wide}`);
      }
    }
    
    // Gap spacing
    if (gap.mobile) classes.push(gap.mobile);
    if (gap.tablet) classes.push(`md:${gap.tablet}`);
    if (gap.desktop) classes.push(`lg:${gap.desktop}`);
    if (gap.wide) classes.push(`xl:${gap.wide}`);
    
    // Padding
    if (padding.mobile) classes.push(padding.mobile);
    if (padding.tablet) classes.push(`md:${padding.tablet}`);
    if (padding.desktop) classes.push(`lg:${padding.desktop}`);
    if (padding.wide) classes.push(`xl:${padding.wide}`);
    
    // Max width and centering
    if (maxWidth !== 'full') {
      classes.push(`max-w-${maxWidth}`);
    }
    
    if (center) {
      classes.push('mx-auto');
    }
    
    // Custom class
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  });
  
  // Setup animations and responsive behavior
  onMount(() => {
    // Collect child elements for staggered animations
    if (staggerChildren && containerElement) {
      childElements = Array.from(containerElement.children);
    }
    
    return () => {
      // Cleanup handled by actions
    };
  });
  
  // Handle animations when children change
  $effect(() => {
    if (staggerChildren && childElements.length > 0) {
      childElements.forEach((element, index) => {
        setTimeout(() => {
          animate(element, {
            type: 'fadeIn',
            trigger: 'intersection',
            delay: 0
          });
        }, index * staggerDelay);
      });
    }
  });
</script>

<!-- Responsive Container -->
<div
  bind:this={containerElement}
  class={containerClasses}
  use:responsive={{
    animations: animations,
    trigger: 'intersection',
    threshold: 0.1
  }}
  role="region"
  aria-label="Responsive content container"
>
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  /* Responsive container base styles */
  .responsive-container {
    /* Ensure proper rendering context */
    position: relative;
    
    /* Handle overflow gracefully */
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
  
  /* Auto-fit grid optimization */
  .responsive-container.grid {
    /* Optimize for performance */
    will-change: grid-template-columns;
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .responsive-container {
      outline: 1px solid transparent;
    }
  }
  
  /* Print optimizations */
  @media print {
    .responsive-container {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
      padding: 1rem !important;
      max-width: none !important;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .responsive-container * {
      animation-duration: 0ms !important;
      animation-delay: 0ms !important;
      transition-duration: 0ms !important;
    }
  }
  
  /* Container query support (when available) */
  @supports (container-type: inline-size) {
    .responsive-container {
      container-type: inline-size;
    }
    
    /* Container-based responsive adjustments */
    @container (min-width: 400px) {
      .responsive-container {
        --container-gap: 1.5rem;
      }
    }
    
    @container (min-width: 600px) {
      .responsive-container {
        --container-gap: 2rem;
      }
    }
  }
  
  /* Safe area support for mobile */
  @supports (padding: max(0px)) {
    .responsive-container {
      padding-left: max(var(--container-padding, 1rem), env(safe-area-inset-left));
      padding-right: max(var(--container-padding, 1rem), env(safe-area-inset-right));
    }
  }
</style>