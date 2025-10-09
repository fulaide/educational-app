# Educational App Theme System

A comprehensive design token-based theme system for the educational app platform, supporting multiple user roles with distinct visual identities.

## Overview

The theme system provides:
- **Design Token Architecture**: Standardized CSS custom properties
- **Multi-Role Support**: Distinct themes for Parent, Student, Teacher, and Admin portals
- **Dynamic Theme Switching**: Runtime theme changes with persistence
- **Component Integration**: Theme-aware components and utilities
- **Automated Generation**: Scripts for creating new themes

## Available Themes

### 🌿 Parent Theme
- **Colors**: Warm greens and earth tones
- **Personality**: Family-oriented, welcoming
- **Use Case**: Parent portal for monitoring child progress

### 🎨 Student Theme  
- **Colors**: Bright blues and engaging colors
- **Personality**: Playful, motivating
- **Use Case**: Student learning portal with gamification

### 📚 Teacher Theme
- **Colors**: Professional slate and purple accents
- **Personality**: Authoritative, efficient
- **Use Case**: Teacher dashboard for class management

### ⚙️ Admin Theme
- **Colors**: Neutral grays with systematic accents
- **Personality**: Clean, data-focused
- **Use Case**: Administrative dashboard for system management

## Quick Start

### Basic Usage
```typescript
// Import theme CSS files directly in your app
import '@educational-app/ui/themes/parent/index.css';

// Use theme management utilities
import { applyThemeClass, THEMES } from '@educational-app/ui';
applyThemeClass('parent');
```

### With Theme Switcher Component
```svelte
<script>
  import { ThemeSwitcher } from '@educational-app/ui';
</script>

<ThemeSwitcher defaultTheme="parent" showNames={true} size="md" />
```

### Manual Theme Management
```typescript
import { 
  initializeThemeSystem, 
  switchTheme, 
  getCurrentTheme,
  createThemeStore 
} from '@educational-app/ui';

// Initialize on app startup
initializeThemeSystem('parent');

// Switch themes dynamically
await switchTheme('student');

// Get current theme
const current = getCurrentTheme(); // 'student'

// Use reactive store (Svelte)
const themeStore = createThemeStore();
await themeStore.switchTo('teacher');
```

## Creating New Themes

### Using the Generator Script
```bash
# Navigate to UI package
cd packages/ui

# Generate a new theme
node scripts/create-theme.js mytheme

# Available built-in themes:
node scripts/create-theme.js student
node scripts/create-theme.js teacher  
node scripts/create-theme.js admin
```

### Manual Theme Creation
1. **Create theme directory**: `src/lib/themes/mytheme/`
2. **Copy template files** from `docs/design-tokens-template.md`
3. **Customize colors** in `tokens.css`
4. **Style components** in `components.css`
5. **Add utilities** in `utilities.css`
6. **Configure exports** in `index.css`

## Design Token Structure

### Color System
```css
:root {
  /* Primary Brand Colors */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #0ea5e9;  /* Main primary */
  --color-primary-950: #082f49;

  /* Secondary Supporting Colors */
  --color-secondary-500: #22c55e;

  /* Accent Highlight Colors */
  --color-accent-500: #f97316;

  /* Semantic Status Colors */
  --color-success-500: #22c55e;
  --color-warning-500: #f59e0b;
  --color-error-500: #ef4444;
  --color-info-500: #3b82f6;
}
```

### Typography System
```css
:root {
  /* Font Families */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-2xl: 1.5rem;    /* 24px */

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Spacing System
```css
:root {
  /* Consistent spacing scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-4: 1rem;      /* 16px */
  --space-8: 2rem;      /* 32px */
}
```

## Component Integration

### Theme-Aware Components
```svelte
<!-- Components automatically use theme tokens -->
<Button variant="primary" size="lg">
  Primary Action
</Button>

<Card>
  <CardHeader>Theme-styled content</CardHeader>
</Card>
```

### Utility Classes
```svelte
<!-- Use theme-aware utility classes -->
<div class="bg-primary text-white p-4 rounded-lg shadow-md">
  Themed content block
</div>
```

### Custom Styling
```css
/* Reference theme tokens in custom CSS */
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--space-4);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}
```

## Advanced Usage

### Theme Context in Svelte
```svelte
<script>
  import { createThemeStore } from '@educational-app/ui';
  
  const theme = createThemeStore();
  theme.initialize('parent');
  
  // Reactive theme state
  $: console.log('Current theme:', theme.theme);
</script>

