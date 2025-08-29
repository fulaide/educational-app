/** @type {import('lint-staged').Config} */
module.exports = {
	// TypeScript and JavaScript files
	'**/*.{js,ts,mjs}': [
		'eslint --fix',
		'prettier --write'
	],
	
	// Svelte files
	'**/*.svelte': [
		'eslint --fix',
		'prettier --write --plugin prettier-plugin-svelte'
	],
	
	// JSON files
	'**/*.json': [
		'prettier --write'
	],
	
	// Markdown files
	'**/*.md': [
		'prettier --write'
	],
	
	// Package.json files (special handling for workspace dependencies)
	'**/package.json': [
		'prettier --write',
		// Validate package.json structure
		'node -e "JSON.parse(require(\'fs\').readFileSync(process.argv[1], \'utf8\'))"'
	],
	
	// Prisma schema files
	'**/schema.prisma': [
		'prisma format'
	],
	
	// CSS and styling files
	'**/*.{css,scss,sass}': [
		'prettier --write'
	],
	
	// Configuration files
	'**/*.{yml,yaml}': [
		'prettier --write'
	],
	
	// Educational content files (if using specific formats)
	'**/*.{lesson,vocab}.json': [
		'prettier --write',
		// Custom validation for educational content
		'node scripts/validate-content.js'
	]
};