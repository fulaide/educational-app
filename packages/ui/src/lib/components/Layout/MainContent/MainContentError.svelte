<script lang="ts">
  import type { MainContentErrorProps } from './MainContent.types.js';
  
  interface Props extends MainContentErrorProps {}
  
  let {
    title,
    message,
    onRetry,
    class: className = ''
  }: Props = $props();
  
  // Dynamic error container classes
  let errorClasses = $derived.by(() => {
    const classes = [
      'main-content-error',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-[400px]',
      'px-4',
      'py-8',
      'text-center'
    ];
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  });
  
  // Handle retry action
  function handleRetry() {
    onRetry?.();
  }
  
  // Handle keyboard navigation for retry button
  function handleRetryKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRetry();
    }
  }
</script>

<!-- Error State Container -->
<div class={errorClasses} role="alert" aria-live="polite">
  <!-- Error Icon -->
  <div class="error-icon mb-6">
    <svg 
      class="w-16 h-16 text-destructive mx-auto" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="1.5" 
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
      />
    </svg>
  </div>
  
  <!-- Error Content -->
  <div class="error-content max-w-md mx-auto">
    <!-- Error Title -->
    <h2 class="error-title text-xl font-semibold text-foreground mb-4">
      {title}
    </h2>
    
    <!-- Error Message -->
    <p class="error-message text-muted-foreground mb-8 leading-relaxed">
      {message}
    </p>
    
    <!-- Retry Button -->
    {#if onRetry}
      <button
        type="button"
        class="retry-button inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
        onclick={handleRetry}
        onkeydown={handleRetryKeyDown}
        aria-label="Retry the failed operation"
      >
        <!-- Retry Icon -->
        <svg 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        <span>Try Again</span>
      </button>
    {/if}
  </div>
  
  <!-- Additional Help Text -->
  <div class="error-help mt-8 text-sm text-muted-foreground max-w-lg mx-auto">
    <p>
      If this problem persists, please contact support or refresh the page.
    </p>
  </div>
</div>

<style>
  /* Error state styling */
  .main-content-error {
    /* Ensure proper contrast for error states */
    color: var(--foreground);
  }
  
  /* Error icon animation */
  .error-icon svg {
    animation: errorPulse 2s ease-in-out infinite;
  }
  
  @keyframes errorPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  /* Retry button focus styles */
  .retry-button:focus-visible {
    outline: 2px solid var(--focus-ring, rgb(59 130 246));
    outline-offset: 2px;
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .retry-button {
      border: 2px solid currentColor;
    }
    
    .error-icon svg {
      stroke-width: 2;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .error-icon svg {
      animation: none;
    }
    
    .retry-button {
      transition: none;
    }
  }
  
  /* Print styles */
  @media print {
    .main-content-error {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    
    .retry-button {
      display: none;
    }
  }
  
  /* Mobile optimizations */
  @media (max-width: 640px) {
    .main-content-error {
      min-height: 300px;
      padding: 1rem;
    }
    
    .error-icon svg {
      width: 3rem;
      height: 3rem;
    }
    
    .error-title {
      font-size: 1.125rem;
    }
    
    .retry-button {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
    }
  }
</style>