<div class="theme-{theme.theme}">
  <p>Content styled for {theme.theme} theme</p>
  <button onclick={() => theme.switchTo('student')}>
    Switch to Student Theme
  </button>
</div>
```

### Theme Persistence
```typescript
// Themes are automatically persisted in localStorage
// and restored on page reload

import { getStoredTheme, setStoredTheme } from '@educational-app/ui';

// Check stored preference
const preferred = getStoredTheme(); // 'parent' | 'student' | etc.

// Save preference
setStoredTheme('teacher');
```

### Dynamic Theme Loading
```typescript
// Themes are loaded dynamically to reduce initial bundle size
import { loadTheme, applyThemeClass } from '@educational-app/ui';

// Load theme CSS
await loadTheme('admin');

// Apply theme classes to body
applyThemeClass('admin');
```

## File Structure

```
packages/ui/src/lib/themes/
├── parent/
│   ├── tokens.css         # Design tokens
│   ├── components.css     # Component styles  
│   ├── utilities.css      # Utility classes
│   └── index.css         # Main theme file
├── student/
├── teacher/  
├── admin/
└── ...

scripts/
└── create-theme.js       # Theme generator

docs/
└── design-tokens-template.md  # Template guide
```

## Best Practices

### 1. Use Design Tokens
```css
/* ✅ Good - uses design tokens */
.button {
  background: var(--color-primary-500);
  padding: var(--space-3);
  border-radius: var(--border-radius-md);
}

/* ❌ Avoid - hardcoded values */
.button {
  background: #0ea5e9;
  padding: 12px;
  border-radius: 6px;
}
```

### 2. Theme-Specific Customization
```css
/* Theme-specific overrides */
.theme-student .button {
  /* More playful styling for students */
  border-radius: var(--border-radius-xl);
  font-weight: var(--font-weight-bold);
}

.theme-admin .button {
  /* More minimal styling for admin */
  box-shadow: none;
  font-weight: var(--font-weight-normal);
}
```

### 3. Responsive Design
```css
/* Themes work with responsive design */
@media (max-width: 640px) {
  .theme-student .card {
    padding: var(--space-3);
    border-radius: var(--border-radius-lg);
  }
}
```

## Migration Guide

### From Existing Styles
1. **Identify colors** used in current components
2. **Map to design tokens** in theme files
3. **Replace hardcoded values** with CSS custom properties
4. **Test across themes** to ensure consistency

### Adding New Components
1. **Define component styles** in `components.css`
2. **Use design tokens** for all values
3. **Add theme-specific overrides** if needed
4. **Test with ThemeSwitcher** component

## Troubleshooting

### Theme Not Loading
```typescript
// Check if theme exists
import { THEMES } from '@educational-app/ui';
console.log(Object.keys(THEMES)); // ['parent', 'student', ...]

// Verify CSS file paths
console.log(THEMES.parent.cssUrl); // '/themes/parent/index.css'
```

### Styles Not Applying
```css
/* Ensure proper specificity */
.theme-parent .my-component {
  /* Theme-specific styles */
}

/* Check CSS custom property syntax */
color: var(--color-primary-500); /* ✅ Correct */
color: var(color-primary-500);   /* ❌ Missing dashes */
```

### Theme Switching Issues
```typescript
// Check for JavaScript errors in console
// Verify theme files are accessible
// Test with manual theme loading

import { loadTheme } from '@educational-app/ui';
try {
  await loadTheme('student');
  console.log('✅ Theme loaded successfully');
} catch (error) {
  console.error('❌ Theme loading failed:', error);
}
```

## Contributing

### Adding New Themes
1. **Fork repository** and create feature branch
2. **Use theme generator**: `node scripts/create-theme.js newtheme`
3. **Customize design tokens** for your use case
4. **Test with existing components**
5. **Submit pull request** with theme documentation

### Modifying Existing Themes
1. **Edit theme files** in `src/lib/themes/themename/`
2. **Test across all portals** that use the theme
3. **Verify backward compatibility**
4. **Update documentation** if needed

## Performance

- **Dynamic Loading**: Themes loaded on-demand
- **CSS Custom Properties**: Native browser support
- **Minimal Bundle Impact**: Only active theme loaded
- **Persistent Caching**: Themes cached after first load

## Browser Support

- **Modern Browsers**: Full support (Chrome 49+, Firefox 31+, Safari 9.1+)
- **CSS Custom Properties**: Required feature
- **Local Storage**: Used for theme persistence
- **Dynamic Imports**: Used for theme loading