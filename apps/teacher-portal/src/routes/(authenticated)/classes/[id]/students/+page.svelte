<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { AuthInput, Button, Card, ConfirmationDialog, Drawer, QRCode, useNotifications } from '@educational-app/ui';
	import { ArrowLeft, TriangleAlert, UserPlus, UserSearch, QrCode as QrCodeIcon, Printer, Download } from 'lucide-svelte';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Toast notifications
	const notifications = useNotifications();

	// Reactive access to data using $derived in runes mode
	const classItem = $derived(data.classItem);
	const availableStudents = $derived(data.availableStudents);

	// Form schemas
	const addStudentSchema = z.object({
		studentCode: z.string().min(8).max(8).optional(),
		studentName: z.string().min(1).optional(),
		mode: z.enum(['existing', 'new'])
	});

	const createStudentsSchema = z.object({
		studentCount: z.number().min(1).max(20),
		studentNames: z.string().optional()
	});

	const editStudentSchema = z.object({
		studentId: z.string().min(1),
		name: z.string().min(1).max(100),
		grade: z.number().min(1).max(4),
		isActive: z.boolean()
	});

	const removeStudentSchema = z.object({
		studentId: z.string().min(1)
	});

	// Forms
	const addForm = superForm(data.addStudentForm, {
		validators: zodClient(addStudentSchema),
		id: 'addStudent',
		onUpdated({ form }) {
			if (form.valid && form.message) {
				notifications.success(form.message);
				showAddForm = false;
				invalidateAll(); // Refresh page data
			} else if (form.message) {
				notifications.error(form.message);
			}
		},
		onError({ result }) {
			notifications.error('Failed to add student. Please try again.');
		}
	});

	const createForm = superForm(data.createStudentsForm, {
		validators: zodClient(createStudentsSchema),
		id: 'createStudents',
		onUpdated({ form }) {
			if (form.valid && form.message) {
				notifications.success(form.message);
				showCreateForm = false;
				invalidateAll(); // Refresh page data
			} else if (form.message) {
				notifications.error(form.message);
			}
		},
		onError({ result }) {
			notifications.error('Failed to create students. Please try again.');
		}
	});

	const editForm = superForm(data.editStudentForm, {
		validators: zodClient(editStudentSchema),
		id: 'editStudent',
		onUpdated({ form }) {
			if (form.valid && form.message) {
				notifications.success(form.message);
				showEditForm = false;
				invalidateAll(); // Refresh page data
			} else if (form.message) {
				notifications.error(form.message);
			}
		},
		onError({ result }) {
			notifications.error('Failed to update student. Please try again.');
		}
	});

	// Remove form
	const removeForm = superForm(data.removeStudentForm, {
		validators: zodClient(removeStudentSchema),
		id: 'removeStudent',
		onUpdated({ form }) {
			console.log('Remove form onUpdated:', { valid: form.valid, message: form.message, form });
			if (form.valid && form.message) {
				notifications.success(form.message);
				showRemoveDialog = false;
				confirmRemove = null;
				invalidateAll(); // Refresh page data
			} else if (form.message) {
				notifications.error(form.message);
			} else {
				console.log('No message in form response');
			}
		},
		onError({ result }) {
			console.log('Remove form onError:', result);
			notifications.error('Failed to remove student. Please try again.');
		}
	});

	const { form: addData, errors: addErrors, enhance: addEnhance, submitting: addSubmitting } = addForm;
	const { form: createData, errors: createErrors, enhance: createEnhance, submitting: createSubmitting } = createForm;
	const { form: editData, errors: editErrors, enhance: editEnhance, submitting: editSubmitting } = editForm;
	const { form: removeData, enhance: removeEnhance, submitting: removeSubmitting } = removeForm;

	// UI state
	let showAddForm = $state(false);
	let showCreateForm = $state(false);
	let showEditForm = $state(false);
	let showRemoveDialog = $state(false);
	let showQRDrawer = $state(false);
	let addMode: 'existing' | 'new' = $state('existing');
	let confirmRemove: string | null = $state(null);
	let selectedQRData = $state<{ token: string; studentName: string; expiresAt: Date } | null>(null);

	// Initialize form mode
	$addData.mode = addMode;

	// Watch mode changes
	$effect(() => {
		$addData.mode = addMode;
	});

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getStudentInitials(name: string | null) {
		if (!name) return '?';
		return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
	}

	function generateNamePlaceholders(count: number) {
		return Array(count).fill(0).map((_, i) => `Student ${i + 1}`).join(', ');
	}

	function startEditingStudent(student: any) {
		$editData.studentId = student.id;
		$editData.name = student.name || '';
		$editData.grade = student.grade;
		$editData.isActive = student.isActive;
		showEditForm = true;
	}

	// Handle remove confirmation
	function handleRemoveStudent() {
		if (confirmRemove) {
			$removeData.studentId = confirmRemove;
			// Submit the form programmatically
			const removeFormElement = document.getElementById('remove-student-form') as HTMLFormElement;
			if (removeFormElement) {
				removeFormElement.requestSubmit();
			}
		}
	}
