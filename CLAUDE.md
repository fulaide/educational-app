# Educational App Platform - Claude Context Guide

## Project Overview

Building a comprehensive educational app platform for primary school students learning reading and writing. This is a monorepo project targeting German students initially, with multi-language support planned.

## Core Requirements

### Applications Needed

- **Student App**: SvelteKit + Capacitor (iOS/Android mobile-first)
- **Teacher Portal**: SvelteKit web application
- **Parent Portal**: SvelteKit web application
- **Admin Dashboard**: Internal management tools

### Key Features

- **Offline-First Architecture**: Students must be able to use app without internet
- **Multi-Role Authentication**: Students (UUID), Teachers (email), Parents (linked via student codes)
- **Gamification**: XP system, achievements, virtual pets/companions
- **Progress Tracking**: Real-time sync between offline and online data
- **COPPA/GDPR Compliance**: No PII collection for students
- **Monetization**: Freemium model with school/district licensing

## Technology Stack (Latest 2025 Versions)

### Core Framework

- **Monorepo**: Turborepo (2.3+) - 40-85% faster builds with remote caching
- **Framework**: SvelteKit (2.8+) with Svelte 5 runes syntax
- **Language**: TypeScript (5.6+) in strict mode
- **Styling**: Tailwind CSS (4.0+) with new performance engine

### Mobile & Desktop

- **Mobile**: Capacitor (6.1+) for iOS/Android deployment
- **Desktop**: Architecture prepared for future Tauri integration
- **Platform Abstraction**: Dependency injection for cross-platform compatibility

### Backend & Database

- **Database**: Prisma (6.10.1+) with PostgreSQL (server) + SQLite (offline)
- **API**: tRPC (11.0+) with trpc-sveltekit (3.6.3) for type-safe APIs
- **Auth**: Auth.js (latest) with JWT strategy and multi-role support
- **Validation**: Zod (3.23+) for runtime schema validation

### Development & Testing

- **Testing**: Vitest (unit), Playwright (E2E), Testing Library (components)
- **Linting**: ESLint + Prettier with shared configs
- **CI/CD**: GitHub Actions with Vercel deployment
- **Version Control**: Conventional commits with Husky pre-commit hooks

## Project Structure

```
educational-app/
├── apps/
│   ├── student-app/          # SvelteKit + Capacitor
│   ├── teacher-portal/       # SvelteKit web
│   ├── parent-portal/        # SvelteKit web
│   └── admin-dashboard/      # Internal tools
├── packages/
│   ├── ui/                   # Shared Svelte 5 components
│   ├── database/             # Prisma schema & client
│   ├── api/                  # tRPC routers & procedures
│   ├── sync-engine/          # Offline-first sync logic
│   ├── auth/                 # Auth.js configuration
│   ├── types/                # Shared TypeScript types
│   └── platform/             # Platform abstraction layer
├── infrastructure/
│   ├── docker/               # Development containers
│   └── scripts/              # Build & deployment automation
└── docs/                     # Technical documentation
```

## Key Architectural Patterns

### Svelte 5 Runes Syntax (No Stores)

```typescript
// Use reactive classes in .svelte.ts files
export class StudentProgress {
  xp = $state(0);
  level = $derived(Math.floor(this.xp / 100) + 1);

  addXP(points: number) {
    this.xp += points;
  }
}
```

**CRITICAL: $derived Common Mistakes**

```svelte
<!-- ❌ WRONG: $derived with function that needs to be called -->
const label = $derived(() => {
  if (condition) return 'A';
  else return 'B';
});
// Then using: {label()} - This renders the function as a string!

<!-- ✅ CORRECT: $derived with direct expression -->
const label = $derived(condition ? 'A' : 'B');
// Then using: {label} - This renders the actual value

<!-- ❌ WRONG: Calling a $derived value like a function -->
<button title={switchToLabel()}>  <!-- Error: not callable -->

<!-- ✅ CORRECT: Using $derived value directly -->
<button title={switchToLabel}>  <!-- Works correctly -->
```

**Key Rules:**

- `$derived` creates a **reactive value**, not a function
- Never wrap the expression in `() => { ... }` unless you actually want to derive a function
- Never call a `$derived` value with `()` - use it directly
- For complex logic, use ternary operators or extract to a separate function that returns the value

### Platform Abstraction

