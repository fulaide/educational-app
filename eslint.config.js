import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	// Global ignores
	{
		ignores: [
			'**/.svelte-kit/**',
			'**/build/**',
			'**/dist/**',
			'**/node_modules/**',
			'**/*.d.ts',
			'**/coverage/**',
			'**/ios/**',
			'**/android/**'
		]
	},

	// TypeScript and JS files
	{
		files: ['**/*.ts', '**/*.js', '**/*.mjs'],
		plugins: { '@typescript-eslint': tsPlugin },
		languageOptions: {
			parser: tsParser,
			parserOptions: { sourceType: 'module', ecmaVersion: 2022 }
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'no-console': 'warn',
			'prefer-const': 'error',
			'no-var': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},

	// Svelte files
	{
		files: ['**/*.svelte'],
		plugins: {
			svelte: sveltePlugin,
			'@typescript-eslint': tsPlugin
		},
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				sourceType: 'module',
				ecmaVersion: 2022
			}
		},
		rules: {
			...sveltePlugin.configs.recommended.rules,
			'no-console': 'warn',
			'prefer-const': 'off', // Svelte 5 $props() destructuring requires `let`
			'no-var': 'error',
			'no-undef': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_|\\$\\$Props|\\$\\$Events|\\$\\$Slots'
				}
			]
		}
	}
];