</script>

<svelte:head>
	<title>Manage Students - {classItem.name} - Teacher Portal</title>
</svelte:head>


	<!-- Header -->
	<div class="">
		<div class="">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center space-x-4">
					<a href="/classes/{classItem.id}" class="text-gray-500 hover:text-gray-700">
						<ArrowLeft class="h-6 w-6" />
					</a>					
				
					<div>
						<h1 class="text-2xl font-semibold text-gray-900">{classItem.name} Students</h1>
						<p class="text-sm text-gray-500">
							Grade {classItem.grade} • {classItem.students.length} / {classItem.maxStudents} students
						</p>
					</div>
				</div>
				<div class="flex items-center space-x-3">
					

					<Button
						variant="outline"
						color="primary"
						onclick={() => { showAddForm = true; showCreateForm = false; }}
					>
						<UserPlus class="-ml-1 mr-1 h-4 w-4" />
						Add Student
					</Button>

					<Button
						variant="solid"
						color="primary"
						onclick={() => { showCreateForm = true; showAddForm = false; }}
					>
						<UserPlus class="-ml-1 mr-1 h-4 w-4" />
						Create Students
					</Button>
					
				</div>
			</div>
		</div>
	</div>

	<div class="pt-8">
		<!-- Add Student Drawer -->
		<Drawer
			bind:open={showAddForm}
			title="Add Student to Class"
			position="right"
			size="lg"
			padding="lg"
		>
			{#snippet children()}
				<!-- Mode Switcher -->
				<div class=" rounded-lg  border border-neutral-200 p-1 mb-6 grid gap-1 grid-flow-col">
					

					<Button
						variant={addMode === 'existing' ? "soft" : "ghost"}
						color="primary"
						onclick={() => addMode = 'existing'} 
					>
						<UserSearch class="-ml-1 mr-1 h-4 w-4" />	
						Add Existing Student
					</Button>

					<Button
						variant={addMode === 'new' ? "soft" : "ghost"}
						color="primary"
						onclick={() => addMode = 'new'}
					>
						<UserPlus class="-ml-1 mr-1 h-4 w-4" />	
						Create New Student
					</Button>

				</div>

				{#if addMode === 'existing'}
					<!-- Add Existing Student -->
					<form method="POST" action="?/addExisting" use:addEnhance id="add-student-form">
						<input type="hidden" name="mode" value="existing" />
						<div class="space-y-4">
							<AuthInput
								name="studentCode"
								label="Student Code"
								placeholder="Enter 8-character student code"
								bind:value={$addData.studentCode}
								error={$addErrors.studentCode?.[0]}
								maxlength={8}
								class="font-mono uppercase"
								required
							/>

							{#if availableStudents.length > 0}
								<div class="bg-primary-50 rounded-lg p-4">
									<h4 class="text-sm font-medium text-primary-900 mb-2">Available Students (Grade {classItem.grade}):</h4>
									<div class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
										{#each availableStudents as student}
											<!-- <button
												type="button"
												class="flex items-center p-2 text-left text-sm bg-white rounded border border-neutral-200 hover:bg-primary-50 hover:border-primary-300 transition-colors"
												onclick={() => $addData.studentCode = student.uuid}
											>
												<span class="font-mono text-xs text-neutral-500">{student.uuid}</span>
												<span class="ml-2 text-neutral-900">{student.name || 'Unnamed'}</span>
											</button> -->

											<Button
												variant="ghost"
												onclick={() => $addData.studentCode = student.uuid}
											>
												<span class="font-mono text-xs text-neutral-500">{student.uuid}</span>
												<span class="ml-2 text-neutral-900">{student.name || 'Unnamed'}</span>
											</Button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</form>
				{:else}
					<!-- Create New Student -->
					<form method="POST" action="?/addExisting" use:addEnhance id="add-student-form">
						<input type="hidden" name="mode" value="new" />
						<div class="space-y-4">
							<AuthInput
								name="studentName"
								label="Student Name"
								placeholder="Enter student's full name"
								bind:value={$addData.studentName}
								error={$addErrors.studentName?.[0]}
								required
							/>

							<div class="bg-neutral-50 rounded-lg p-4">
								<p class="text-sm text-neutral-700">
									A new student account will be created with:
								</p>
								<ul class="text-sm text-neutral-600 mt-1 ml-4 list-disc">
									<li>Grade: {classItem.grade}</li>
									<li>Auto-generated unique student code</li>
									<li>Automatically added to this class</li>
								</ul>
							</div>
						</div>
					</form>
				{/if}
			{/snippet}

			{#snippet footer()}
				<div class="flex justify-end w-full space-x-3">
					<Button
						variant="outline"
						onclick={() => showAddForm = false}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						form="add-student-form"
						variant="solid"
						color="primary"
						disabled={$addSubmitting}
					>
						{#if $addSubmitting}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							{addMode === 'new' ? 'Creating...' : 'Adding...'}
						{:else}
							{addMode === 'new' ? 'Create & Add Student' : 'Add Student'}
						{/if}
					</Button>
				</div>
			{/snippet}
		</Drawer>

		<!-- Create Multiple Students Drawer -->
		<Drawer
			bind:open={showCreateForm}
			title="Create Multiple Students"
			position="right"
			size="lg"
			padding="lg"
		>
			{#snippet children()}
				<form method="POST" action="?/createNew" use:createEnhance id="create-students-form">
					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="studentCount" class="block text-sm font-medium text-neutral-700 mb-1">
									Number of Students
								</label>
								<input
									id="studentCount"
									name="studentCount"
									type="number"
									placeholder="5"
									bind:value={$createData.studentCount}
									class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
									min={1}
									max={Math.min(20, classItem.maxStudents - classItem.students.length)}
									required
								/>
								{#if $createErrors.studentCount?.[0]}
									<p class="mt-1 text-sm text-danger-600">{$createErrors.studentCount[0]}</p>
								{/if}
							</div>

							<div>
								<label class="block text-sm font-medium text-neutral-700 mb-1">
									Available Spots
								</label>
								<div class="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-md text-sm text-neutral-600">
									{classItem.maxStudents - classItem.students.length} remaining
								</div>
							</div>
						</div>

						<div>
							<label for="studentNames" class="block text-sm font-medium text-neutral-700 mb-1">
								Student Names (Optional)
							</label>
							<textarea
								id="studentNames"
								name="studentNames"
								bind:value={$createData.studentNames}
								class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								rows={3}
								placeholder={$createData.studentCount ? generateNamePlaceholders($createData.studentCount) : 'Enter names separated by commas (e.g., John Smith, Jane Doe, Bob Johnson)'}
							></textarea>
							<p class="mt-1 text-xs text-neutral-500">
								Leave blank to auto-generate names like "Student 1", "Student 2", etc.
							</p>
						</div>

						<div class="bg-primary-50 rounded-lg p-4">
							<p class="text-sm text-primary-700 mb-2">
								<strong>What will happen:</strong>
							</p>
							<ul class="text-sm text-primary-600 ml-4 list-disc space-y-1">
								<li>Create {$createData.studentCount || 0} new student accounts</li>
								<li>Each gets a unique 8-character student code</li>
								<li>All set to Grade {classItem.grade}</li>
								<li>Automatically added to this class</li>
								<li>Ready for students to log in immediately</li>
							</ul>
						</div>
					</div>
				</form>
			{/snippet}

			{#snippet footer()}
				<div class="flex justify-end w-full space-x-3">
					<Button
						variant="outline"
						onclick={() => showCreateForm = false}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						form="create-students-form"
						variant="solid"
						color="primary"
						disabled={$createSubmitting}
					>
						{#if $createSubmitting}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Creating...
						{:else}
							Create {$createData.studentCount || 0} Students
						{/if}
					</Button>
				</div>
			{/snippet}
		</Drawer>

		<!-- Students List -->
		<Card variant="elevated" padding="none">
			<div class="px-6 py-4 border-b border-neutral-200">
				<h2 class="text-lg font-semibold text-neutral-900">Class Students</h2>
			</div>

			{#if classItem.students.length === 0}
				<div class="p-12 text-center">
					
					<UserPlus class="mx-auto h-12 w-12 text-neutral-400 mb-4" />

					<h3 class="text-lg font-medium text-neutral-900 mb-2">No students in this class yet</h3>
					<p class="text-neutral-500 mb-6">Add students to start building your class roster.</p>
					<div class="flex justify-center space-x-3">
					
						<Button
						variant="outline"
									color="primary"
									onclick={() => showAddForm = true}
								>
									Add Individual Student
						</Button>

						<Button
						variant="solid"
									color="primary"
									onclick={() => showCreateForm = true}
								>
									Create Multiple Students
						</Button>


					</div>
				</div>
			{:else}
				<div class="divide-y divide-gray-200">
					{#each classItem.students as student}
						<div class="px-6 py-4 flex items-center justify-between hover:bg-neurtal-50">
							<div class="flex items-center">
								<!-- Avatar -->
								<div class="flex-shrink-0 h-10 w-10">
									<div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
										<span class="text-sm font-medium text-white">
											{getStudentInitials(student.name)}
										</span>
									</div>
								</div>

								<!-- Student Info -->
								<div class="ml-4">
									<div class="flex items-center space-x-2">
										<div class="text-sm font-medium text-neurtal-900">
											{student.name || 'Unnamed Student'}
										</div>
										{#if !student.isActive}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
												Inactive
											</span>
										{/if}
									</div>
									<div class="flex items-center space-x-4 text-sm text-neurtal-500">
										<span class="font-mono">{student.uuid}</span>
										<span>Grade {student.grade}</span>
										<span>
											{#if student.lastLoginAt}
												Last login: {formatDate(student.lastLoginAt)}
											{:else}
												Never logged in
											{/if}
										</span>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex items-center space-x-2">
								{#if student.studentQRCodes && student.studentQRCodes.length > 0}
									<Button
										variant="ghost"
										color="primary"
										onclick={() => {
											const qrCode = student.studentQRCodes[0];
											selectedQRData = {
												token: qrCode.token,
												studentName: student.name || 'Unnamed Student',
												expiresAt: qrCode.expiresAt
											};
											showQRDrawer = true;
										}}
									>
										<QrCodeIcon class="w-4 h-4 " />
										
									</Button>
								{/if}

								<Button
									variant="ghost"
									color="primary"
									onclick={() => startEditingStudent(student)}
								>
									Edit
								</Button>

								<Button
									variant="ghost"
									color="danger"
									onclick={() => {
										confirmRemove = student.id;
										showRemoveDialog = true;
									}}
								>
									Remove
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card>

		<!-- Edit Student Drawer -->
		<Drawer
			bind:open={showEditForm}
			title="Edit Student"
			position="right"
			size="md"
			padding="lg"
		>
			{#snippet children()}
				<form method="POST" action="?/edit" use:editEnhance id="edit-student-form">
					<input type="hidden" name="studentId" bind:value={$editData.studentId} />

					<div class="space-y-4">
						<AuthInput
							name="name"
							label="Student Name"
							placeholder="Enter student's full name"
							bind:value={$editData.name}
							error={$editErrors.name?.[0]}
							required
						/>

						<div>
							<label for="edit-grade" class="block text-sm font-medium text-neutral-700 mb-1">Grade</label>
							<select
								id="edit-grade"
								name="grade"
								class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								bind:value={$editData.grade}
								required
							>
								<option value={1}>Grade 1</option>
								<option value={2}>Grade 2</option>
								<option value={3}>Grade 3</option>
								<option value={4}>Grade 4</option>
							</select>
							{#if $editErrors.grade?.[0]}
								<p class="mt-1 text-sm text-danger-600">{$editErrors.grade[0]}</p>
							{/if}
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								name="isActive"
								id="edit-isActive"
								class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
								bind:checked={$editData.isActive}
							/>
							<label for="edit-isActive" class="ml-2 block text-sm text-neutral-900">
								Student is active
							</label>
						</div>
						{#if $editErrors.isActive?.[0]}
							<p class="mt-1 text-sm text-danger-600">{$editErrors.isActive[0]}</p>
						{/if}
					</div>
				</form>
			{/snippet}

			{#snippet footer()}
				<div class="flex justify-end w-full space-x-3">
					<Button
						variant="outline"
						onclick={() => showEditForm = false}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						form="edit-student-form"
						variant="solid"
						color="primary"
						disabled={$editSubmitting}
					>
						{#if $editSubmitting}
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
			{/snippet}
		</Drawer>

		<!-- Remove Student Confirmation Dialog -->
		<ConfirmationDialog
			bind:open={showRemoveDialog}
			title="Remove Student"
			icon={TriangleAlert}
			iconColor="danger"
			confirmLabel="Remove Student"
			confirmColor="danger"
			cancelLabel="Cancel"
			loading={$removeSubmitting}
			onConfirm={handleRemoveStudent}
			onCancel={() => {
				showRemoveDialog = false;
				confirmRemove = null;
			}}
		>
			{#snippet children()}
				{@const studentToRemove = classItem.students.find(s => s.id === confirmRemove)}
				<p class="mb-2">
					Remove <strong>"{studentToRemove?.name || 'Student'}"</strong> from this class?
				</p>
				<p class="text-xs">
					Note: This only removes them from the class, it doesn't delete their account.
				</p>
			{/snippet}
		</ConfirmationDialog>

		<!-- Hidden form for remove submission -->
		<form
			id="remove-student-form"
			method="POST"
			action="?/remove"
			use:removeEnhance
			class="hidden"
		>
			<input type="hidden" name="studentId" bind:value={$removeData.studentId} />
		</form>

		<!-- QR Code Drawer -->
		<Drawer
			bind:open={showQRDrawer}
			title="Student QR Code"
			position="right"
			size="md"
			padding="lg"
		>
			{#snippet children()}
				{#if selectedQRData}
					<div class="text-center">
						<h4 class="text-lg font-semibold text-neutral-900 mb-6">{selectedQRData.studentName}</h4>

						<!-- QR Code Display -->
						<div class="mb-6 p-6 bg-white border-2 border-neutral-200 rounded-lg inline-block">
							<QRCode
								data={selectedQRData.token}
								size={250}
								showActions={false}
								class="mx-auto"
							/>
						</div>

						<p class="text-sm text-neutral-600 mb-4">
							<span class="font-medium">Expires:</span>
							{#if new Date(selectedQRData.expiresAt).getFullYear() > new Date().getFullYear() + 5}
								No expiry
							{:else}
								{new Date(selectedQRData.expiresAt).toLocaleString()}
							{/if}
						</p>

						<p class="text-xs text-neutral-500">
							Students can scan this QR code to log in to their account.
						</p>
					</div>
				{/if}
			{/snippet}

			{#snippet footer()}
				{#if selectedQRData}
					<div class="flex w-full space-x-3">
						<Button
							variant="outline"
							class="flex-1"
							onclick={() => {
								if (selectedQRData) {
									navigator.clipboard.writeText(selectedQRData.token);
									notifications.success('QR code token copied to clipboard');
								}
							}}
						>
							Copy Token
						</Button>
						<Button
							variant="solid"
							color="primary"
							class="flex-1"
							onclick={() => {
								if (selectedQRData) {
									const printWindow = window.open('', '_blank');
									if (printWindow) {
										printWindow.document.write(`
											<!DOCTYPE html>
											<html>
											<head>
												<title>QR Code - ${selectedQRData.studentName}</title>
												<style>
													body {
														font-family: Arial, sans-serif;
														text-align: center;
														padding: 20px;
													}
													h2 { margin-bottom: 20px; }
													.qr-container {
														display: inline-block;
														padding: 20px;
														border: 2px solid #ddd;
														border-radius: 8px;
														margin: 20px 0;
													}
												</style>
											</head>
											<body>
												<h2>${selectedQRData.studentName}</h2>
												<div class="qr-container">
													<canvas id="qr"></canvas>
												</div>
												<p>Student Login QR Code</p>
												<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"></script>
												<script>
													QRCode.toCanvas(document.getElementById('qr'), '${selectedQRData.token}', { width: 300 });
													setTimeout(() => window.print(), 500);
												</script>
											</body>
											</html>
										`);
										printWindow.document.close();
									}
								}
							}}
						>
							<Printer class="w-4 h-4 mr-2" />
							Print QR Code
						</Button>
					</div>
				{/if}
			{/snippet}
		</Drawer>
	</div>