```typescript
// packages/platform/index.ts
export interface PlatformAdapter {
  storage: StorageAdapter;
  camera: CameraAdapter;
  qrScanner: QRAdapter;
}

export function getPlatform(): PlatformAdapter {
  if (window.__TAURI__) return new TauriPlatform(); // Future desktop
  if (window.Capacitor) return new CapacitorPlatform(); // Mobile
  return new WebPlatform(); // Fallback
}
```

### Multi-Role Authentication

```typescript
// Student: UUID-based (no email required)
// Teacher: Email/password with organization
// Parent: Link via student code, then email
// Admin: Enhanced security with 2FA
```

### Offline-First Sync

```typescript
// Queue operations while offline
// Batch sync when online
// Conflict resolution strategies
// Version tracking with rollback capability
```

## Development Phases

### Phase 1: Foundation (Weeks 1-2)

- [ ] Turborepo monorepo setup
- [ ] SvelteKit apps with Svelte 5 runes
- [ ] Basic authentication (UUID for students)
- [ ] SQLite offline storage setup
- [ ] QR code generation/scanning

### Phase 2: Core Learning (Weeks 3-4)

- [ ] Learning modules with progress tracking
- [ ] Teacher class management dashboard
- [ ] Basic gamification (XP, achievements)
- [ ] tRPC API with Zod validation

### Phase 3: Mobile & Sync (Weeks 5-6)

- [ ] Capacitor mobile app deployment
- [ ] Offline sync engine implementation
- [ ] Parent portal with child linking
- [ ] Push notifications system

### Phase 4: Advanced Features (Weeks 7-8)

- [ ] Payment integration (Paddle)
- [ ] Advanced gamification features
- [ ] Multi-language support (German)
- [ ] Performance optimization & testing

## Important Context Notes

### Privacy & Security

- **COPPA Compliant**: No PII for students under 13
- **Anonymous Profiles**: Students use UUID-based login
- **Parent Consent**: Required for data collection
- **Data Encryption**: All sensitive data encrypted at rest/transit

### Performance Priorities

- **Mobile-First**: Student app must work smoothly on older devices
- **Offline-Capable**: Core learning features work without internet
- **Fast Sync**: Efficient data synchronization when online
- **Minimal Bundle**: Optimize for slow network connections

### Content Strategy

- **Grade 1 German**: Initial target audience
- **Vocabulary Focus**: 50 core words for MVP
- **Gamified Learning**: Progress through levels and achievements
- **Teacher Control**: Assignments and progress monitoring

## Development Commands

```bash
npm run dev              # Run all apps in development
npm run dev:student      # Run student app only
npm run build            # Build all applications
npm run test             # Run complete test suite
npm run lint             # Lint all packages
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed development data
```

## Critical Success Factors

1. **Student Engagement**: Gamification must feel rewarding, not forced
2. **Teacher Adoption**: Dashboard must be intuitive and time-saving
3. **Parent Involvement**: Easy progress visibility and reward management
4. **Technical Performance**: Smooth offline/online transitions
5. **Scalability**: Architecture must support thousands of concurrent users

## CRUD Implementation Standards

### **Mandatory CRUD Pattern for All Forms**

All Create, Read, Update, Delete operations MUST follow this standardized pattern for consistency and user experience:

#### **1. Form Configuration with SuperForms + Zod**

```typescript
const editForm = superForm(data.editForm, {
  validators: zodClient(editSchema),
  id: 'editResource',
  onUpdated({ form }) {
    if (form.valid && form.message) {
      notifications.success(form.message);
      closeModal(); // Close any overlays/modals
      invalidateAll(); // Refresh page data
    } else if (form.message) {
      notifications.error(form.message);
    }
  },
  onError({ result }) {
    notifications.error('Operation failed. Please try again.');
  }
});

const { form, enhance, submitting } = editForm;
```

#### **2. UI Reactivity with Svelte 5 Runes**

```typescript
// ✅ Correct: Use $derived for reactive data access
const items = $derived(data.items);
const availableItems = $derived(data.availableItems);

// ❌ Incorrect: Static destructuring breaks reactivity
const { items, availableItems } = data;
```

#### **3. Loading States with Visual Feedback**

```svelte
<button
  type="submit"
  disabled={$submitting}
  class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
>
  {#if $submitting}
    <svg class="animate-spin mr-2 h-4 w-4">...</svg>
    Processing...
  {:else}
    Save Changes
  {/if}
</button>
```

