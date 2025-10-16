<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { AuthInput, Button, Card, Drawer, useNotifications } from '@educational-app/ui';
	import { BarChart3, UserPlus, Users } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const notifications = useNotifications();

	// Registration form schema
	const registerStudentsSchema = z.object({
		studentName: z.string().min(1).optional(),
		grade: z.number().min(1).max(4),
		studentCount: z.number().min(1).max(30)
	});

	// SuperForm for registration
	const registerFormHandler = superForm(data.registerForm, {
		validators: zodClient(registerStudentsSchema),
		id: 'registerStudents',
		onUpdated({ form }) {
			if (form.valid && form.message) {
				notifications.success(form.message);
				showRegisterDrawer = false;
				invalidateAll();
			} else if (form.message) {
				notifications.error(form.message);
			}
		},
		onError({ result }) {
			notifications.error('Failed to register students. Please try again.');
		}
	});

	const { form: registerForm, errors: registerErrors, enhance: registerEnhance, submitting: registerSubmitting } = registerFormHandler;

	// UI state
	let showRegisterDrawer = $state(false);
</script>

<svelte:head>
	<title>Students - Teacher Portal</title>
</svelte:head>

<!-- Content is now wrapped by the parent authenticated layout -->
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-neutral-900">Student Management</h1>
				<p class="mt-1 text-sm text-neutral-500">Manage your students and their access</p>
			</div>
		</div>
	</div>

	<!-- Quick Actions Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<!-- Register Students -->
		<Card variant="elevated" hoverable={true} padding="lg">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<UserPlus class="h-8 w-8 text-primary-500" />
				</div>
				<div class="ml-4 flex-1">
					<h3 class="text-lg font-semibold text-neutral-900">Register Students</h3>
					<p class="text-sm text-neutral-600 mt-1">Add new students to your classes</p>
				</div>
			</div>
			<div class="mt-4">
				<Button
					variant="solid"
					color="primary"
					class="w-full"
					onclick={() => showRegisterDrawer = true}
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
					<h3 class="text-lg font-semibold text-neutral-900">QR Codes</h3>
					<p class="text-sm text-neutral-600 mt-1">Generate login QR codes for students</p>
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
					<Users class="h-8 w-8 text-secondary-500" />
				</div>
				<div class="ml-4 flex-1">
					<h3 class="text-lg font-semibold text-neutral-900">All Students</h3>
					<p class="text-sm text-neutral-600 mt-1">View and manage all your students</p>
				</div>
			</div>
			<div class="mt-4">
				<div class="text-center text-neutral-500 text-sm">
					Coming soon
				</div>
			</div>
		</Card>
	</div>

	<!-- Student Statistics -->
	{#if data.totalStudents > 0}
		<div class="mt-8">
			<Card variant="outlined" padding="lg">
				<h3 class="text-lg font-semibold text-neutral-900 mb-4">Student Overview</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="text-center">
						<div class="text-2xl font-bold text-primary-600">{data.totalStudents}</div>
						<div class="text-sm text-neutral-600">Total Students</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-secondary-600">{data.totalClasses}</div>
						<div class="text-sm text-neutral-600">Classes</div>
					</div>
					<div class="text-center">
						<div class="text-2xl font-bold text-secondary-600">
							{data.totalStudents > 0 ? Math.round(data.totalStudents / Math.max(data.totalClasses, 1)) : 0}
						</div>
						<div class="text-sm text-neutral-600">Avg Students/Class</div>
					</div>
				</div>
			</Card>
		</div>
	{/if}

<!-- Register Students Drawer -->
<Drawer
	bind:open={showRegisterDrawer}
	title="Register Students"
	position="right"
	size="md"
	padding="lg"
>
	{#snippet children()}
		<form method="POST" action="?/register" use:registerEnhance id="register-students-form">
			<div class="space-y-4">
				<!-- Student Count -->
				<div>
					<label for="studentCount" class="block text-sm font-medium text-neutral-700 mb-1">
						Number of Students
					</label>
					<input
						id="studentCount"
						name="studentCount"
						type="number"
						min="1"
						max="30"
						bind:value={$registerForm.studentCount}
						class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						required
					/>
					{#if $registerErrors.studentCount?.[0]}
						<p class="mt-1 text-sm text-danger-600">{$registerErrors.studentCount[0]}</p>
					{/if}
				</div>

				<!-- Student Name(s) -->
				{#if $registerForm.studentCount === 1}
					<AuthInput
						name="studentName"
						label="Student Name"
						placeholder="Enter student's name"
						bind:value={$registerForm.studentName}
						error={$registerErrors.studentName?.[0]}
					/>
				{:else}
					<div>
						<label for="studentNames" class="block text-sm font-medium text-neutral-700 mb-1">
							Student Names (Optional)
						</label>
						<textarea
							id="studentNames"
							name="studentNames"
							rows="4"
							bind:value={$registerForm.studentName}
							placeholder="Enter comma-separated names (e.g., John, Sarah, Mike)&#10;Leave empty to generate names automatically"
							class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
						></textarea>
						<p class="mt-1 text-xs text-neutral-500">
							Enter {$registerForm.studentCount} names separated by commas, or leave empty to auto-generate names
						</p>
						{#if $registerErrors.studentName?.[0]}
							<p class="mt-1 text-sm text-danger-600">{$registerErrors.studentName[0]}</p>
						{/if}
					</div>
				{/if}

				<!-- Grade Level -->
				<div>
					<label for="grade" class="block text-sm font-medium text-neutral-700 mb-1">
						Grade Level
					</label>
					<select
						id="grade"
						name="grade"
						bind:value={$registerForm.grade}
						class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						required
					>
						{#each Array(4) as _, i}
							<option value={i + 1}>Grade {i + 1}</option>
						{/each}
					</select>
					{#if $registerErrors.grade?.[0]}
						<p class="mt-1 text-sm text-danger-600">{$registerErrors.grade[0]}</p>
					{/if}
				</div>
			</div>
		</form>
	{/snippet}

	{#snippet footer()}
		<div class="flex justify-end w-full space-x-3">
			<Button variant="outline" onclick={() => showRegisterDrawer = false}>
				Cancel
			</Button>
			<Button
				type="submit"
				form="register-students-form"
				variant="solid"
				color="primary"
				disabled={$registerSubmitting}
				loading={$registerSubmitting}
			>
				{#if $registerSubmitting}
					Creating...
				{:else}
					Create Student{$registerForm.studentCount !== 1 ? 's' : ''}
				{/if}
			</Button>
		</div>
	{/snippet}
</Drawer>