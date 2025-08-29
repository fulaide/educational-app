/** @type {import("prettier").Config} */
module.exports = {
	// Base formatting
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	semi: true,
	tabWidth: 2,
	
	// Svelte-specific
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
				svelteAllowShorthand: true,
				svelteBracketNewLine: false,
				svelteIndentScriptAndStyle: true,
				svelteStrictMode: false
			}
		},
		{
			files: ['*.json', '*.md', '*.yaml', '*.yml'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		},
		{
			files: '*.ts',
			options: {
				parser: 'typescript'
			}
		}
	],
	
	// File patterns to ignore
	ignorePatterns: [
		'**/.svelte-kit/**',
		'**/build/**',
		'**/dist/**',
		'**/node_modules/**',
		'**/coverage/**',
		'**/storybook-static/**',
		'**/ios/**',
		'**/android/**',
		'**/package-lock.json',
		'**/pnpm-lock.yaml'
	]
};