#### **4. Toast Notifications for All Operations**

- **Success**: `notifications.success("Item updated successfully!")`
- **Error**: `notifications.error("Failed to update item.")`
- **Loading**: Optional loading toasts for long operations

#### **5. Automatic UI Synchronization**

- Use `invalidateAll()` in `onUpdated` callbacks
- Ensure reactive data access with `$derived`
- Close modals/overlays after successful operations
- Reset form state appropriately

#### **Required Elements Checklist:**

- [ ] SuperForm with proper validation
- [ ] Toast notifications (success/error)
- [ ] Loading indicators during submission
- [ ] Button disabled states while submitting
- [ ] UI reactivity with `$derived` or proper reactive patterns
- [ ] `invalidateAll()` for data refresh
- [ ] Modal/overlay auto-close on success
- [ ] Consistent error handling

#### **Example Implementation:**

```svelte
// Form setup
const removeForm = superForm(data.removeForm, {
  validators: zodClient(removeSchema),
  onUpdated({ form }) {
    if (form.valid && form.message) {
      notifications.success(form.message);
      confirmRemove = null; // Close modal
      invalidateAll(); // Refresh data
    } else if (form.message) {
      notifications.error(form.message);
    }
  }
});

// Template with loading state
<button type="submit" disabled={$submitting}>
  {#if $submitting}
    <LoadingSpinner />
    Removing...
  {:else}
    Remove Item
  {/if}
</button>
```

This pattern ensures consistent, professional user experience across all CRUD operations in the application.

## Tailwind CSS Monorepo Configuration Pattern

### **Architecture: Shared Preset for UI Package**

The UI package provides a Tailwind preset that all apps import. This ensures UI component classes are never purged, eliminating the need for error-prone safelist configurations.

#### **How It Works**

**UI Package Preset** (`packages/ui/tailwind-preset.js`):

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  // Preset includes UI package content paths
  // Apps automatically scan these paths when using the preset
  content: [
    './node_modules/@educational-app/ui/src/**/*.{html,js,svelte,ts}',
    './node_modules/@educational-app/ui/dist/**/*.{html,js,svelte,ts}',
    '../../packages/ui/src/**/*.{html,js,svelte,ts}', // Monorepo dev
    '../../packages/ui/dist/**/*.{html,js,svelte,ts}' // Monorepo dev
  ],
  theme: {
    extend: {
      // Apps can extend this
    }
  },
  safelist: [] // No safelist needed!
};
```

**App Configuration** (e.g., `apps/teacher-portal/tailwind.config.js`):

```javascript
import uiPreset from '@educational-app/ui/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  // Use preset for UI package content scanning
  presets: [uiPreset],

  // Only scan app-specific files
  content: ['./src/**/*.{html,js,svelte,ts}'],

  // No safelist for UI components needed!
  // Only add app-specific dynamic classes if required
  safelist: []
};
```

#### **Key Benefits**

✅ **No safelist maintenance** - UI component classes are automatically detected
✅ **Single source of truth** - UI package controls its own content paths
✅ **Proper Tailwind architecture** - Uses official preset pattern
✅ **Works with Tailwind v4** - Compatible with new `@theme` system
✅ **Future-proof** - Easy to publish as NPM package

#### **Theme Tokens with Tailwind v4**

Semantic tokens are defined in CSS `@theme` blocks in theme files:

```css
/* packages/ui/src/lib/themes/teacher.css */
@theme {
  --color-primary-500: #79c71b;
  --color-secondary-500: #d946ef;
  /* ... all semantic tokens */
}
```

These tokens automatically become Tailwind utilities (`bg-primary-500`, `text-primary-500`, etc.) and are preserved because the preset scans the UI package files.

#### **Adding New Apps**

1. Create `tailwind.config.js` in the app:

```javascript
import uiPreset from '@educational-app/ui/tailwind-preset';

export default {
  presets: [uiPreset],
  content: ['./src/**/*.{html,js,svelte,ts}']
};
```

2. Import theme CSS in app layout:

```svelte
<script>
  import '@educational-app/ui/themes/teacher'; // or student/parent/admin
