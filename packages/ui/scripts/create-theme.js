#!/usr/bin/env node

/**
 * Theme Generator Script
 * Creates a new theme directory with standardized structure and placeholder tokens
 * 
 * Usage: node scripts/create-theme.js <theme-name>
 * Example: node scripts/create-theme.js student
 */

import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const THEME_CONFIGS = {
  student: {
    primaryColors: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main primary
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    secondaryColors: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0', 
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main secondary
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    accentColors: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74', 
      400: '#fb923c',
      500: '#f97316', // Main accent
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407'
    },
    description: 'Bright, engaging theme for student portal'
  },

  teacher: {
    primaryColors: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Main primary
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617'
    },
    secondaryColors: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', // Main secondary
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e'
    },
    accentColors: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main accent
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03'
    },
    description: 'Professional theme for teacher portal'
  },

  admin: {
    primaryColors: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280', // Main primary
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    secondaryColors: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Main secondary
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22'
    },
    accentColors: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main accent
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    description: 'Clean, systematic theme for admin dashboard'
  }
};

function generateTokensCSS(themeName, config) {
  const { primaryColors, secondaryColors, accentColors } = config;
  
  return `:root {
  /* Primary Colors - ${config.description} */
${Object.entries(primaryColors).map(([key, value]) => 
  `  --color-primary-${key}: ${value};`
).join('\n')}

  /* Secondary Colors */
${Object.entries(secondaryColors).map(([key, value]) => 
  `  --color-secondary-${key}: ${value};`
).join('\n')}

  /* Accent Colors */
${Object.entries(accentColors).map(([key, value]) => 
  `  --color-accent-${key}: ${value};`
).join('\n')}

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

  /* Neutral Colors */
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
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

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
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-2-5: 0.625rem;
  --space-3: 0.75rem;
  --space-3-5: 0.875rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius */
  --border-radius-none: 0;
  --border-radius-sm: 0.125rem;
  --border-radius-base: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-2xl: 1rem;
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
}`;
}

function generateComponentsCSS(themeName) {
  return `/* ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme Components */

/* Button Components */
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

.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--color-secondary-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  background-color: var(--color-secondary-600);
  box-shadow: var(--shadow-md);
}

.btn-accent {
  background-color: var(--color-accent-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-accent:hover {
  background-color: var(--color-accent-600);
  box-shadow: var(--shadow-md);
}

/* Card Components */
.card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}

.card-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
}

.card-body {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
}

/* Input Components */
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgb(var(--color-primary-500) / 0.1);
}

/* Add more component styles as needed */`;
}

function generateUtilitiesCSS() {
  return `/* Utility Classes */

/* Spacing Utilities */
.m-0 { margin: var(--space-0); }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-5 { margin: var(--space-5); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

.p-0 { padding: var(--space-0); }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-5 { padding: var(--space-5); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

/* Margin Top/Bottom/Left/Right */
.mt-0 { margin-top: var(--space-0); }
.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }

.mb-0 { margin-bottom: var(--space-0); }
.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }

/* Color Utilities */
.text-primary { color: var(--color-primary-500); }
.text-secondary { color: var(--color-secondary-500); }
.text-accent { color: var(--color-accent-500); }
.text-gray { color: var(--color-gray-500); }

.bg-primary { background-color: var(--color-primary-500); }
.bg-secondary { background-color: var(--color-secondary-500); }
.bg-accent { background-color: var(--color-accent-500); }

/* Typography Utilities */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }

.font-thin { font-weight: var(--font-weight-thin); }
.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

/* Layout Utilities */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.block { display: block; }
.inline-block { display: inline-block; }
.hidden { display: none; }

.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }

.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }

/* Border Radius Utilities */
.rounded-none { border-radius: var(--border-radius-none); }
.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded { border-radius: var(--border-radius-base); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-xl { border-radius: var(--border-radius-xl); }
.rounded-full { border-radius: var(--border-radius-full); }

/* Shadow Utilities */
.shadow-none { box-shadow: none; }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow { box-shadow: var(--shadow-base); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }`;
}

function generateIndexCSS(themeName) {
  return `@import './tokens.css';
@import './components.css';
@import './utilities.css';

/* ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme Global Styles */
.theme-${themeName} {
  font-family: var(--font-family-sans);
  color: var(--color-gray-900);
  background-color: var(--color-gray-50);
  line-height: var(--line-height-normal);
}

.theme-${themeName} body {
  font-family: var(--font-family-sans);
  color: var(--color-gray-900);
  background-color: var(--color-gray-50);
}

/* Theme-specific customizations */
.theme-${themeName} .navbar {
  background-color: var(--color-primary-500);
  color: white;
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-md);
}

.theme-${themeName} .sidebar {
  background-color: white;
  border-right: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.theme-${themeName} .main-content {
  background-color: var(--color-gray-50);
  min-height: 100vh;
  padding: var(--space-6);
}`;
}

async function createTheme(themeName) {
  if (!themeName || !THEME_CONFIGS[themeName]) {
    console.error('❌ Please provide a valid theme name.');
    console.log('Available themes:', Object.keys(THEME_CONFIGS).join(', '));
    process.exit(1);
  }

  const config = THEME_CONFIGS[themeName];
  const themeDir = join(__dirname, '..', 'src', 'lib', 'themes', themeName);

  try {
    // Create theme directory
    await mkdir(themeDir, { recursive: true });
    console.log(`📁 Created directory: ${themeDir}`);

    // Generate and write files
    const files = [
      {
        name: 'tokens.css',
        content: generateTokensCSS(themeName, config)
      },
      {
        name: 'components.css', 
        content: generateComponentsCSS(themeName)
      },
      {
        name: 'utilities.css',
        content: generateUtilitiesCSS()
      },
      {
        name: 'index.css',
        content: generateIndexCSS(themeName)
      }
    ];

    for (const file of files) {
      const filePath = join(themeDir, file.name);
      await writeFile(filePath, file.content);
      console.log(`✅ Created: ${file.name}`);
    }

    console.log(`\n🎉 Successfully created ${themeName} theme!`);
    console.log(`📍 Location: ${themeDir}`);
    console.log(`📄 Description: ${config.description}`);
    console.log(`\nTo use this theme, import it in your app:`);
    console.log(`import '@educational-app/ui/themes/${themeName}';`);

  } catch (error) {
    console.error('❌ Error creating theme:', error.message);
    process.exit(1);
  }
}

// Get theme name from command line arguments
const themeName = process.argv[2];

if (!themeName) {
  console.log('Usage: node scripts/create-theme.js <theme-name>');
  console.log('Available themes:', Object.keys(THEME_CONFIGS).join(', '));
  process.exit(1);
}

createTheme(themeName);