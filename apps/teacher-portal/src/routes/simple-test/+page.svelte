<script lang="ts">
	// Test without any imports from media-manager first
	let message = 'Simple test page loaded successfully!';
</script>

<svelte:head>
	<title>Simple Test - Teacher Portal</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<div class="bg-white shadow rounded-lg p-8">
			<h1 class="text-2xl font-bold text-gray-900 mb-6">Simple Test Page</h1>
			<p class="text-gray-600">{message}</p>
			
			<div class="mt-6">
				<h2 class="text-lg font-semibold mb-4">Testing Steps:</h2>
				<ol class="list-decimal list-inside space-y-2 text-gray-600">
					<li>✅ This page loads (basic routing works)</li>
					<li>Next: Test media-manager import</li>
					<li>Next: Test ImagePicker component</li>
				</ol>
			</div>
		</div>
	</div>
</div>