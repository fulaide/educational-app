/**
 * ResponsiveContainer Component Types
 * TypeScript definitions for responsive container with grid and animation support
 */
// Grid layout presets
export const GRID_PRESETS = {
    'cards-sm': {
        mobile: 1,
        tablet: 2,
        desktop: 3,
        wide: 4
    },
    'cards-md': {
        mobile: 1,
        tablet: 2,
        desktop: 2,
        wide: 3
    },
    'cards-lg': {
        mobile: 1,
        tablet: 1,
        desktop: 2,
        wide: 2
    },
    'list': {
        mobile: 1,
        tablet: 1,
        desktop: 1,
        wide: 1
    },
    'masonry': {
        mobile: 1,
        tablet: 2,
        desktop: 3,
        wide: 4
    }
};
// Gap presets for different content types
export const GAP_PRESETS = {
    'tight': {
        mobile: 'gap-2',
        tablet: 'gap-3',
        desktop: 'gap-4'
    },
    'normal': {
        mobile: 'gap-4',
        tablet: 'gap-6',
        desktop: 'gap-8'
    },
    'loose': {
        mobile: 'gap-6',
        tablet: 'gap-8',
        desktop: 'gap-12'
    },
    'extra-loose': {
        mobile: 'gap-8',
        tablet: 'gap-12',
        desktop: 'gap-16'
    }
};
// Padding presets
export const PADDING_PRESETS = {
    'none': {
        mobile: 'p-0',
        tablet: 'p-0',
        desktop: 'p-0'
    },
    'sm': {
        mobile: 'p-3',
        tablet: 'p-4',
        desktop: 'p-6'
    },
    'md': {
        mobile: 'p-4',
        tablet: 'p-6',
        desktop: 'p-8'
    },
    'lg': {
        mobile: 'p-6',
        tablet: 'p-8',
        desktop: 'p-12'
    },
    'xl': {
        mobile: 'p-8',
        tablet: 'p-12',
        desktop: 'p-16'
    }
};
// Animation presets for containers
export const CONTAINER_ANIMATION_PRESETS = {
    'fade-in': {
        mobile: { duration: 300, easing: 'ease-out' },
        tablet: { duration: 250, easing: 'ease-out' },
        desktop: { duration: 200, easing: 'ease-out' }
    },
    'slide-up': {
        mobile: { duration: 400, easing: 'ease-out' },
        tablet: { duration: 350, easing: 'ease-out' },
        desktop: { duration: 300, easing: 'ease-out' }
    },
    'scale-in': {
        mobile: { duration: 350, easing: 'ease-bounce' },
        tablet: { duration: 300, easing: 'ease-bounce' },
        desktop: { duration: 250, easing: 'ease-bounce' }
    }
};
