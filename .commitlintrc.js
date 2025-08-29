/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
	extends: ['@commitlint/config-conventional'],
	
	rules: {
		// Type enum - educational app specific types
		'type-enum': [
			2,
			'always',
			[
				'feat',      // New feature
				'fix',       // Bug fix
				'docs',      // Documentation changes
				'style',     // Code style changes (formatting, etc)
				'refactor',  // Code refactoring
				'perf',      // Performance improvements
				'test',      // Test changes
				'chore',     // Build process or auxiliary tool changes
				'ci',        // CI configuration changes
				'build',     // Build system changes
				'revert',    // Revert previous commit
				'wip',       // Work in progress (use sparingly)
				
				// Educational app specific
				'content',   // Educational content updates
				'ui',        // UI/UX improvements
				'mobile',    // Mobile-specific changes
				'auth',      // Authentication related
				'db',        // Database schema changes
				'api',       // API changes
				'sync',      // Offline sync improvements
				'perf'       // Performance optimizations
			]
		],
		
		// Scope enum - monorepo packages and apps
		'scope-enum': [
			1,
			'always',
			[
				// Apps
				'student-app',
				'teacher-portal', 
				'parent-portal',
				'admin-dashboard',
				
				// Packages
				'ui',
				'database',
				'api',
				'auth',
				'types',
				'sync-engine',
				'platform',
				
				// Infrastructure
				'ci',
				'deps',
				'config',
				'docs',
				'scripts',
				
				// Educational specific
				'gamification',
				'content',
				'qr-codes',
				'offline',
				'notifications',
				'analytics'
			]
		],
		
		// Message format
		'subject-case': [2, 'always', 'lower-case'],
		'subject-empty': [2, 'never'],
		'subject-max-length': [2, 'always', 72],
		'subject-min-length': [2, 'always', 10],
		'subject-full-stop': [2, 'never', '.'],
		
		// Header format
		'header-max-length': [2, 'always', 100],
		
		// Body and footer
		'body-leading-blank': [1, 'always'],
		'body-max-line-length': [2, 'always', 100],
		'footer-leading-blank': [1, 'always'],
		'footer-max-line-length': [2, 'always', 100]
	},
	
	// Custom parser for educational app conventions
	parserPreset: {
		parserOpts: {
			headerPattern: /^(\w*)(?:\(([^)]*)\))?!?: (.*)$/,
			headerCorrespondence: ['type', 'scope', 'subject'],
			referenceActions: [
				'close',
				'closes',
				'closed',
				'fix',
				'fixes',
				'fixed',
				'resolve',
				'resolves',
				'resolved'
			],
			issuePrefixes: ['EDU-', '#']
		}
	}
};