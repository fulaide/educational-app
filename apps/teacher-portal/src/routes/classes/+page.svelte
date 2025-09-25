<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { AppLayout, Sidebar, MainContent, Drawer, AuthButton, AuthInput, AuthForm, Button, Card, useNotifications } from '@educational-app/ui';
	import { t } from '@educational-app/i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { Home, Users, BookOpen, BarChart3, Settings, LogOut, Plus, Eye } from 'lucide-svelte';
	import type { PageData } from './$types';
	import type { ImageAsset } from '@educational-app/media-manager';
	import { invalidateAll } from '$app/navigation';

	// Get notification context
	const notifications = useNotifications();

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Navigation structure for teacher portal (same as dashboard)
	const teacherNavigation = [
		{
			label: 'Dashboard',
			href: '/dashboard',
			icon: Home
		},
		{
			label: 'Classes',
			href: '/classes',
			icon: BookOpen,
			badge: data.classes.length,
			isActive: true
		},
		{
			label: 'Students',
			href: '/students',
			icon: Users
		},
		{
			label: 'QR Codes',
			href: '/qr-codes',
			icon: BarChart3
		}
	];

	const accountNavigation = [
		{
			label: 'Settings',
			href: '/settings',
			icon: Settings
		},
		{
			label: 'Sign Out',
			href: '/auth/signout',
			icon: LogOut
		}
	];

	const createClassSchema = z.object({
		name: z.string().min(1),
		grade: z.number().min(1).max(4),
		maxStudents: z.number().min(1).max(50),
		avatarUrl: z.string().optional().or(z.literal('')),
		avatarType: z.enum(['PRESET', 'CUSTOM']).default('PRESET')
	});

	const { form, errors, enhance: formEnhance, submitting, reset } = superForm(data.createClassForm, {
		validators: zodClient(createClassSchema),
		onUpdated({ form }) {
			if (form.valid && form.message) {
				// Success - close drawer and refresh data
				showCreateDrawer = false;
				selectedImages = [];
				// Reset form using SuperForm's reset method
				reset();
				// Refresh page data
				invalidateAll();
				
				// Show success notification
				notifications.success(form.message, {
					title: 'Class created successfully!',
					duration: 4000
				});
			} else if (form.message) {
				// Error handling - show error notification
				notifications.error(form.message, {
					title: 'Error creating class',
					duration: 5000
				});
			}
		},
		onError({ result }) {
			console.error('Form submission error:', result);
			notifications.error('An unexpected error occurred. Please try again.', {
				title: 'Error',
				duration: 5000
			});
		}
	});

	let showCreateDrawer = $state(false);
	let ImagePicker = $state<any>(null);
	let imagePickerLoading = $state(true);
	let imagePickerError = $state('');
	let selectedImages: ImageAsset[] = $state([]);

	// Load ImagePicker component dynamically for client-side only
	onMount(async () => {
		if (browser) {
			try {
				const module = await import('@educational-app/media-manager');
				ImagePicker = module.ImagePicker;
				imagePickerLoading = false;
			} catch (error) {
				console.error('Failed to load ImagePicker:', error);
				imagePickerError = 'Failed to load image picker';
				imagePickerLoading = false;
			}
		}
	});

	function handleImageSelect(images: ImageAsset[]) {
		selectedImages = images;
		
		// Show success notification for image selection/upload
		if (images.length > 0) {
			const isUpload = images[0].type === 'custom';
			notifications.success(
				isUpload 
					? 'Bild erfolgreich hochgeladen und als Klassenbild ausgewählt!'
					: 'Klassenbild erfolgreich ausgewählt!',
				{
					title: isUpload ? 'Upload erfolgreich' : 'Bild gewählt',
					duration: 3000
				}
			);
		}
	}

	// Reactive updates for form values based on selectedImages
	$effect(() => {
		if (selectedImages.length > 0) {
			$form.avatarUrl = selectedImages[0].url;
			$form.avatarType = selectedImages[0].type === 'preset' ? 'PRESET' : 'CUSTOM';
		} else {
			$form.avatarUrl = '';
			$form.avatarType = 'PRESET';
		}
	});

	function handleImageError(error: string) {
		imagePickerError = error;
		console.error('Image picker error:', error);
		
		// Show error notification
		notifications.error(error, {
			title: 'Upload-Fehler',
			duration: 5000
		});
	}
</script>

<svelte:head>
	<title>{$t('dashboard.my_classes')} - {$t('teacher.home.teacher_portal')}</title>
</svelte:head>

