# Sidebar Styles Mapping

## Current Hardcoded Styles Used in Sidebar Components

### Background Colors
- `bg-white/50` - Main sidebar background (semi-transparent white)
- `bg-white/5` - Header/footer background (very subtle white)
- `bg-white/30` - Active state, ads, mobile menu toggle
- `bg-white/80` - User avatar backgrounds
- `bg-white/95` - Tooltip background

### Interactive States  
- `hover:bg-white/30` - Hover state for toggle buttons
- `hover:bg-white/50` - Hover state for navigation items and mobile toggle

### Text Colors
- `text-gray-500` - Section titles, secondary text, ad text
- `text-gray-600` - Icons, navigation item text (default state)  
- `text-gray-700` - Brand text, avatar initials
- `text-gray-800` - Active navigation text, user names, mobile brand
- `text-gray-900` - Navigation item text on hover

### Border Colors
- `border-white/30` - Mobile navigation bar border
- `border-white/40` - Section dividers
- `border-white/60` - User avatar borders  
- `border-white/70` - Active state borders, ad borders, tooltip borders

### Shadow
- `shadow-[inset_0_0_0_0.4px_theme(colors.white/30)]` - Glassmorphism inset border effect

## Proposed Semantic Token Mapping

```css
/* Backgrounds */
--color-sidebar-background: rgb(255 255 255 / 0.5);    /* bg-white/50 */
--color-sidebar-header-bg: rgb(255 255 255 / 0.05);    /* bg-white/5 */
--color-sidebar-active-bg: rgb(255 255 255 / 0.3);     /* bg-white/30 */
--color-sidebar-avatar-bg: rgb(255 255 255 / 0.8);     /* bg-white/80 */
--color-sidebar-tooltip-bg: rgb(255 255 255 / 0.95);   /* bg-white/95 */

/* Interactive */
--color-sidebar-hover-subtle: rgb(255 255 255 / 0.3);  /* hover:bg-white/30 */
--color-sidebar-hover-medium: rgb(255 255 255 / 0.5);  /* hover:bg-white/50 */

/* Text */
--color-sidebar-text-secondary: var(--color-neutral-500);  /* text-gray-500 */
--color-sidebar-text-default: var(--color-neutral-600);    /* text-gray-600 */  
--color-sidebar-text-strong: var(--color-neutral-700);     /* text-gray-700 */
--color-sidebar-text-active: var(--color-neutral-800);     /* text-gray-800 */
--color-sidebar-text-hover: var(--color-neutral-900);      /* text-gray-900 */

/* Borders */
--color-sidebar-border-light: rgb(255 255 255 / 0.3);   /* border-white/30 */
--color-sidebar-border-medium: rgb(255 255 255 / 0.4);  /* border-white/40 */
--color-sidebar-border-strong: rgb(255 255 255 / 0.6);  /* border-white/60 */
--color-sidebar-border-accent: rgb(255 255 255 / 0.7);  /* border-white/70 */
```

This mapping ensures 1:1 correspondence between current hardcoded styles and semantic tokens.