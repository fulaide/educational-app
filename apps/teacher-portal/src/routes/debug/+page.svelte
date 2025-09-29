<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Auth Debug - Educational App</title>
</svelte:head>

<div class="p-8">
	<h1 class="text-2xl font-bold mb-4">Authentication Debug</h1>
	
	<div class="space-y-4">
		<div>
			<h2 class="text-lg font-semibold">Session Status</h2>
			<pre class="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(data.session, null, 2)}</pre>
		</div>
		
		<div>
			<h2 class="text-lg font-semibold">Environment Check</h2>
			<p>AUTH_SECRET exists: {data.hasAuthSecret}</p>
			<p>Current URL: {data.url}</p>
		</div>
		
		<div class="space-x-4">
			<a href="/auth/signin" class="text-blue-600 underline">Go to Sign In</a>
			<a href="/dashboard" class="text-blue-600 underline">Go to Dashboard</a>
			<a href="/" class="text-blue-600 underline">Go to Home</a>
		</div>
	</div>
</div>