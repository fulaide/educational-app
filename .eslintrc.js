/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'@typescript-eslint/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	},
	overrides: [
		// Svelte files
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			extends: [
				'eslint:recommended',
				'@typescript-eslint/recommended',
				'plugin:svelte/recommended',
				'plugin:svelte/prettier'
			],
			rules: {
				// Svelte 5 specific rules
				'svelte/valid-compile': 'error',
				'svelte/no-at-debug-tags': 'warn',
				'svelte/no-reactive-functions': 'error',
				'svelte/no-reactive-literals': 'error',
				
				// Allow unused vars in Svelte files for runes
				'@typescript-eslint/no-unused-vars': [
					'error',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_|\\$\\$Props|\\$\\$Events|\\$\\$Slots',
						destructuredArrayIgnorePattern: '^_'
					}
				],
				
				// Svelte 5 runes compatibility
				'no-undef': 'off', // Svelte 5 runes like $state, $effect are global
				'prefer-const': 'error',
				'no-var': 'error'
			}
		},
		
		// TypeScript files
		{
			files: ['*.ts', '*.tsx'],
			extends: [
				'eslint:recommended',
				'@typescript-eslint/recommended',
				'@typescript-eslint/recommended-requiring-type-checking'
			],
			parserOptions: {
				project: true
			},
			rules: {
				'@typescript-eslint/no-unused-vars': [
					'error',
					{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
				],
				'@typescript-eslint/consistent-type-imports': [
					'error',
					{ prefer: 'type-imports', fixStyle: 'separate-type-imports' }
				],
				'@typescript-eslint/no-unnecessary-condition': 'error',
				'@typescript-eslint/no-non-null-assertion': 'warn',
				'@typescript-eslint/prefer-nullish-coalescing': 'error',
				'@typescript-eslint/prefer-optional-chain': 'error'
			}
		},
		
		// Test files
		{
			files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
			extends: ['plugin:vitest/recommended'],
			env: {
				vitest: true
			}
		},
		
		// Storybook files
		{
			files: ['**/*.stories.@(js|jsx|ts|tsx|svelte)'],
			extends: ['plugin:storybook/recommended'],
			env: {
				browser: true
			}
		},
		
		// Configuration files
		{
			files: ['*.config.js', '*.config.ts', '*.config.mjs'],
			env: {
				node: true
			}
		}
	],
	
	// Global rules for all files
	rules: {
		// Code quality
		'no-console': 'warn',
		'no-debugger': 'warn',
		'prefer-const': 'error',
		'no-var': 'error',
		'object-shorthand': 'error',
		'prefer-template': 'error',
		
		// Import rules
		'sort-imports': [
			'error',
			{
				ignoreCase: false,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				allowSeparatedGroups: true
			}
		],
		
		// Accessibility
		'jsx-a11y/no-autofocus': 'off' // Sometimes needed in modals
	},
	
	// Ignore patterns
	ignorePatterns: [
		'**/.svelte-kit/**',
		'**/build/**',
		'**/dist/**',
		'**/node_modules/**',
		'**/*.d.ts',
		'**/coverage/**',
		'**/storybook-static/**',
		'**/ios/**',
		'**/android/**'
	]
};