<AppLayout theme="teacher">
	<!-- Sidebar -->
	<Sidebar 
		navigation={teacherNavigation}
		accountNavigation={accountNavigation}
		userName="Teacher" 
		userRole="TEACHER"
	/>

	<!-- Main Content -->
	<MainContent>
		<!-- Header -->
		<div class="mb-8">
			<div class="flex justify-between items-center">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">{$t('dashboard.my_classes')}</h1>
					<p class="mt-1 text-sm text-gray-500">
						{#if data.classes.length > 0}
							Manage your {data.classes.length} class{data.classes.length !== 1 ? 'es' : ''}
						{:else}
							Create and manage your classes
						{/if}
					</p>
				</div>
				<Button 
					variant="solid"
					color="primary"
					onclick={() => showCreateDrawer = true}
				>
					<Plus class="-ml-1 mr-2 h-4 w-4" />
					Create Class
				</Button>
			</div>
		</div>

		<!-- Classes Grid -->
		{#if data.classes.length === 0}
			<Card class="p-12 text-center">
				<BookOpen class="mx-auto h-12 w-12 text-gray-400 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
				<p class="text-gray-500 mb-6">Get started by creating your first class.</p>
				<Button 
					variant="solid"
					color="primary"
					onclick={() => showCreateDrawer = true}
				>
					<Plus class="-ml-1 mr-2 h-4 w-4" />
					Create Your First Class
				</Button>
			</Card>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.classes as classItem}
					<a href="/classes/{classItem.id}" class="block group">
						<Card hoverable={true} class="transition-all duration-200 group-hover:shadow-lg">
							<!-- Class Image -->
							<div class="flex justify-center mb-4">
								{#if classItem.avatarUrl}
									<img 
										src={classItem.avatarUrl} 
										alt="{classItem.name} Logo"
										class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
									/>
								{:else}
									<div class="w-20 h-20 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
										<BookOpen class="w-8 h-8 text-blue-500" />
									</div>
								{/if}
							</div>

							<!-- Class Header -->
							<div class="text-center mb-4">
								<h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{classItem.name}</h3>
								<p class="text-sm text-gray-500">Grade {classItem.grade}</p>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 {classItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
									{classItem.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>

							<!-- Class Stats -->
							<div class="space-y-3 pt-3 border-t border-gray-100">
								<div class="flex justify-between items-center text-sm">
									<span class="text-gray-500 flex items-center">
										<Users class="w-4 h-4 mr-1" />
										Students
									</span>
									<span class="font-semibold text-gray-900">{classItem.students.length} / {classItem.maxStudents}</span>
								</div>

								{#if classItem.organization}
									<div class="flex justify-between text-sm">
										<span class="text-gray-500">School:</span>
										<span class="font-medium text-gray-700 truncate ml-2">{classItem.organization.name}</span>
									</div>
								{/if}

								<div class="flex justify-center pt-2">
									<span class="text-xs text-blue-600 group-hover:text-blue-700 font-medium flex items-center">
										View Details
										<Eye class="ml-1 w-3 h-3" />
									</span>
								</div>
							</div>
						</Card>
					</a>
				{/each}
			</div>
		{/if}
	</MainContent>

	<!-- Create Class Drawer -->
	<Drawer 
		bind:open={showCreateDrawer} 
		position="right" 
		size="lg"
		title="Create New Class"
	>
		<form method="POST" action="?/create" use:formEnhance class="space-y-6">
			<div class="grid grid-cols-1 gap-4">
				<AuthInput 
					name="name"
					label="Class Name"
					placeholder="e.g., Grade 3A"
					bind:value={$form.name}
					error={$errors.name?.[0]}
					required
				/>

				<div>
					<label for="grade" class="block text-sm font-medium text-gray-700 mb-1">
						Grade Level
					</label>
					<select 
						id="grade"
						name="grade"
						bind:value={$form.grade}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					>
						<option value="">Select grade...</option>
						{#each Array(4) as _, i}
							<option value={i + 1}>Grade {i + 1}</option>
						{/each}
					</select>
					{#if $errors.grade?.[0]}
						<p class="mt-1 text-sm text-red-600">{$errors.grade[0]}</p>
					{/if}
				</div>

				<AuthInput 
					name="maxStudents"
					label="Maximum Students"
					type="number"
					placeholder="30"
					bind:value={$form.maxStudents}
					error={$errors.maxStudents?.[0]}
					min={1}
					max={50}
					required
				/>
			</div>

			<!-- Class Avatar Selection -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Class Logo (Optional)
				</label>
				
				{#if imagePickerError}
					<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p class="text-red-800 text-sm">{imagePickerError}</p>
					</div>
				{/if}

				{#if imagePickerLoading}
					<div class="flex justify-center items-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
						<div class="text-center">
							<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
							<p class="text-gray-500 text-sm">Loading image picker...</p>
						</div>
					</div>
				{:else if ImagePicker}
					<ImagePicker 
						category="class-avatars"
						allowUpload={true}
						onSelect={handleImageSelect}
						onError={handleImageError}
					/>
				{:else}
					<div class="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
						<p class="text-yellow-800 text-sm">Image picker could not be loaded.</p>
					</div>
				{/if}

				{#if selectedImages.length > 0}
					<div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
						<p class="text-green-800 text-sm font-medium">✓ Logo selected</p>
						<p class="text-green-600 text-xs mt-1">The selected logo will be used for the class.</p>
					</div>
				{/if}
				
				<!-- Hidden inputs for form submission -->
				<input type="hidden" name="avatarUrl" bind:value={$form.avatarUrl} />
				<input type="hidden" name="avatarType" bind:value={$form.avatarType} />
			</div>

			<div class="flex justify-end space-x-3 pt-6 border-t">
				<Button 
					variant="outline"
					onclick={() => showCreateDrawer = false}
					disabled={$submitting}
				>
					Cancel
				</Button>
				<AuthButton type="submit" disabled={$submitting}>
					{#if $submitting}
						<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
						Creating...
					{:else}
						Create Class
					{/if}
				</AuthButton>
			</div>
		</form>
	</Drawer>
</AppLayout>
