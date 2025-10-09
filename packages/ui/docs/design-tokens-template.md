# Design Tokens Template

This template provides a standardized approach for implementing design tokens across all themes in the educational app platform.

## Theme Structure Template

Each theme should follow this directory structure:

```
packages/ui/src/lib/themes/
├── {theme-name}/
│   ├── tokens.css           # Core design tokens
│   ├── components.css       # Component-specific styles
│   ├── utilities.css        # Utility classes
│   └── index.css           # Main theme export
```

## 1. Core Design Tokens (tokens.css)

### Color System Template
```css
:root {
  /* Primary Colors - Main brand colors for the theme */
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;  /* Main primary */
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;
  --color-primary-950: #082f49;

  /* Secondary Colors - Supporting brand colors */
  --color-secondary-50: #fafafa;
  --color-secondary-100: #f4f4f5;
  --color-secondary-200: #e4e4e7;
  --color-secondary-300: #d4d4d8;
  --color-secondary-400: #a1a1aa;
  --color-secondary-500: #71717a;  /* Main secondary */
  --color-secondary-600: #52525b;
  --color-secondary-700: #3f3f46;
  --color-secondary-800: #27272a;
  --color-secondary-900: #18181b;
  --color-secondary-950: #09090b;

  /* Accent Colors - For highlights and CTAs */
  --color-accent-50: #fff7ed;
  --color-accent-100: #ffedd5;
  --color-accent-200: #fed7aa;
  --color-accent-300: #fdba74;
  --color-accent-400: #fb923c;
  --color-accent-500: #f97316;   /* Main accent */
  --color-accent-600: #ea580c;
  --color-accent-700: #c2410c;
  --color-accent-800: #9a3412;
  --color-accent-900: #7c2d12;
  --color-accent-950: #431407;

  /* Semantic Colors - Consistent across themes */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
  --color-info-700: #1d4ed8;

  /* Neutral Colors - Grays and backgrounds */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  /* Typography */
  --font-family-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-family-serif: ui-serif, Georgia, serif;
  --font-family-mono: ui-monospace, 'JetBrains Mono', monospace;

  /* Font Sizes */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */

  /* Font Weights */
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1-5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  --space-2-5: 0.625rem;   /* 10px */
  --space-3: 0.75rem;      /* 12px */
  --space-3-5: 0.875rem;   /* 14px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-8: 2rem;         /* 32px */
  --space-10: 2.5rem;      /* 40px */
  --space-12: 3rem;        /* 48px */
  --space-16: 4rem;        /* 64px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */

  /* Border Radius */
  --border-radius-none: 0;
  --border-radius-sm: 0.125rem;    /* 2px */
  --border-radius-base: 0.25rem;   /* 4px */
  --border-radius-md: 0.375rem;    /* 6px */
  --border-radius-lg: 0.5rem;      /* 8px */
  --border-radius-xl: 0.75rem;     /* 12px */
  --border-radius-2xl: 1rem;       /* 16px */
  --border-radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  /* Z-Index */
  --z-dropdown: 10;
  --z-modal: 50;
  --z-toast: 100;
}
```

## 2. Component Styles (components.css)

### Button Component Template
```css
/* Button Base Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  text-decoration: none;
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  gap: var(--space-1-5);
}

.btn-base {
  padding: var(--space-2-5) var(--space-4);
  font-size: var(--font-size-base);
  gap: var(--space-2);
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-lg);
  gap: var(--space-2-5);
}

/* Button Variants - Customize these per theme */
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
}

.btn-secondary {
  background-color: var(--color-secondary-500);
  color: white;
}

.btn-secondary:hover {
  background-color: var(--color-secondary-600);
}

/* Add more component styles... */
```

## 3. Utility Classes (utilities.css)

```css
/* Spacing Utilities */
.m-0 { margin: var(--space-0); }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
/* Continue pattern... */

.p-0 { padding: var(--space-0); }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
/* Continue pattern... */

/* Color Utilities */
.text-primary { color: var(--color-primary-500); }
.text-secondary { color: var(--color-secondary-500); }
.text-accent { color: var(--color-accent-500); }

.bg-primary { background-color: var(--color-primary-500); }
.bg-secondary { background-color: var(--color-secondary-500); }
.bg-accent { background-color: var(--color-accent-500); }

/* Typography Utilities */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }

.font-thin { font-weight: var(--font-weight-thin); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-bold { font-weight: var(--font-weight-bold); }
```

## 4. Main Theme Export (index.css)

```css
@import './tokens.css';
@import './components.css';
@import './utilities.css';

/* Theme-specific global styles */
body {
  font-family: var(--font-family-sans);
  color: var(--color-gray-900);
  background-color: var(--color-gray-50);
  line-height: var(--line-height-normal);
}

/* Theme-specific customizations */
```

## Theme-Specific Customization Guide

### Student Theme
- **Primary Colors**: Bright, engaging colors (blues, greens)
- **Typography**: Friendly, rounded fonts
- **Components**: Playful, gamified elements
- **Spacing**: Generous for young users

### Teacher Theme  
- **Primary Colors**: Professional, authoritative colors (navy, burgundy)
- **Typography**: Clean, readable fonts
- **Components**: Data-focused, efficient layouts
- **Spacing**: Compact for productivity

### Admin Theme
- **Primary Colors**: Neutral, system colors (grays, blues)
- **Typography**: Technical, monospace accents
- **Components**: Dashboard-focused, information-dense
- **Spacing**: Minimal for maximum content

## Implementation Steps

1. **Copy Template**: Start with this template structure
2. **Customize Colors**: Update primary, secondary, and accent colors
3. **Adjust Typography**: Select appropriate fonts and sizes
4. **Style Components**: Customize component variants
5. **Test Across Devices**: Ensure responsive behavior
6. **Document Changes**: Add theme-specific documentation

## Usage Example

```svelte
<!-- In your Svelte component -->
<div class="theme-{theme-name}">
  <button class="btn btn-primary btn-lg">
    Primary Action
  </button>
</div>
```

```typescript
// In your app
import '@educational-app/ui/themes/{theme-name}';
```