</script>
```

3. Done! All UI components will work correctly.

#### **Troubleshooting**

If UI component styles are missing:

1. Verify preset is imported: `import uiPreset from '@educational-app/ui/tailwind-preset'`
2. Confirm preset in config: `presets: [uiPreset]`
3. Rebuild UI package: `npm run build --workspace=@educational-app/ui`
4. Restart dev server

**No safelist workarounds needed!** The preset handles everything.

## Component Styling Standards

### **Philosophy: Pure Tailwind Utility-First with Component-Scoped Patterns**

All UI package components MUST follow this styling approach for consistency, maintainability, and proper Tailwind integration.

#### **Core Principles**

1. **No Custom CSS Classes for Component Styles** - Use Tailwind utilities directly
2. **Component-Scoped Style Patterns** - Define reusable class strings within components using `cn()` helper
3. **Minimal Global Utilities** - `components.css` only contains truly global patterns (`.sr-only`, `.safe-*`, print utilities)
4. **Semantic Tokens as Tailwind Utilities** - Theme tokens become standard Tailwind classes (`bg-primary-500`, `text-danger-600`)

#### **The Pattern**

**✅ Component-Scoped Styles with `cn()` Helper:**

```svelte
<script lang="ts">
  import { cn } from '$lib/utils/index.js';

  interface Props {
    error?: string;
    disabled?: boolean;
    class?: string;
  }

  let { error, disabled, class: className }: Props = $props();

  // Define component-scoped style patterns
  const labelClasses = 'block text-sm font-medium text-neutral-900 mb-2';

  // Use $derived for reactive class composition
  const inputClasses = $derived(
    cn(
      // Base styles
      'w-full px-3 py-3 bg-surface border rounded-lg',
      'text-neutral-900 placeholder:text-neutral-400',
      'transition-colors duration-200',

      // Focus states with semantic tokens
      'focus:outline-none focus:border-primary-500',
      'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary-500)_10%,transparent)]',

      // Disabled states
      'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-neutral-100',

      // Conditional error state
      error && 'border-danger-500 focus:border-danger-500',
      !error && 'border-neutral-200',

      // Allow custom classes
      className
    )
  );

  const errorClasses = 'mt-1 text-sm text-danger-600';
</script>

<div>
  <label class={labelClasses}>Username</label>
  <input class={inputClasses} {disabled} />
  {#if error}
    <p class={errorClasses}>{error}</p>
  {/if}
</div>
```

**❌ WRONG - Avoid Custom CSS Classes:**

```css
/* components.css - DON'T do this */
.form-input {
  @apply w-full px-3 py-3 bg-surface border rounded-lg;
}

.text-error {
  color: var(--color-text-error);
}
```

```svelte
<!-- Component - DON'T do this -->
<input class="form-input" />
<p class="text-error">{error}</p>
```

**Why this is wrong:**

- Creates awkward class names like `text-text-primary` (custom class `.text-*` vs Tailwind utility `text-*`)
- Mixing two philosophies (semantic CSS + utility-first)
- Harder to find where styles are defined
- Doesn't leverage Tailwind's full power

#### **Focus Rings with Semantic Tokens**

Use modern `color-mix()` for opacity effects with theme tokens:

```svelte
const focusRingClasses =
"focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary-500)_10%,transparent)]";
```

**Don't hardcode colors:**

```svelte
// ❌ WRONG - hardcoded color breaks theming const focusRing =
"focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"; // ✅ CORRECT - uses semantic token const focusRing
= "focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary-500)_10%,transparent)]";
```

#### **When to Use Global Utilities**

Only define classes in `components.css` when they are:

1. **Truly global** - Used across many unrelated components
2. **Not component-specific** - Not tied to a single component's design
3. **Standard patterns** - Accessibility helpers, safe areas, print styles

**Examples of valid global utilities:**

```css
/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  /* ... */
}

/* Mobile safe areas */
.safe-top {
  padding-top: env(safe-area-inset-top);
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Print utilities */
@media print {
  .print-hidden {
    display: none;
  }
}
```

#### **Component Examples**

**Simple Component (AuthHeader.svelte):**

```svelte
<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
  }
  let { title, subtitle }: Props = $props();
</script>

