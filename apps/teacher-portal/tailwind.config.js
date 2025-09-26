/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    // Scan UI package source and built files for classes
    '../../packages/ui/src/**/*.{html,js,svelte,ts}',
    '../../packages/ui/dist/**/*.{html,js,svelte,ts}'
  ],
  safelist: [
    // Auto-fit grid with specific minWidth values used in layout tests
    'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
    'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
    
    // Sidebar layout margin classes
    'ml-16',
    'ml-[280px]',
    'w-[280px]',
    'bottom-0',
    'min-h-0',
    'h-16',
    'min-h-16',
    'min-h-20',
    'flex-shrink-0',
    
    // CSS Grid layout classes for sidebar
    'grid-rows-[auto_1fr_auto]',
    'overflow-x-hidden',
    
    // Button component - all dynamic variant classes
    // Solid variants (bg + hover + text)
    'bg-primary-500', 'hover:bg-primary-600', 'text-white', 'border-transparent',
    'bg-secondary-500', 'hover:bg-secondary-600', 
    'bg-success-500', 'hover:bg-success-600',
    'bg-danger-500', 'hover:bg-danger-600',
    'bg-warning-500', 'hover:bg-warning-600',
    
    // Outline variants (border + text + hover)
    'border-primary-500', 'text-primary-500', 'hover:bg-primary-500', 'hover:text-white', 'bg-transparent',
    'border-secondary-500', 'text-secondary-500', 'hover:bg-secondary-500',
    'border-success-500', 'text-success-500', 'hover:bg-success-500', 
    'border-danger-500', 'text-danger-500', 'hover:bg-danger-500',
    'border-warning-500', 'text-warning-500', 'hover:bg-warning-500',
    
    // Ghost variants (text + hover background)
    'text-primary-500', 'hover:bg-primary-50', 
    'text-secondary-500', 'hover:bg-secondary-50',
    'text-success-500', 'hover:bg-success-50',
    'text-danger-500', 'hover:bg-danger-50', 
    'text-warning-500', 'hover:bg-warning-50',
    
    // Soft variants (background + text + hover)
    'bg-primary-50', 'text-primary-600', 'hover:bg-primary-100',
    'bg-secondary-50', 'text-secondary-600', 'hover:bg-secondary-100',
    'bg-success-50', 'text-success-600', 'hover:bg-success-100',
    'bg-danger-50', 'text-danger-600', 'hover:bg-danger-100',
    'bg-warning-50', 'text-warning-600', 'hover:bg-warning-100',
    
    // Focus rings for all colors
    'focus:ring-primary-500', 'focus:ring-secondary-500', 'focus:ring-success-500', 'focus:ring-danger-500', 'focus:ring-warning-500',
    
    // AuthLinks component conditional classes
    'text-gray-600', 'hover:text-gray-500', 'text-indigo-600', 'hover:text-indigo-500',
    
    // ChallengeCard component - type colors and gradients
    'bg-blue-100', 'text-blue-700', 'from-blue-50', 'to-indigo-50',
    'bg-green-100', 'text-green-700', 'from-green-50', 'to-emerald-50',
    'bg-purple-100', 'text-purple-700', 'from-purple-50', 'to-violet-50',
    'bg-orange-100', 'text-orange-700', 'from-orange-50', 'to-red-50',
    'bg-gradient-to-br',
    
    // ChallengeCard difficulty colors
    'text-green-600', 'text-yellow-600', 'text-red-600',
    'bg-green-600', 'bg-yellow-600', 'bg-red-600',
    
    // ChallengeCard completion/overlay colors  
    'ring-2', 'ring-success-200', 'bg-success-50', 'bg-success-500/90', 'text-success-600',
    
    // Layout components - neutral colors 
    'bg-neutral-100', 'bg-neutral-300/30', 'bg-neutral-300/70', 'bg-neutral-300/80', 'bg-neutral-500/10', 'bg-neutral-500/20',
    'text-neutral-500', 'text-neutral-600', 'text-neutral-700', 'text-neutral-800', 'text-neutral-900', 
    'border-neutral-500/20', 'hover:bg-neutral-500/10', 'hover:text-neutral-900',
    
    // Primary colors for active states and UI elements - including all transparency values used in Sidebar
    'bg-primary-50', 'bg-primary-100', 'bg-primary-100/50', 'bg-primary-200', 'bg-primary-300', 'bg-primary-300/20', 'bg-primary-300/30', 'bg-primary-300/70', 'bg-primary-300/80', 'bg-primary-400', 'bg-primary-500', 'bg-primary-500/10', 'bg-primary-500/20', 'bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900',
    'text-primary-500', 'text-primary-600', 'text-primary-700', 'text-primary-800', 'text-primary-900', 
    'border-primary-200', 'border-primary-300', 'border-primary-400', 'border-primary-500', 'border-primary-500/20', 'border-primary-500/70', 'border-primary-600', 'border-primary-700',
    'hover:bg-primary-50', 'hover:bg-primary-100', 'hover:bg-primary-500/10', 'hover:text-primary-900',
    
    // Cursor utilities
    'cursor-pointer',
    
    // Text alignment utilities
    'text-left',
    
    // Button size classes (padding + text)
    'px-3', 'py-1.5', 'text-sm',      // sm
    'px-4', 'py-2', 'text-base',      // md  
    'px-6', 'py-3', 'text-lg',       // lg
    'px-8', 'py-4', 'text-xl',       // xl
    
    // Dynamic grid columns that might be generated
    {
      pattern: /grid-cols-\[repeat\(auto-fit,minmax\(.+,1fr\)\)\]/
    },
    
    // Comprehensive transparency safelist for all semantic tokens - covering all common values
    // Primary transparency values
    'bg-primary-50/5', 'bg-primary-50/10', 'bg-primary-50/20', 'bg-primary-50/25', 'bg-primary-50/30', 'bg-primary-50/40', 'bg-primary-50/50', 'bg-primary-50/60', 'bg-primary-50/70', 'bg-primary-50/75', 'bg-primary-50/80', 'bg-primary-50/90', 'bg-primary-50/95',
    'bg-primary-100/5', 'bg-primary-100/10', 'bg-primary-100/20', 'bg-primary-100/25', 'bg-primary-100/30', 'bg-primary-100/40', 'bg-primary-100/50', 'bg-primary-100/60', 'bg-primary-100/70', 'bg-primary-100/75', 'bg-primary-100/80', 'bg-primary-100/90', 'bg-primary-100/95',
    'bg-primary-200/5', 'bg-primary-200/10', 'bg-primary-200/20', 'bg-primary-200/25', 'bg-primary-200/30', 'bg-primary-200/40', 'bg-primary-200/50', 'bg-primary-200/60', 'bg-primary-200/70', 'bg-primary-200/75', 'bg-primary-200/80', 'bg-primary-200/90', 'bg-primary-200/95',
    'bg-primary-300/5', 'bg-primary-300/10', 'bg-primary-300/20', 'bg-primary-300/25', 'bg-primary-300/30', 'bg-primary-300/40', 'bg-primary-300/50', 'bg-primary-300/60', 'bg-primary-300/70', 'bg-primary-300/75', 'bg-primary-300/80', 'bg-primary-300/90', 'bg-primary-300/95',
    'bg-primary-400/5', 'bg-primary-400/10', 'bg-primary-400/20', 'bg-primary-400/25', 'bg-primary-400/30', 'bg-primary-400/40', 'bg-primary-400/50', 'bg-primary-400/60', 'bg-primary-400/70', 'bg-primary-400/75', 'bg-primary-400/80', 'bg-primary-400/90', 'bg-primary-400/95',
    'bg-primary-500/5', 'bg-primary-500/10', 'bg-primary-500/20', 'bg-primary-500/25', 'bg-primary-500/30', 'bg-primary-500/40', 'bg-primary-500/50', 'bg-primary-500/60', 'bg-primary-500/70', 'bg-primary-500/75', 'bg-primary-500/80', 'bg-primary-500/90', 'bg-primary-500/95',
    
    // Border transparency values for primary
    'border-primary-50/5', 'border-primary-50/10', 'border-primary-50/20', 'border-primary-50/25', 'border-primary-50/30', 'border-primary-50/40', 'border-primary-50/50', 'border-primary-50/60', 'border-primary-50/70', 'border-primary-50/75', 'border-primary-50/80', 'border-primary-50/90', 'border-primary-50/95',
    'border-primary-100/5', 'border-primary-100/10', 'border-primary-100/20', 'border-primary-100/25', 'border-primary-100/30', 'border-primary-100/40', 'border-primary-100/50', 'border-primary-100/60', 'border-primary-100/70', 'border-primary-100/75', 'border-primary-100/80', 'border-primary-100/90', 'border-primary-100/95',
    'border-primary-200/5', 'border-primary-200/10', 'border-primary-200/20', 'border-primary-200/25', 'border-primary-200/30', 'border-primary-200/40', 'border-primary-200/50', 'border-primary-200/60', 'border-primary-200/70', 'border-primary-200/75', 'border-primary-200/80', 'border-primary-200/90', 'border-primary-200/95',
    'border-primary-300/5', 'border-primary-300/10', 'border-primary-300/20', 'border-primary-300/25', 'border-primary-300/30', 'border-primary-300/40', 'border-primary-300/50', 'border-primary-300/60', 'border-primary-300/70', 'border-primary-300/75', 'border-primary-300/80', 'border-primary-300/90', 'border-primary-300/95',
    'border-primary-400/5', 'border-primary-400/10', 'border-primary-400/20', 'border-primary-400/25', 'border-primary-400/30', 'border-primary-400/40', 'border-primary-400/50', 'border-primary-400/60', 'border-primary-400/70', 'border-primary-400/75', 'border-primary-400/80', 'border-primary-400/90', 'border-primary-400/95',
    'border-primary-500/5', 'border-primary-500/10', 'border-primary-500/20', 'border-primary-500/25', 'border-primary-500/30', 'border-primary-500/40', 'border-primary-500/50', 'border-primary-500/60', 'border-primary-500/70', 'border-primary-500/75', 'border-primary-500/80', 'border-primary-500/90', 'border-primary-500/95',
    
    // Pattern-based semantic token safelisting - comprehensive with all variants
    {
      pattern: /^(bg|text|border|ring)-(primary|secondary|neutral|success|danger|warning|accent)-(50|100|200|300|400|500|600|700|800|900|950)$/
    },
    {
      pattern: /^(bg|text|border|ring)-(primary|secondary|neutral|success|danger|warning|accent)-(50|100|200|300|400|500|600|700|800|900|950)\/([0-9]{1,2}|[0-9]{1,3})$/
    },
    {
      pattern: /^(hover|focus|active):(bg|text|border|ring)-(primary|secondary|neutral|success|danger|warning|accent)-(50|100|200|300|400|500|600|700|800|900|950)$/
    },
    {
      pattern: /^(hover|focus|active):(bg|text|border|ring)-(primary|secondary|neutral|success|danger|warning|accent)-(50|100|200|300|400|500|600|700|800|900|950)\/([0-9]{1,2}|[0-9]{1,3})$/
    },
    {
      pattern: /^(group-)?(hover|focus|active):(.+)$/
    }
  ]
};