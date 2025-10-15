<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { setClassStore } from '$lib/stores/class-store.svelte.js';
	import { t } from '@educational-app/i18n';
	import { ImagePicker, type ImageAsset } from '@educational-app/media-manager';
	import { AuthInput, Button, Card, Drawer, useNotifications } from '@educational-app/ui';
	import { ArrowLeft, Edit, Printer } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { PageData } from './$types';

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
	let isPrintingQRCodes = $state(false);
	
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

	async function printAllQRCodes() {
		isPrintingQRCodes = true;

		// Filter students with active QR codes
		const studentsWithQR = classStore.students.filter(
			(s: any) => s.studentQRCodes && s.studentQRCodes.length > 0
		);

		if (studentsWithQR.length === 0) {
			notifications.warning('No active QR codes available. Generate QR codes first from the QR Codes page.');
			isPrintingQRCodes = false;
			return;
		}

		try {
			// Import QRCode library dynamically
			const QRCode = await import('qrcode');

			// Generate QR codes as data URLs
			const qrDataPromises = studentsWithQR.map(async (student: any) => {
				const qrCode = student.studentQRCodes[0];
				const dataUrl = await QRCode.toDataURL(qrCode.token, {
					width: 200,
					margin: 1,
					errorCorrectionLevel: 'M'
				});
				return {
					id: student.id,
					name: student.name || 'Unnamed Student',
					uuid: student.uuid,
					dataUrl
				};
			});

			const qrData = await Promise.all(qrDataPromises);

			// Generate print HTML with QR codes as images
			const printWindow = window.open('', '_blank');
			if (!printWindow) {
				notifications.error('Please allow pop-ups to print QR codes');
				isPrintingQRCodes = false;
				return;
			}

			// Build QR cards HTML with images
			const qrCardsHtml = qrData.map((student) => {
				return `
					<div class="qr-card">
						<div class="student-name">${student.name}</div>
						<img src="${student.dataUrl}" class="qr-image" alt="QR Code for ${student.name}" />
						<div class="instructions">Scan to login</div>
						<div class="student-code">${student.uuid}</div>
					</div>
				`;
			}).join('');

			const currentDate = new Date().toLocaleDateString();
			const currentTime = new Date().toLocaleTimeString();

			printWindow.document.write(`
				<!DOCTYPE html>
				<html>
				<head>
					<title>QR Codes - ${classStore.name}</title>
					<meta charset="UTF-8">
					<style>
						* {
							margin: 0;
							padding: 0;
							box-sizing: border-box;
						}

						@media print {
							@page {
								size: A4;
								margin: 1cm;
							}
							body {
								margin: 0;
								print-color-adjust: exact;
								-webkit-print-color-adjust: exact;
							}
						}

						body {
							font-family: Arial, sans-serif;
							padding: 20px;
						}

						.header {
							text-align: center;
							margin-bottom: 30px;
							padding-bottom: 20px;
							border-bottom: 2px solid #333;
						}

						.header h1 {
							font-size: 24px;
							margin-bottom: 8px;
							color: #333;
						}

						.header p {
							font-size: 14px;
							color: #666;
						}

						.grid {
							display: grid;
							grid-template-columns: repeat(2, 1fr);
							gap: 20px;
							width: 100%;
						}

						.qr-card {
							border: 2px dashed #ccc;
							border-radius: 8px;
							padding: 20px;
							text-align: center;
							break-inside: avoid;
							page-break-inside: avoid;
						}

						.student-name {
							font-weight: bold;
							font-size: 16px;
							margin-bottom: 15px;
							color: #333;
						}

						.qr-image {
							display: block;
							margin: 10px auto;
							max-width: 200px;
							height: auto;
						}

						.instructions {
							font-size: 12px;
							color: #666;
							margin-top: 10px;
						}

						.student-code {
							font-family: 'Courier New', monospace;
							font-size: 11px;
							color: #999;
							margin-top: 8px;
						}

						.footer {
							margin-top: 30px;
							padding-top: 20px;
							border-top: 1px solid #ddd;
							text-align: center;
							font-size: 12px;
							color: #999;
						}
					</style>
				</head>
				<body>
					<div class="header">
						<h1>${classStore.name} - Student QR Codes</h1>
						<p>${classItem.organization?.name || ''} | Grade ${classStore.grade} | ${studentsWithQR.length} Students</p>
					</div>
					<div class="grid">
						${qrCardsHtml}
					</div>
					<div class="footer">
						<p>Generated on ${currentDate} at ${currentTime}</p>
					</div>
					<script>
						// Trigger print after a short delay to ensure images are loaded
						setTimeout(() => {
							window.print();
						}, 500);
					<\/script>
				</body>
				</html>
			`);

			printWindow.document.close();

			notifications.success(`Preparing to print ${studentsWithQR.length} QR codes`);

		} catch (error) {
			console.error('Failed to generate QR codes:', error);
			notifications.error('Failed to generate QR codes for printing');
		} finally {
			// Reset state after a delay
			setTimeout(() => {
				isPrintingQRCodes = false;
			}, 1000);
		}
	}