<div class="text-center mb-8">
  <h2 class="text-3xl font-bold text-neutral-900 mb-2">{title}</h2>
  {#if subtitle}
    <p class="text-sm text-neutral-600">{subtitle}</p>
  {/if}
</div>
```

**Complex Component (AuthPasswordInput.svelte):**

```svelte
<script lang="ts">
  import { cn } from '$lib/utils/index.js';
  import { Eye, EyeOff } from 'lucide-svelte';

  let { value = $bindable(''), error, class: className }: Props = $props();
  let showPassword = $state(false);

  const containerClasses = $derived(cn('relative', className));

  const inputClasses = $derived(
    cn(
      'w-full pr-10 px-3 py-3 bg-surface border rounded-lg',
      'text-neutral-900 placeholder:text-neutral-400',
      'transition-colors duration-200',
      'focus:outline-none focus:border-primary-500',
      'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary-500)_10%,transparent)]',
      error && 'border-danger-500 focus:border-danger-500',
      !error && 'border-neutral-200'
    )
  );

  const toggleButtonClasses =
    'absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-primary-600 transition-colors';
</script>

<div class={containerClasses}>
  <input type={showPassword ? 'text' : 'password'} bind:value class={inputClasses} />
  <button type="button" class={toggleButtonClasses} onclick={() => (showPassword = !showPassword)}>
    <svelte:component this={showPassword ? EyeOff : Eye} class="h-5 w-5" />
  </button>
  {#if error}
    <p class="mt-1 text-sm text-danger-600">{error}</p>
  {/if}
</div>
```

#### **Semantic Token Usage**

Always use semantic tokens from theme files:

```svelte
<!-- ✅ CORRECT - semantic tokens -->
<button class="bg-primary-500 hover:bg-primary-600 text-white">Primary</button>
<button class="bg-secondary-500 hover:bg-secondary-600 text-white">Secondary</button>
<p class="text-danger-600">Error message</p>
<div class="border-neutral-200 bg-surface">Content</div>

<!-- ❌ WRONG - hardcoded colors -->
<button class="bg-blue-500 hover:bg-blue-600">Primary</button>
<p class="text-red-600">Error message</p>
```

**Available Semantic Token Scales:**

- `primary-{50-950}` - Primary brand color
- `secondary-{50-950}` - Secondary brand color
- `neutral-{50-950}` - Gray scale
- `danger-{50-950}` - Error/destructive states
- `success-{50-950}` - Success states
- `warning-{50-950}` - Warning states
- `info-{50-950}` - Info states

**Special Semantic Tokens:**

- `surface` - Background surfaces
- `surface-hover` - Interactive surface hover
- `border` - Default border color
- `text` - Primary text color
- `text-secondary` - Secondary text color
- `text-muted` - Muted text color

#### **Migration Checklist**

When creating or updating UI components:

1. **Remove Custom Classes**
   - [ ] No custom classes in `components.css` for component-specific styles
   - [ ] Use Tailwind utilities directly in component templates

2. **Component-Scoped Patterns**
   - [ ] Define reusable class strings as constants in component `<script>`
   - [ ] Use `cn()` helper for conditional class composition
   - [ ] Use `$derived` for reactive class generation

3. **Semantic Tokens**
   - [ ] All colors use semantic tokens (`primary-500`, `danger-600`, etc.)
   - [ ] No hardcoded color values (`#79c71b`, `rgb()`, `rgba()`)
   - [ ] Focus rings use `color-mix()` with semantic tokens

4. **Tailwind Utilities Only**
   - [ ] All styling via Tailwind utilities
   - [ ] No `@apply` in CSS files for component styles
   - [ ] Components.css only contains global utilities

#### **Quick Reference**

**DO:**

- ✅ Use Tailwind utilities directly in component templates
- ✅ Define component-scoped class strings as constants
- ✅ Use `cn()` helper for conditional classes
- ✅ Use semantic tokens from theme files
- ✅ Keep components self-contained and maintainable

**DON'T:**

- ❌ Create custom CSS classes for component-specific styles
- ❌ Use `@apply` for component patterns
- ❌ Hardcode color values
- ❌ Put component styles in `components.css`
- ❌ Mix custom CSS classes with Tailwind utilities

## Next Steps After Setup

1. Create comprehensive GitHub issues for each development phase
2. Set up development environment with hot reloading
3. Implement basic student authentication (UUID + QR codes)
4. Build first learning module with progress tracking
5. Test offline functionality thoroughly

---

_This document should be referenced in all future Claude sessions for consistent context and decision-making._
