<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { AuthButton, AuthInput, Button, Card, Modal, useNotifications } from '@educational-app/ui';
	import { ImagePicker, type ImageAsset } from '@educational-app/media-manager';
	import { t } from '@educational-app/i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { PageData } from './$types';
	import { setClassStore } from '$lib/stores/class-store.svelte.js';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { classItem } = data;

	// Initialize notifications
	const notifications = useNotifications();

	// Initialize reactive class store with server data
	const classStore = setClassStore(classItem);

	const updateSchema = z.object({
		name: z.string().min(1),
		grade: z.number().min(1).max(4),
		maxStudents: z.number().min(1).max(50),
		isActive: z.boolean(),
		avatarUrl: z.string().optional(),
		avatarType: z.enum(['PRESET', 'CUSTOM']).default('PRESET')
	});

	const { form, errors, enhance: formEnhance, submitting } = superForm(data.updateForm, {
		validators: zodClient(updateSchema),
		onUpdated({ form }) {
			if (form.valid && form.message) {
				// Update reactive state immediately
				classStore.updateClass({
					name: form.data.name,
					grade: form.data.grade,
					maxStudents: form.data.maxStudents,
					isActive: form.data.isActive,
					avatarUrl: form.data.avatarUrl,
					avatarType: form.data.avatarType
				});
				notifications.success(form.message);
				showEditForm = false;
				invalidateAll(); // Refresh page data
			} else if (form.message) {
				notifications.error(form.message);
			}
		},
		onError({ result }) {
			notifications.error('Failed to update class. Please try again.');
		}
	});

	let showEditForm = $state(false);
	let showDeleteConfirm = $state(false);
	let showImagePicker = $state(false);
	
	// Handle image selection from ImagePicker
	function handleImageSelect(images: ImageAsset[]) {
		if (images.length > 0) {
			const selectedImage = images[0];
			$form.avatarUrl = selectedImage.url;
			$form.avatarType = selectedImage.type === 'preset' ? 'PRESET' : 'CUSTOM';
			
			// Hide image picker after selection
			showImagePicker = false;
			
			// Show success notification
			const isUpload = selectedImage.type === 'custom';
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
	
	function handleImageError(error: string) {
		notifications.error(error);
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>{classStore.name} - {$t('teacher.home.teacher_portal')}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center space-x-4">
					<a href="/classes" class="text-gray-500 hover:text-gray-700">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
						</svg>
					</a>
					<!-- Class Avatar -->
					{#if classStore.avatarUrl}
						<div class="flex-shrink-0">
							<img 
								src={classStore.avatarUrl} 
								alt="{classStore.name} avatar"
								class="h-12 w-12 rounded-lg object-cover border-2 border-gray-200"
							/>
						</div>
					{:else}
						<div class="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
							<span class="text-white font-bold text-lg">{classStore.name.charAt(0)}</span>
						</div>
					{/if}
					<div>
						<h1 class="text-2xl font-semibold text-gray-900">{classStore.name}</h1>
						<p class="text-sm text-gray-500">{classStore.displayInfo.grade}</p>
					</div>
				</div>
				<div class="flex items-center space-x-3">
					<Button 
						variant="outline"
						size="sm"
						onclick={() => { 
							showEditForm = true; 
							showImagePicker = false; 
						}}
					>
						<svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
						</svg>
						{$t('common.edit')} Klasse
					</Button>
					<a href="/classes/{classItem.id}/students">
						<Button variant="solid" color="primary" size="sm">
							{$t('navigation.students')} verwalten
						</Button>
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- Edit Form Modal -->
		<Modal 
			bind:open={showEditForm}
			title="{$t('common.edit')} Klasse"
			size="lg"
			closable={true}
		>

					<form method="POST" action="?/update" use:formEnhance>
						<div class="space-y-4">
							<AuthInput 
								name="name"
								label={$t('common.name')}
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
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								>
									{#each Array(4) as _, i}
										<option value={i + 1}>Grade {i + 1}</option>
									{/each}
								</select>
							</div>

							<AuthInput 
								name="maxStudents"
								label="Max Students"
								type="number"
								bind:value={$form.maxStudents}
								error={$errors.maxStudents?.[0]}
								min={1}
								max={50}
								required
							/>

							<!-- Class Avatar Selection -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-3">
									Klassenlogo
								</label>
								
								{#if $form.avatarUrl}
									<!-- Current Image Display -->
									<div class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
										<div class="flex items-center space-x-4">
											<img 
												src={$form.avatarUrl} 
												alt="Aktuelles Klassenlogo"
												class="w-16 h-16 rounded-lg object-cover border-2 border-gray-300"
											/>
											<div class="flex-1">
												<p class="text-sm font-medium text-gray-900">Aktuelles Logo</p>
												<p class="text-xs text-gray-500">Klicken Sie unten, um das Logo zu ändern</p>
											</div>
											<button 
												type="button"
												onclick={() => { 
													$form.avatarUrl = ''; 
													$form.avatarType = 'PRESET'; 
													notifications.success('Klassenlogo erfolgreich entfernt!', {
														title: 'Logo entfernt',
														duration: 3000
													});
												}}
												class="text-red-600 hover:text-red-800 text-sm font-medium"
											>
												Entfernen
											</button>
										</div>
									</div>
								{/if}
								
								{#if !$form.avatarUrl || showImagePicker}
									<ImagePicker 
										category="class-avatars"
										currentImage={$form.avatarUrl}
										allowUpload={true}
										onSelect={handleImageSelect}
										onError={handleImageError}
									/>
								{:else}
									<button 
										type="button"
										onclick={() => showImagePicker = true}
										class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors"
									>
										<svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
										</svg>
										<span class="text-sm text-gray-600">Neues Logo auswählen</span>
									</button>
								{/if}
								
								<!-- Hidden inputs for form submission -->
								<input type="hidden" name="avatarUrl" bind:value={$form.avatarUrl} />
								<input type="hidden" name="avatarType" bind:value={$form.avatarType} />
							</div>

							<div>
								<label class="flex items-center">
									<input 
										type="checkbox" 
										name="isActive"
										bind:checked={$form.isActive}
										class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="ml-2 text-sm text-gray-700">Class is active</span>
								</label>
							</div>
						</div>

						<div class="mt-6 flex justify-between">
							<button 
								type="button"
								class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
								onclick={() => { showEditForm = false; showDeleteConfirm = true; }}
							>
								Delete Class
							</button>
							<div class="flex space-x-3">
								<button 
									type="button"
									class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
									onclick={() => showEditForm = false}
								>
									Cancel
								</button>
								<AuthButton type="submit" disabled={$submitting}>
									{#if $submitting}
										<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Saving...
									{:else}
										Save Changes
									{/if}
								</AuthButton>
							</div>
						</div>
					</form>
		</Modal>

		<!-- Delete Confirmation Modal -->
		{#if showDeleteConfirm}
			<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onclick={() => showDeleteConfirm = false}>
				<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onclick={(e) => e.stopPropagation()}>
					<div class="text-center">
						<svg class="mx-auto mb-4 h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Delete Class</h3>
						<p class="mb-4 text-sm text-gray-500">
							Are you sure you want to delete <strong>"{classStore.name}"</strong>? 
							{#if classStore.studentCount > 0}
								<br><span class="text-red-600">This class has {classStore.studentCount} student(s). Please remove all students first.</span>
							{:else}
								This action cannot be undone.
							{/if}
						</p>
						<div class="flex justify-center space-x-3">
							<button 
								type="button"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
								onclick={() => showDeleteConfirm = false}
							>
								Cancel
							</button>
							{#if classStore.studentCount === 0}
								<form method="POST" action="?/delete" use:enhance>
									<button 
										type="submit"
										class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
									>
										Delete Class
									</button>
								</form>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Main Content -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Class Info -->
			<div class="lg:col-span-1">
				<div class="bg-white shadow rounded-lg p-6">
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Class Details</h2>
					<dl class="space-y-3">
						<div>
							<dt class="text-sm font-medium text-gray-500">Name</dt>
							<dd class="text-sm text-gray-900">{classStore.name}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Grade</dt>
							<dd class="text-sm text-gray-900">{classStore.grade}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Students</dt>
							<dd class="text-sm text-gray-900">{classStore.displayInfo.studentCount}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Status</dt>
							<dd>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {classStore.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
									{classStore.displayInfo.status}
								</span>
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-gray-500">Created</dt>
							<dd class="text-sm text-gray-900">{formatDate(classItem.createdAt)}</dd>
						</div>
						{#if classItem.organization}
							<div>
								<dt class="text-sm font-medium text-gray-500">School</dt>
								<dd class="text-sm text-gray-900">{classItem.organization.name}</dd>
							</div>
						{/if}
					</dl>
				</div>
			</div>

			<!-- Students List -->
			<div class="lg:col-span-2">
				<div class="bg-white shadow rounded-lg">
					<div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
						<h2 class="text-lg font-semibold text-gray-900">Students ({classStore.studentCount})</h2>
						<a 
							href="/classes/{classItem.id}/students"
							class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
						>
							Manage Students
						</a>
					</div>

					{#if classStore.studentCount === 0}
						<div class="p-12 text-center">
							<svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
							</svg>
							<h3 class="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
							<p class="text-gray-500 mb-4">Add students to start managing your class.</p>
							<a 
								href="/classes/{classItem.id}/students"
								class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
							>
								Add Students
							</a>
						</div>
					{:else}
						<div class="divide-y divide-gray-200">
							{#each classStore.students.slice(0, 5) as student}
								<div class="px-6 py-4 flex items-center justify-between">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10">
											<div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
												<span class="text-sm font-medium text-blue-600">
													{student.name?.charAt(0) || '?'}
												</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900">{student.name || 'Unnamed Student'}</div>
											<div class="text-sm text-gray-500 font-mono">{student.uuid}</div>
										</div>
									</div>
									<div class="text-sm text-gray-500">
										{#if student.lastLoginAt}
											Last login: {formatDate(student.lastLoginAt)}
										{:else}
											Never logged in
										{/if}
									</div>
								</div>
							{/each}
							{#if classStore.studentCount > 5}
								<div class="px-6 py-4 bg-gray-50">
									<a 
										href="/classes/{classItem.id}/students"
										class="text-sm text-blue-600 hover:text-blue-800"
									>
										View all {classStore.studentCount} students →
									</a>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* ImagePicker styles for the edit modal */
	:global(.image-picker) {
		width: 100%;
		max-width: 600px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		overflow: hidden;
	}

	:global(.tab-navigation) {
		display: flex;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	:global(.tab-button) {
		flex: 1;
		padding: 12px 16px;
		border: none;
		background: transparent;
		color: #6b7280;
		font-weight: 500;
		cursor: pointer;
		transition: all 200ms;
		border-bottom: 2px solid transparent;
	}

	:global(.tab-button:hover) {
		background: #f3f4f6;
		color: #374151;
	}

	:global(.tab-button.active) {
		color: #2563eb;
		border-bottom-color: #2563eb;
		background: white;
	}

	:global(.tab-content) {
		padding: 20px;
		min-height: 300px;
	}

	:global(.selected-preview) {
		padding: 16px;
		border-top: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	:global(.selected-preview h4) {
		margin: 0 0 12px 0;
		font-size: 14px;
		font-weight: 600;
		color: #374151;
	}

	:global(.preview-image) {
		display: flex;
		justify-content: center;
	}

	:global(.preview-img) {
		width: 80px;
		height: 80px;
		object-fit: cover;
		border-radius: 8px;
		border: 2px solid #e5e7eb;
	}

	/* Preset gallery styles */
	:global(.preset-gallery) {
		width: 100%;
	}

	:global(.image-grid) {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 16px;
		max-height: 400px;
		overflow-y: auto;
	}

	:global(.preset-item) {
		position: relative;
		aspect-ratio: 1;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		background: white;
		cursor: pointer;
		transition: all 200ms;
		overflow: hidden;
		padding: 0;
	}

	:global(.preset-item:hover) {
		border-color: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global(.preset-item.selected) {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
	}

	:global(.preset-image) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
