<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	const { student } = data;
</script>

<svelte:head>
	<title>Student Portal - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-gray-900">Student Portal</h1>
				</div>
				<div class="flex items-center space-x-4">
					<span class="text-sm text-gray-600">
						Welcome, <span class="font-medium">{student.name}</span>
					</span>
					<form method="POST" action="/auth/signout" use:enhance>
						<button 
							type="submit" 
							class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
						>
							Logout
						</button>
					</form>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- Student Info Card -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">👋 Your Profile</h2>
				<div class="space-y-2">
					<div>
						<span class="text-sm text-gray-500">Name:</span>
						<span class="ml-2 text-sm font-medium text-gray-900">{student.name}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500">Student Code:</span>
						<span class="ml-2 text-sm font-mono font-medium text-blue-600">{student.uuid}</span>
					</div>
					<div>
						<span class="text-sm text-gray-500">Grade:</span>
						<span class="ml-2 text-sm font-medium text-gray-900">{student.grade}</span>
					</div>
				</div>
			</div>

			<!-- Learning Activities Card -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">📚 Learning</h2>
				<div class="text-center py-8">
					<p class="text-gray-500 text-sm mb-4">Learning modules coming soon!</p>
					<button 
						disabled
						class="px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
					>
						Start Learning
					</button>
				</div>
			</div>

			<!-- Progress Card -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-lg font-semibold text-gray-900 mb-4">⭐ Progress</h2>
				<div class="space-y-3">
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span class="text-gray-600">XP Points</span>
							<span class="font-medium">0 XP</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div class="bg-blue-600 h-2 rounded-full" style="width: 0%"></div>
						</div>
					</div>
					
					<div>
						<div class="flex justify-between text-sm mb-1">
							<span class="text-gray-600">Level</span>
							<span class="font-medium">1</span>
						</div>
					</div>

					<div class="pt-2 border-t">
						<p class="text-xs text-gray-500 text-center">
							Complete learning activities to earn XP and level up!
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Success Message for New Users -->
		{#if student.uuid}
			<div class="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<span class="text-green-400">✅</span>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Welcome to the Student Portal!</h3>
						<div class="mt-2 text-sm text-green-700">
							<p class="mb-2">
								🎉 You're successfully logged in! Your student code is <strong class="font-mono">{student.uuid}</strong>
							</p>
							<p class="text-xs">
								💡 <strong>Important:</strong> Save your student code somewhere safe. You'll need it to log in next time!
							</p>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
