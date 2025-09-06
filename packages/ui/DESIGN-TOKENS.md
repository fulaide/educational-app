# Design Token System Guide

## Overview

Our design token system follows industry best practices with a three-layer hierarchy that ensures consistency, maintainability, and scalability across all applications.

## Token Architecture

### 1. Base/Primitive Tokens (Raw Values)
Foundation-level values that define the raw materials of the design system:

```css
/* Colors */
--color-blue-50: #eff6ff;
--color-blue-600: #2563eb;

/* Typography */
--font-size-base: 1rem;
--font-weight-medium: 500;

/* Spacing */
--space-4: 1rem;
--space-8: 2rem;
```

### 2. Semantic Tokens (Contextual Meaning)
Context-aware tokens that define the meaning and usage of primitive values:

```css
/* Surface colors - what things sit on */
--color-surface-primary: var(--color-white);     /* Main page background */
--color-surface-secondary: var(--color-neutral-50); /* Cards, panels */
--color-surface-tertiary: var(--color-neutral-100);  /* Nested elements */

/* Text colors - what we read */
--color-text-primary: var(--color-neutral-900);   /* Main content */
--color-text-secondary: var(--color-neutral-700); /* Supporting text */
--color-text-brand: var(--color-blue-600);        /* Links, highlights */

/* Interactive colors - what we click/touch */
--color-interactive-primary: var(--color-blue-600);
--color-interactive-primary-hover: var(--color-blue-700);
```

### 3. Component Tokens (Specific Overrides)
Component-specific tokens that define how individual components should look:

```css
/* Button tokens */
--button-primary-bg: var(--color-interactive-primary);
--button-primary-text: var(--color-text-inverse);
--button-primary-padding-x: var(--space-4);

/* Form tokens */
--input-border: var(--color-border-primary);
--input-border-focus: var(--color-border-focus);
--input-padding-x: var(--space-3);
```

## Token Categories

### Surface Hierarchy
- `--color-surface-primary`: Main page background
- `--color-surface-secondary`: Card/panel backgrounds  
- `--color-surface-tertiary`: Nested element backgrounds
- `--color-surface-brand`: Brand-colored surfaces
- `--color-surface-overlay`: Modal/popup backgrounds

### Text Hierarchy
- `--color-text-primary`: Main content text
- `--color-text-secondary`: Supporting/secondary text
- `--color-text-tertiary`: Labels, captions, metadata
- `--color-text-placeholder`: Form placeholder text
- `--color-text-disabled`: Disabled state text
- `--color-text-inverse`: Text on dark backgrounds

### Interactive States
- `--color-interactive-primary`: Primary actions
- `--color-interactive-primary-hover`: Hover state
- `--color-interactive-secondary`: Secondary actions
- `--color-interactive-focus`: Focus indicators
- `--color-interactive-disabled`: Disabled controls

### Status Colors
- `--color-status-success`: Success messages/indicators
- `--color-status-warning`: Warning messages/indicators
- `--color-status-error`: Error messages/indicators
- `--color-status-info`: Informational messages

### Semantic Spacing
- `--spacing-component-xs` to `--spacing-component-xl`: Component internal spacing
- `--spacing-layout-xs` to `--spacing-layout-xl`: Page layout spacing

### Typography Scale
- `--text-heading-1` to `--text-heading-3`: Heading hierarchy
- `--text-body-lg`, `--text-body`, `--text-body-sm`: Body text sizes
- `--text-caption`: Small text for labels/metadata

## Usage Guidelines

### 1. Always Use Semantic Tokens
❌ **Don't use primitive tokens directly:**
```css
.my-component {
  background: var(--color-blue-50); /* Too specific, no context */
}
```

✅ **Use semantic tokens:**
```css
.my-component {
  background: var(--color-surface-secondary); /* Clear meaning */
}
```

### 2. Follow the Surface Hierarchy
Create visual depth using surface layers:
```css
.page-background {
  background: var(--color-surface-primary);
}

.card {
  background: var(--color-surface-secondary);
}

.nested-panel {
  background: var(--color-surface-tertiary);
}
```

### 3. Use Status Colors Appropriately
```css
.success-message {
  background: var(--color-status-success-bg);
  color: var(--color-status-success);
  border: 1px solid var(--color-border-success);
}
```

### 4. Component Token Pattern
For reusable components, define component-specific tokens:
```css
/* Define component tokens */
.my-component {
  background: var(--my-component-bg, var(--color-surface-secondary));
  padding: var(--my-component-padding, var(--spacing-component-md));
  border-radius: var(--my-component-radius, var(--radius-lg));
}
```

## Theme Implementation

### 1. Import Theme
```css
/* In your app.css */
@import '@educational-app/ui/themes/parent-tokens';
@import 'tailwindcss';
```

### 2. Apply Utility Classes
Use semantic utility classes in components:
```svelte
<div class="surface-secondary text-primary">
  <h2 class="heading-2 text-brand">Title</h2>
  <p class="body text-secondary">Description</p>
</div>
```

### 3. Custom CSS with Tokens
```css
.custom-component {
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
  padding: var(--spacing-component-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```

## Testing Your Tokens

Visit `/design-test` in any application to see all tokens in action:
- Surface layers and visual hierarchy
- Typography scale and text colors  
- Interactive elements and states
- Status messages and feedback
- Card components and elevation

## Best Practices

### 1. Be Consistent
- Always use the established token hierarchy
- Don't create one-off custom properties
- Follow naming conventions

### 2. Think Semantically
- Ask "what does this represent?" not "what color is it?"
- Use contextual names (`surface-primary`) not descriptive ones (`light-gray`)

### 3. Plan for Scale
- Design tokens should work across light/dark themes
- Consider color contrast and accessibility
- Think about component reuse

### 4. Document Usage
- Comment your token usage in complex components
- Explain why specific tokens were chosen
- Update this guide when adding new patterns

## Token Extension

To add new tokens:

1. **Add primitive values** (if needed)
2. **Create semantic mappings**
3. **Define component-specific tokens**
4. **Test in the design-test page**
5. **Update this documentation**

## Cross-Theme Compatibility

This token system is designed to work across all portals (Student, Teacher, Parent, Admin). Each theme implements the same semantic structure but with portal-appropriate values.

The semantic layer ensures that components work consistently regardless of which theme is applied.