</script>

<svelte:head>
	<title>{classStore.name} - {$t('teacher.home.teacher_portal')}</title>
</svelte:head>


	<!-- Header -->

	<div class="">
		<div class="flex justify-between items-center h-16">
			<div class="flex items-center space-x-4">
				<a href="/classes" class="text-neutral-500 hover:text-neutral-700" aria-label="Back to classes">
					<ArrowLeft class="h-6 w-6" />
				</a>
				<!-- Class Avatar -->
				{#if classStore.avatarUrl}
					<div class="flex-shrink-0">
						<img
							src={classStore.avatarUrl}
							alt="{classStore.name} avatar"
							class="h-12 w-12 rounded-full object-cover border-2 border-neutral-200"
						/>
					</div>
				{:else}
					<div class="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
						<span class="text-white font-bold text-lg">{classStore.name.charAt(0)}</span>
					</div>
				{/if}
				<div>
					<h1 class="text-2xl font-semibold text-neutral-900">{classStore.name}</h1>
					<p class="text-sm text-neutral-500">{classStore.displayInfo.grade}</p>
				</div>
			</div>
			<div class="flex items-center space-x-3">
				{#if classStore.studentCount > 0}
					<Button
						variant="outline"
						size="sm"
						onclick={printAllQRCodes}
						disabled={isPrintingQRCodes}
					>
						<Printer class="-ml-1 mr-2 h-4 w-4" />
						{isPrintingQRCodes ? 'Preparing...' : 'Print QR Codes'}
					</Button>
				{/if}

				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						showEditForm = true;
						showImagePicker = false;
					}}
				>
					<Edit class="-ml-1 mr-2 h-4 w-4" />
					{$t('common.edit')} Klasse
				</Button>

			</div>
		</div>
	</div>
	
	<div class="pt-8">
		<!-- Edit Form Drawer -->
		<Drawer
			bind:open={showEditForm}
			title="{$t('common.edit')} Klasse"
			position="right"
			size="lg"
			padding="lg"
		>
			{#snippet children()}
				<form method="POST" action="?/update" use:formEnhance id="edit-class-form">
					<div class="space-y-4">
							<AuthInput
								name="name"
								label={$t('common.name')}
								bind:value={$form.name}
								error={$errors.name?.[0]}
								required
							/>

							<div>
								<label for="grade" class="block text-sm font-medium text-neutral-700 mb-1">
									{$t('student.register.grade_label')}
								</label>
								<select
									id="grade"
									name="grade"
									bind:value={$form.grade}
									class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
								<label class="block text-sm font-medium text-neutral-700 mb-3">
									Klassenlogo
								</label>

								{#if $form.avatarUrl}
									<!-- Current Image Display -->
									<div class="mb-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
										<div class="flex items-center space-x-4">
											<img
												src={$form.avatarUrl}
												alt="Aktuelles Klassenlogo"
												class="w-16 h-16 rounded-lg object-cover border-2 border-neutral-300"
											/>
											<div class="flex-1">
												<p class="text-sm font-medium text-neutral-900">Aktuelles Logo</p>
												<p class="text-xs text-neutral-500">Klicken Sie unten, um das Logo zu ändern</p>
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
												class="text-danger-600 hover:text-danger-800 text-sm font-medium"
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
										class="w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg text-center hover:border-neutral-400 transition-colors"
									>
										<svg class="mx-auto h-8 w-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
										</svg>
										<span class="text-sm text-neutral-600">Neues Logo auswählen</span>
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
										class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
									/>
									<span class="ml-2 text-sm text-neutral-700">Class is active</span>
								</label>
							</div>
					</div>
				</form>
			{/snippet}

			{#snippet footer()}
				<div class="flex justify-between w-full">
					<Button
						variant="ghost"
						color="danger"
						onclick={() => { showEditForm = false; showDeleteConfirm = true; }}
					>
						Delete Class
					</Button>
					<div class="flex space-x-3">
						<Button
							variant="outline"
							onclick={() => showEditForm = false}
						>
							Cancel
						</Button>
						<Button type="submit" form="edit-class-form" variant="solid" color="primary" disabled={$submitting}>
							{#if $submitting}
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Saving...
							{:else}
								Save Changes
							{/if}
						</Button>
					</div>
				</div>
			{/snippet}
		</Drawer>

		<!-- Delete Confirmation Modal -->
		{#if showDeleteConfirm}
			<div class="fixed inset-0 bg-neutral-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onclick={() => showDeleteConfirm = false}>
				<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onclick={(e) => e.stopPropagation()}>
					<div class="text-center">
						<svg class="mx-auto mb-4 h-12 w-12 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
						<h3 class="mb-2 text-lg font-semibold text-neutral-900">Delete Class</h3>
						<p class="mb-4 text-sm text-neutral-500">
							Are you sure you want to delete <strong>"{classStore.name}"</strong>?
							{#if classStore.studentCount > 0}
								<br><span class="text-danger-600">This class has {classStore.studentCount} student(s). Please remove all students first.</span>
							{:else}
								This action cannot be undone.
							{/if}
						</p>
						<div class="flex justify-center space-x-3">
							<Button
								variant="outline"
								onclick={() => showDeleteConfirm = false}
							>
								Cancel
							</Button>
							{#if classStore.studentCount === 0}
								<form method="POST" action="?/delete" use:enhance>
									<Button
										type="submit"
										variant="solid"
										color="danger"
									>
										Delete Class
									</Button>
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
				<Card variant="elevated" padding="lg">
					<h2 class="text-lg font-semibold text-neutral-900 mb-4">Class Details</h2>
					<dl class="space-y-3">
						<div>
							<dt class="text-sm font-medium text-neutral-500">Name</dt>
							<dd class="text-sm text-neutral-900">{classStore.name}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-neutral-500">Grade</dt>
							<dd class="text-sm text-neutral-900">{classStore.grade}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-neutral-500">Students</dt>
							<dd class="text-sm text-neutral-900">{classStore.displayInfo.studentCount}</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-neutral-500">Status</dt>
							<dd>
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {classStore.isActive ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'}">
									{classStore.displayInfo.status}
								</span>
							</dd>
						</div>
						<div>
							<dt class="text-sm font-medium text-neutral-500">Created</dt>
							<dd class="text-sm text-neutral-900">{formatDate(classItem.createdAt)}</dd>
						</div>
						{#if classItem.organization}
							<div>
								<dt class="text-sm font-medium text-neutral-500">School</dt>
								<dd class="text-sm text-neutral-900">{classItem.organization.name}</dd>
							</div>
						{/if}
					</dl>
				</Card>
			</div>

			<!-- Students List -->
			<div class="lg:col-span-2">
				<Card variant="elevated" padding="none">
					<div class="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
						<h2 class="text-lg font-semibold text-neutral-900">Students ({classStore.studentCount})</h2>
						<a
							href="/classes/{classItem.id}/students"
							class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200"
						>
							Manage Students
						</a>
					</div>

					{#if classStore.studentCount === 0}
						<div class="p-12 text-center">
							<svg class="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
							</svg>
							<h3 class="text-lg font-medium text-neutral-900 mb-2">No students yet</h3>
							<p class="text-neutral-500 mb-4">Add students to start managing your class.</p>
							<a
								href="/classes/{classItem.id}/students"
								class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
							>
								Add Students
							</a>
						</div>
					{:else}
						<div class="divide-y divide-neutral-200">
							{#each classStore.students.slice(0, 5) as student}
								<div class="px-6 py-4 flex items-center justify-between">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10">
											<div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
												<span class="text-sm font-medium text-primary-600">
													{student.name?.charAt(0) || '?'}
												</span>
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-neutral-900">{student.name || 'Unnamed Student'}</div>
											<div class="text-sm text-neutral-500 font-mono">{student.uuid}</div>
										</div>
									</div>
									<div class="text-sm text-neutral-500">
										{#if student.lastLoginAt}
											Last login: {formatDate(student.lastLoginAt)}
										{:else}
											Never logged in
										{/if}
									</div>
								</div>
							{/each}
							{#if classStore.studentCount > 5}
								<div class="px-6 py-4 bg-neutral-50">
									<a
										href="/classes/{classItem.id}/students"
										class="text-sm text-primary-600 hover:text-primary-800"
									>
										View all {classStore.studentCount} students →
									</a>
								</div>
							{/if}
						</div>
					{/if}
				</Card>
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
