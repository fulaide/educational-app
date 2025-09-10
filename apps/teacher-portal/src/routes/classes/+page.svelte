<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { AuthButton, AuthInput, AuthForm, Button, Card, useNotifications } from '@educational-app/ui';
	import { t } from '@educational-app/i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { PageData } from './$types';
	import type { ImageAsset } from '@educational-app/media-manager';

	// Get notification context
	const notifications = useNotifications();

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

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
				// Success - close form and refresh data
				showCreateForm = false;
				selectedImages = [];
				// Reset form using SuperForm's reset method
				reset();
				
				// Show success notification
				notifications.success(form.message, {
					title: 'Klasse erstellt!',
					duration: 4000
				});
			} else if (form.message) {
				// Error handling - show error notification
				notifications.error(form.message, {
					title: 'Fehler beim Erstellen',
					duration: 5000
				});
			}
		},
		onError({ result }) {
			console.error('Form submission error:', result);
			notifications.error('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', {
				title: 'Fehler',
				duration: 5000
			});
		}
	});

	let showCreateForm = $state(false);
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

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<h1 class="text-2xl font-semibold text-gray-900">{$t('dashboard.my_classes')}</h1>
				<Button 
					variant="solid"
					color="primary"
					onclick={() => showCreateForm = !showCreateForm}
				>
					<svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
					</svg>
					Neue {$t('navigation.classes', { values: { count: 1 } })} erstellen
				</Button>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- Create Class Form -->
		{#if showCreateForm}
			<Card class="mb-8">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-lg font-semibold text-gray-900">Neue {$t('navigation.classes', { values: { count: 1 } })} erstellen</h2>
					<Button 
						variant="ghost"
						size="sm"
						onclick={() => showCreateForm = false}
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</Button>
				</div>

				<form method="POST" action="?/create" use:formEnhance>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<AuthInput 
							name="name"
							label={$t('common.name')}
							placeholder="z.B. Klasse 3A"
							bind:value={$form.name}
							error={$errors.name?.[0]}
							required
						/>

						<div>
							<label for="grade" class="block text-sm font-medium text-gray-700 mb-1">
								{$t('student.register.grade_label')}
							</label>
							<select 
								id="grade"
								name="grade"
								bind:value={$form.grade}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							>
								<option value="">{$t('student.register.grade_label')} auswählen</option>
								{#each Array(4) as _, i}
									<option value={i + 1}>{$t('student.qr_codes.grade')} {i + 1}</option>
								{/each}
							</select>
							{#if $errors.grade?.[0]}
								<p class="mt-1 text-sm text-red-600">{$errors.grade[0]}</p>
							{/if}
						</div>

						<AuthInput 
							name="maxStudents"
							label="Max {$t('navigation.students')}"
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
					<div class="mt-6">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Klassenlogo auswählen
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
									<p class="text-gray-500 text-sm">Lade Bildauswahl...</p>
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
								<p class="text-yellow-800 text-sm">Bildauswahl konnte nicht geladen werden.</p>
							</div>
						{/if}

						{#if selectedImages.length > 0}
							<div class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
								<p class="text-green-800 text-sm font-medium">✓ Logo ausgewählt</p>
								<p class="text-green-600 text-xs mt-1">Das ausgewählte Logo wird für die Klasse verwendet.</p>
							</div>
						{/if}
						
						<!-- Hidden inputs for form submission -->
						<input type="hidden" name="avatarUrl" bind:value={$form.avatarUrl} />
						<input type="hidden" name="avatarType" bind:value={$form.avatarType} />
						
					</div>

					<div class="mt-6 flex justify-end space-x-3">
						<Button 
							variant="outline"
							onclick={() => showCreateForm = false}
						>
							{$t('common.cancel')}
						</Button>
						<AuthButton type="submit" disabled={$submitting}>
							{#if $submitting}
								Erstelle Klasse...
							{:else}
								{$t('navigation.classes', { values: { count: 1 } })} erstellen
							{/if}
						</AuthButton>
					</div>
				</form>
			</Card>
		{/if}

		<!-- Classes List -->
		{#if data.classes.length === 0}
			<Card class="p-12 text-center">
				<svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
				</svg>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Noch keine {$t('navigation.classes')}</h3>
				<p class="text-gray-500 mb-6">Beginnen Sie mit der Erstellung Ihrer ersten {$t('navigation.classes', { values: { count: 1 } })}.</p>
				<Button 
					variant="solid"
					color="primary"
					onclick={() => showCreateForm = true}
				>
					Erste {$t('navigation.classes', { values: { count: 1 } })} erstellen
				</Button>
			</Card>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.classes as classItem}
					<a href="/classes/{classItem.id}" class="block">
						<Card hoverable={true} class="transition-shadow cursor-pointer">
							<!-- Class Image -->
							<div class="flex justify-center mb-4">
								{#if classItem.avatarUrl}
									<img 
										src={classItem.avatarUrl} 
										alt="{classItem.name} Logo"
										class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
									/>
								{:else}
									<div class="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
										<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
										</svg>
									</div>
								{/if}
							</div>

							<!-- Class Header -->
							<div class="text-center mb-4">
								<h3 class="text-lg font-semibold text-gray-900 mb-1">{classItem.name}</h3>
								<p class="text-sm text-gray-500">{$t('student.qr_codes.grade')} {classItem.grade}</p>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 {classItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
									{classItem.isActive ? $t('parent.dashboard.active') : $t('parent.dashboard.inactive')}
								</span>
							</div>

							<!-- Class Stats -->
							<div class="space-y-2">
								<div class="flex justify-between text-sm">
									<span class="text-gray-500">{$t('navigation.students')}:</span>
									<span class="font-medium">{classItem.students.length} / {classItem.maxStudents}</span>
								</div>

								{#if classItem.organization}
									<div class="flex justify-between text-sm">
										<span class="text-gray-500">Schule:</span>
										<span class="font-medium">{classItem.organization.name}</span>
									</div>
								{/if}
							</div>
						</Card>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
