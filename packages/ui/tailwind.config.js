/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Theme-aware colors using CSS Custom Properties
				primary: {
					DEFAULT: 'var(--color-primary)',
					dark: 'var(--color-primary-dark)', 
					light: 'var(--color-primary-light)',
					50: 'var(--color-primary-light)',
					500: 'var(--color-primary)',
					600: 'var(--color-primary)',
					700: 'var(--color-primary-dark)'
				},
				secondary: {
					DEFAULT: 'var(--color-secondary)',
					dark: 'var(--color-secondary-dark)',
					light: 'var(--color-secondary-light)',
					50: 'var(--color-secondary-light)',
					500: 'var(--color-secondary)',
					600: 'var(--color-secondary)',
					700: 'var(--color-secondary-dark)'
				},
				accent: {
					DEFAULT: 'var(--color-accent)',
					light: 'var(--color-accent-light)',
					50: 'var(--color-accent-light)',
					500: 'var(--color-accent)'
				},
				success: {
					DEFAULT: 'var(--color-success)',
					50: 'rgba(var(--color-success-rgb), 0.1)',
					500: 'var(--color-success)',
					600: 'var(--color-success)',
					700: 'var(--color-success)'
				},
				warning: {
					DEFAULT: 'var(--color-warning)',
					50: 'rgba(var(--color-warning-rgb), 0.1)',
					500: 'var(--color-warning)',
					600: 'var(--color-warning)',
					700: 'var(--color-warning)'
				},
				error: {
					DEFAULT: 'var(--color-error)',
					50: 'rgba(var(--color-error-rgb), 0.1)',
					500: 'var(--color-error)',
					600: 'var(--color-error)',
					700: 'var(--color-error)'
				},
				danger: {
					DEFAULT: 'var(--color-error)',
					50: 'rgba(var(--color-error-rgb), 0.1)',
					500: 'var(--color-error)',
					600: 'var(--color-error)',
					700: 'var(--color-error)'
				},
				info: {
					DEFAULT: 'var(--color-info)',
					500: 'var(--color-info)',
					600: 'var(--color-info)'
				},
				// Surface colors  
				background: 'var(--color-background)',
				surface: {
					DEFAULT: 'var(--color-surface)',
					hover: 'var(--color-surface-hover)',
					selected: 'var(--color-surface-selected)',
					elevated: 'var(--color-surface-elevated)'
				},
				// Text colors
				text: {
					primary: 'var(--color-text-primary)',
					secondary: 'var(--color-text-secondary)',
					disabled: 'var(--color-text-disabled)',
					muted: 'var(--color-text-muted)'
				},
				// Border colors
				border: {
					DEFAULT: 'var(--border-color)',
					focus: 'var(--border-color-focus)'
				}
			},
			fontFamily: {
				// Theme-aware font families using CSS custom properties
				sans: 'var(--font-family-primary)',
				primary: 'var(--font-family-primary)',
				secondary: 'var(--font-family-secondary)',
				display: 'var(--font-family-secondary)',
				
				// Fallbacks
				'inter': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
			},
			fontSize: {
				// Theme-aware font sizes using CSS custom properties  
				'xs': 'var(--font-size-xs)',
				'sm': 'var(--font-size-sm)',
				'base': 'var(--font-size-base)',
				'lg': 'var(--font-size-lg)',
				'xl': 'var(--font-size-xl)',
				'2xl': 'var(--font-size-2xl)',
				'3xl': 'var(--font-size-3xl)'
			},
			spacing: {
				// Theme-aware spacing using CSS custom properties
				'xs': 'var(--spacing-xs)',
				'sm': 'var(--spacing-sm)',
				'md': 'var(--spacing-md)',
				'lg': 'var(--spacing-lg)',
				'xl': 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
				'3xl': 'var(--spacing-3xl)'
			},
			borderRadius: {
				// Theme-aware border radius
				'sm': 'var(--border-radius-sm)',
				'DEFAULT': 'var(--border-radius-md)',
				'md': 'var(--border-radius-md)',
				'lg': 'var(--border-radius-lg)',
				'xl': 'var(--border-radius-xl)',
				'full': 'var(--border-radius-full)'
			},
			animation: {
				'bounce-subtle': 'bounce-subtle 2s infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite',
				'star-twinkle': 'star-twinkle 2s ease-in-out infinite',
				'confetti': 'confetti 3s ease-out forwards'
			},
			keyframes: {
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(-5%)',
						'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(0)',
						'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'star-twinkle': {
					'0%, 100%': { 
						opacity: '1',
						transform: 'scale(1)' 
					},
					'50%': { 
						opacity: '0.5',
						transform: 'scale(1.2)' 
					}
				},
				'confetti': {
					'0%': {
						transform: 'translateY(0) rotateZ(0deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(-100vh) rotateZ(720deg)',
						opacity: '0'
					}
				}
			},
			boxShadow: {
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
				'glow-green': '0 0 20px rgba(34, 197, 94, 0.15)',
				'glow-yellow': '0 0 20px rgba(251, 191, 36, 0.15)'
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem'
			}
		}
	},
	plugins: []
};