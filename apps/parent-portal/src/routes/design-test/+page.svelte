<script>
	import { APP_NAME } from '$lib/constants';
	
	// Sample data for testing
	let formData = {
		name: '',
		email: '',
		message: ''
	};
	
	let showSuccess = false;
	let showError = false;
	let isLoading = false;
	
	function handleSubmit() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
			showSuccess = true;
		}, 1000);
	}
</script>

<svelte:head>
	<title>Design Token Test - {APP_NAME}</title>
</svelte:head>

<div class="design-test-container">
	<header class="design-test-header">
		<h1 class="heading-1">Design Token System Test</h1>
		<p class="body-lg text-secondary">Testing semantic tokens for the Parent Portal theme</p>
	</header>

	<!-- Surface & Background Tests -->
	<section class="test-section">
		<h2 class="heading-2">Surface Layers</h2>
		<div class="surface-test-grid">
			<div class="surface-primary test-card">
				<h3 class="heading-3">Primary Surface</h3>
				<p class="body">Main background color (surface-primary)</p>
			</div>
			<div class="surface-secondary test-card">
				<h3 class="heading-3">Secondary Surface</h3>
				<p class="body">Card/panel background (surface-secondary)</p>
			</div>
			<div class="surface-tertiary test-card">
				<h3 class="heading-3">Tertiary Surface</h3>
				<p class="body">Nested elements (surface-tertiary)</p>
			</div>
			<div class="surface-brand test-card">
				<h3 class="heading-3">Brand Surface</h3>
				<p class="body">Brand-colored background (surface-brand)</p>
			</div>
		</div>
	</section>

	<!-- Typography Tests -->
	<section class="test-section">
		<h2 class="heading-2">Typography Scale</h2>
		<div class="typography-test">
			<h1 class="heading-1">Heading 1 - Main Page Title</h1>
			<h2 class="heading-2">Heading 2 - Section Title</h2>
			<h3 class="heading-3">Heading 3 - Subsection</h3>
			<p class="body-lg">Large body text for important content</p>
			<p class="body">Regular body text for main content</p>
			<p class="body-sm">Small body text for secondary information</p>
			<p class="caption">Caption text for labels and metadata</p>
		</div>
	</section>

	<!-- Text Color Tests -->
	<section class="test-section">
		<h2 class="heading-2">Text Colors</h2>
		<div class="text-color-test">
			<p class="text-primary">Primary text - main content</p>
			<p class="text-secondary">Secondary text - supporting content</p>
			<p class="text-tertiary">Tertiary text - captions and labels</p>
			<p class="text-brand">Brand text - links and highlights</p>
			<p class="text-success">Success text - positive messages</p>
			<p class="text-warning">Warning text - cautionary messages</p>
			<p class="text-error">Error text - error messages</p>
		</div>
	</section>

	<!-- Interactive Elements Tests -->
	<section class="test-section">
		<h2 class="heading-2">Interactive Elements</h2>
		<div class="interactive-test">
			<button class="btn-primary" disabled={isLoading}>
				{isLoading ? 'Loading...' : 'Primary Button'}
			</button>
			<button class="btn-secondary">Secondary Button</button>
			<button class="btn-primary" disabled>Disabled Button</button>
			
			<div class="form-test">
				<label class="form-label" for="test-input">Form Input</label>
				<input 
					id="test-input"
					class="form-input" 
					type="text" 
					placeholder="Enter your name"
					bind:value={formData.name}
				/>
				
				<label class="form-label" for="test-email">Email Input</label>
				<input 
					id="test-email"
					class="form-input" 
					type="email" 
					placeholder="your@email.com"
					bind:value={formData.email}
				/>
				
				<label class="form-label" for="test-textarea">Textarea</label>
				<textarea 
					id="test-textarea"
					class="form-input" 
					placeholder="Enter your message"
					bind:value={formData.message}
					rows="3"
				></textarea>
			</div>
		</div>
	</section>

	<!-- Status Messages Tests -->
	<section class="test-section">
		<h2 class="heading-2">Status Messages</h2>
		<div class="status-test">
			<div class="status-success">
				<strong>Success:</strong> Your changes have been saved successfully!
			</div>
			<div class="status-warning">
				<strong>Warning:</strong> Please review your information before proceeding.
			</div>
			<div class="status-error">
				<strong>Error:</strong> There was a problem processing your request.
			</div>
			<div class="status-info">
				<strong>Info:</strong> You have 3 new notifications waiting.
			</div>
		</div>
	</section>

	<!-- Card Tests -->
	<section class="test-section">
		<h2 class="heading-2">Card Components</h2>
		<div class="card-test-grid">
			<div class="card">
				<h3 class="heading-3">Basic Card</h3>
				<p class="body">This is a basic card component using our design tokens for background, borders, and spacing.</p>
				<button class="btn-primary">Action Button</button>
			</div>
			<div class="card">
				<h3 class="heading-3">Progress Card</h3>
				<p class="body-sm text-secondary">Child's Learning Progress</p>
				<div class="progress-example">
					<div class="progress-bar">
						<div class="progress-fill" style="width: 75%"></div>
					</div>
					<p class="caption text-tertiary">75% Complete</p>
				</div>
			</div>
			<div class="card">
				<h3 class="heading-3">Achievement Card</h3>
				<p class="body-sm text-brand">🎉 New Achievement Unlocked!</p>
				<p class="body">Your child completed the Reading Module with excellent scores.</p>
			</div>
		</div>
	</section>
