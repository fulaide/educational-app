import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: './tests',
	
	// Run tests in files in parallel
	fullyParallel: true,
	
	// Fail the build on CI if you accidentally left test.only in the source code
	forbidOnly: !!process.env.CI,
	
	// Retry on CI only
	retries: process.env.CI ? 2 : 0,
	
	// Opt out of parallel tests on CI
	workers: process.env.CI ? 1 : undefined,
	
	// Reporter to use
	reporter: [
		['html'],
		['json', { outputFile: 'test-results/results.json' }],
		['junit', { outputFile: 'test-results/results.xml' }]
	],
	
	// Shared settings for all the projects below
	use: {
		// Base URL to use in actions like `await page.goto('/')`.
		baseURL: 'http://localhost:5173',
		
		// Collect trace when retrying the failed test
		trace: 'on-first-retry',
		
		// Take screenshot on failure
		screenshot: 'only-on-failure',
		
		// Record video on failure
		video: 'retain-on-failure'
	},

	// Configure projects for major browsers
	projects: [
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
		},
		
		// Desktop browsers
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			dependencies: ['setup']
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
			dependencies: ['setup']
		},

		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
			dependencies: ['setup']
		},

		// Mobile browsers (important for student app)
		{
			name: 'Mobile Chrome',
			use: { ...devices['Pixel 5'] },
			dependencies: ['setup']
		},
		
		{
			name: 'Mobile Safari',
			use: { ...devices['iPhone 12'] },
			dependencies: ['setup']
		},

		// Tablet (for teacher/parent portals)
		{
			name: 'Tablet',
			use: { ...devices['iPad Pro'] },
			dependencies: ['setup']
		}
	],

	// Run your local dev server before starting the tests
	webServer: [
		{
			command: 'npm run dev:student',
			port: 5173,
			reuseExistingServer: !process.env.CI,
		},
		{
			command: 'npm run dev:teacher',
			port: 5174,
			reuseExistingServer: !process.env.CI,
		}
	],
	
	// Test output directory
	outputDir: 'test-results/',
	
	// Global setup and teardown
	globalSetup: require.resolve('./tests/global-setup.ts'),
	globalTeardown: require.resolve('./tests/global-teardown.ts'),
	
	// Timeout settings
	timeout: 30 * 1000,
	expect: {
		timeout: 5 * 1000
	}
});