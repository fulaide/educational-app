# Layout System

Modern responsive dashboard layout components for the educational app platform.

## Components

### AppLayout

Root layout wrapper that provides theme management and layout context.

```svelte
<script>
  import { AppLayout } from '@educational-app/ui';
</script>

<AppLayout theme="auto" sidebarCollapsed={false}>
  <!-- Your app content here -->
  <h1>Welcome to the Dashboard</h1>
</AppLayout>
```

### Layout Context

Access layout state and controls from any child component:

```svelte
<script>
  import { getLayoutContext } from '@educational-app/ui';
  
  const layout = getLayoutContext();
  
  function toggleSidebar() {
    layout.sidebar.toggle();
  }
</script>

<button onclick={toggleSidebar}>
  {layout.sidebar.isOpen ? 'Close' : 'Open'} Sidebar
</button>

<p>Current breakpoint: {layout.breakpoint}</p>
<p>Mobile view: {layout.isMobile}</p>
```

## Props

### AppLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme variant to apply |
| `sidebarCollapsed` | `boolean` | `false` | Initial sidebar collapsed state |
| `sidebarPersistent` | `boolean` | `true` | Whether to persist sidebar state |
| `class` | `string` | `''` | Additional CSS classes |
| `showSidebarOnMobile` | `boolean` | `false` | Show sidebar on mobile devices |

## Layout Context API

### Breakpoint Information
- `breakpoint: Breakpoint` - Current breakpoint (`'mobile' | 'tablet' | 'desktop' | 'wide'`)
- `isMobile: boolean` - True if mobile breakpoint
- `isTablet: boolean` - True if tablet breakpoint  
- `isDesktop: boolean` - True if desktop breakpoint

### Sidebar State & Controls
- `sidebar.isOpen: boolean` - Sidebar open state
- `sidebar.isCollapsed: boolean` - Sidebar collapsed state
- `sidebar.toggle()` - Toggle sidebar
- `sidebar.open()` - Open sidebar
- `sidebar.close()` - Close sidebar
- `sidebar.collapse()` - Collapse sidebar
- `sidebar.expand()` - Expand sidebar

### Drawer State & Controls
- `drawer.isOpen: boolean` - Drawer open state
- `drawer.content: string | null` - Drawer content identifier
- `drawer.open(content?, size?)` - Open drawer with optional content
- `drawer.close()` - Close drawer
- `drawer.toggle()` - Toggle drawer

## Breakpoints

- **Mobile**: 0px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Wide**: 1440px+

## CSS Custom Properties

The layout system provides CSS custom properties for consistent styling:

```css
.my-component {
  width: var(--sidebar-width-expanded); /* 280px */
  transition: width var(--duration-normal) var(--ease-out);
  z-index: var(--z-sidebar);
}
```

### Available Properties

#### Layout
- `--sidebar-width-expanded: 280px`
- `--sidebar-width-collapsed: 64px`
- `--drawer-max-width: 480px`
- `--header-height: 64px`
- `--footer-height: 64px`

#### Animation
- `--duration-fast: 150ms`
- `--duration-normal: 250ms`
- `--duration-slow: 350ms`
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)`

#### Z-Index Layers
- `--z-sidebar: 40`
- `--z-drawer: 50`
- `--z-backdrop: 45`
- `--z-toast: 60`

## Accessibility

The layout system is fully accessible with:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management for modals/drawers
- Reduced motion support

## Next Steps

This is Phase 1 of the layout system. Upcoming components:

1. **Sidebar** - Responsive navigation sidebar
2. **MainContent** - Adaptive content area with slots
3. **Drawer** - Modal drawer with gesture support
4. **Navigation** - Sidebar navigation items

See the GitHub issues for implementation progress.