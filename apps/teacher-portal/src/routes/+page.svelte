<script>
	import { Card } from '@educational-app/ui';
</script>


<svelte:head>
	<title>Teacher Portal App</title>
</svelte:head>

<div class="min-h-screen flex flex-col gap-6 items-center   bg-gradient-to-b from-blue-50 to-blue-100 p-4">

	<!-- Header -->
	<Card variant="elevated" padding="lg" class="mb-6">
		<div class="flex items-center gap-4 p-6">
			<div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">👦</div>
			<div>
				<h2 class="text-xl font-bold font-family-comic text-primary">Lehrer Portal</h2>
			</div>
		</div>
	</Card>


	<Card variant="elevated" padding="lg" class="mb-6">

		<div class="flex items-center gap-4 p-6">

			<a href="/dashboard" class="text-xl font-bold font-family-comic text-primary">Dashboard</a>
			<a href="/auth/signin" class="text-xl font-bold font-family-comic text-primary">Sign in</a>
			<a href="/qr-codes" class="text-xl font-bold font-family-comic text-primary">QR Codes</a>
		</div>
	</Card>

</div>