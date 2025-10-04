<script lang="ts">
	import { Button, Card } from '@educational-app/ui';
	import { BarChart3, UserPlus, Users } from 'lucide-svelte';
// Layout is now provided by parent authenticated layout
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Badge counts are now handled by the parent authenticated layout
</script>

<svelte:head>
	<title>Students - Teacher Portal</title>
</svelte:head>

<!-- Content is now wrapped by the parent authenticated layout -->
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Student Management</h1>
				<p class="mt-1 text-sm text-gray-500">Manage your students and their access</p>
			</div>
		</div>
	</div>

	<!-- Quick Actions Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<!-- Register Students -->
		<Card variant="elevated" hoverable={true} padding="lg">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<UserPlus class="h-8 w-8 text-blue-500" />
				</div>
				<div class="ml-4 flex-1">
					<h3 class="text-lg font-semibold text-gray-900">Register Students</h3>
					<p class="text-sm text-gray-600 mt-1">Add new students to your classes</p>
				</div>
			</div>
			<div class="mt-4">
				<Button
					variant="solid"
					color="primary"
					class="w-full"
					onclick={() => window.location.href = '/students/register'}
				>
					Register Students
				</Button>
			</div>
		</Card>

		<!-- Student QR Codes -->
		<Card variant="elevated" hoverable={true} padding="lg">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<BarChart3 class="h-8 w-8 text-green-500" />
				</div>
				<div class="ml-4 flex-1">
					<h3 class="text-lg font-semibold text-gray-900">QR Codes</h3>
					<p class="text-sm text-gray-600 mt-1">Generate login QR codes for students</p>
				</div>
			</div>
			<div class="mt-4">
				<Button
					variant="outline"
					color="primary"
					class="w-full"
					onclick={() => window.location.href = '/qr-codes'}
				>
					Manage QR Codes
				</Button>
			</div>
		</Card>

		<!-- View All Students -->
		<Card variant="elevated" hoverable={true} padding="lg">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<Users class="h-8 w-8 text-purple-500" />
				</div>
				<div class="ml-4 flex-1">
					<h3 class="text-lg font-semibold text-gray-900">All Students</h3>
					<p class="text-sm text-gray-600 mt-1">View and manage all your students</p>
				</div>
			</div>
			<div class="mt-4">
				<div class="text-center text-gray-500 text-sm">
					Coming soon
				</div>
			</div>
		</Card>
	</div>

	<!-- Student Statistics -->
	{#if data.totalStudents > 0}
		<div class="mt-8">
			<Card variant="outlined" padding="lg">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Student Overview</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-blue-600">{data.totalStudents}</div>
						<div class="text-sm text-gray-600">Total Students</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-green-600">{data.totalClasses}</div>
						<div class="text-sm text-gray-600">Classes</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-purple-600">
							{data.totalStudents > 0 ? Math.round(data.totalStudents / Math.max(data.totalClasses, 1)) : 0}
						</div>
						<div class="text-sm text-gray-600">Avg Students/Class</div>
					</div>
				</div>
			</Card>
		</div>
	{/if}