</div>

<style>
	/* Import our token system */
	@import '@educational-app/ui/themes/parent';
	
	.design-test-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-layout-md);
		background: var(--color-surface-primary);
		color: var(--color-text-primary);
		font-family: var(--font-family-primary);
	}
	
	.design-test-header {
		text-align: center;
		margin-bottom: var(--spacing-layout-lg);
		padding: var(--spacing-layout-md);
		background: var(--color-surface-brand);
		border-radius: var(--radius-2xl);
	}
	
	.test-section {
		margin-bottom: var(--spacing-layout-lg);
		padding: var(--spacing-layout-md);
		background: var(--color-surface-secondary);
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border-primary);
	}
	
	/* Typography Classes */
	.heading-1 {
		font-size: var(--text-heading-1);
		font-weight: var(--text-heading-1-weight);
		line-height: var(--text-heading-1-line-height);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-component-md);
	}
	
	.heading-2 {
		font-size: var(--text-heading-2);
		font-weight: var(--text-heading-2-weight);
		line-height: var(--text-heading-2-line-height);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-component-lg);
	}
	
	.heading-3 {
		font-size: var(--text-heading-3);
		font-weight: var(--text-heading-3-weight);
		line-height: var(--text-heading-3-line-height);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-component-sm);
	}
	
	.body-lg {
		font-size: var(--text-body-lg);
		font-weight: var(--text-body-lg-weight);
		line-height: var(--text-body-lg-line-height);
		margin-bottom: var(--spacing-component-md);
	}
	
	.body {
		font-size: var(--text-body);
		font-weight: var(--text-body-weight);
		line-height: var(--text-body-line-height);
		margin-bottom: var(--spacing-component-md);
	}
	
	.body-sm {
		font-size: var(--text-body-sm);
		font-weight: var(--text-body-sm-weight);
		line-height: var(--text-body-sm-line-height);
		margin-bottom: var(--spacing-component-sm);
	}
	
	.caption {
		font-size: var(--text-caption);
		font-weight: var(--text-caption-weight);
		line-height: var(--text-caption-line-height);
		color: var(--color-text-tertiary);
		margin-bottom: var(--spacing-component-xs);
	}
	
	/* Text Color Classes */
	.text-primary { color: var(--color-text-primary); }
	.text-secondary { color: var(--color-text-secondary); }
	.text-tertiary { color: var(--color-text-tertiary); }
	.text-brand { color: var(--color-text-brand); }
	.text-success { color: var(--color-text-success); }
	.text-warning { color: var(--color-text-warning); }
	.text-error { color: var(--color-text-error); }
	
	/* Surface Classes */
	.surface-primary { background: var(--color-surface-primary); }
	.surface-secondary { background: var(--color-surface-secondary); }
	.surface-tertiary { background: var(--color-surface-tertiary); }
	.surface-brand { background: var(--color-surface-brand); }
	
	/* Test Grids */
	.surface-test-grid, .card-test-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--spacing-component-lg);
		margin-top: var(--spacing-component-lg);
	}
	
	.test-card {
		padding: var(--spacing-component-lg);
		border-radius: var(--radius-xl);
		border: 1px solid var(--color-border-primary);
	}
	
	.typography-test, .text-color-test, .status-test {
		margin-top: var(--spacing-component-lg);
	}
	
	.typography-test > *, .text-color-test > * {
		margin-bottom: var(--spacing-component-md);
	}
	
	/* Interactive Elements */
	.interactive-test {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-component-md);
		align-items: flex-start;
		margin-top: var(--spacing-component-lg);
	}
	
	.btn-primary {
		background: var(--button-primary-bg);
		color: var(--button-primary-text);
		border: none;
		border-radius: var(--button-primary-radius);
		padding: var(--button-primary-padding-y) var(--button-primary-padding-x);
		font-family: inherit;
		font-size: var(--text-body);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}
	
	.btn-primary:hover:not(:disabled) {
		background: var(--button-primary-bg-hover);
	}
	
	.btn-primary:disabled {
		background: var(--color-interactive-disabled);
		cursor: not-allowed;
	}
	
	.btn-secondary {
		background: var(--button-secondary-bg);
		color: var(--button-secondary-text);
		border: 1px solid var(--button-secondary-border);
		border-radius: var(--button-primary-radius);
		padding: var(--button-primary-padding-y) var(--button-primary-padding-x);
		font-family: inherit;
		font-size: var(--text-body);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}
	
	.btn-secondary:hover {
		background: var(--button-secondary-bg-hover);
	}
	
	/* Form Elements */
	.form-test {
		flex: 1;
		min-width: 300px;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-component-md);
	}
	
	.form-label {
		font-size: var(--text-body-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}
	
	.form-input {
		background: var(--input-bg);
		border: 1px solid var(--input-border);
		border-radius: var(--input-radius);
		padding: var(--input-padding-y) var(--input-padding-x);
		font-family: inherit;
		font-size: var(--text-body);
		color: var(--input-text);
		transition: border-color 0.2s ease;
	}
	
	.form-input:focus {
		outline: none;
		border-color: var(--input-border-focus);
		box-shadow: 0 0 0 3px var(--color-border-focus)1a;
	}
	
	.form-input::placeholder {
		color: var(--input-placeholder);
	}
	
	/* Status Messages */
	.status-success, .status-warning, .status-error, .status-info {
		padding: var(--spacing-component-md);
		border-radius: var(--radius-lg);
		margin-bottom: var(--spacing-component-md);
		font-size: var(--text-body-sm);
	}
	
	.status-success {
		background: var(--color-status-success-bg);
		color: var(--color-status-success);
		border: 1px solid var(--color-border-success);
	}
	
	.status-warning {
		background: var(--color-status-warning-bg);
		color: var(--color-status-warning);
		border: 1px solid var(--color-amber-300);
	}
	
	.status-error {
		background: var(--color-status-error-bg);
		color: var(--color-status-error);
		border: 1px solid var(--color-border-error);
	}
	
	.status-info {
		background: var(--color-status-info-bg);
		color: var(--color-status-info);
		border: 1px solid var(--color-blue-300);
	}
	
	/* Cards */
	.card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--card-radius);
		padding: var(--card-padding);
		box-shadow: var(--card-shadow);
		transition: box-shadow 0.2s ease;
	}
	
	.card:hover {
		box-shadow: var(--card-shadow-hover);
	}
	
	/* Progress Example */
	.progress-example {
		margin-top: var(--spacing-component-md);
	}
	
	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-surface-tertiary);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--spacing-component-sm);
	}
	
	.progress-fill {
		height: 100%;
		background: var(--color-interactive-primary);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}
</style>