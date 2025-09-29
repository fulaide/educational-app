<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { AuthButton, AuthInput, Button, Card, Modal, useNotifications } from '@educational-app/ui';
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
				editingStudent = null;
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
	let addMode: 'existing' | 'new' = $state('existing');
	let confirmRemove: string | null = $state(null);
	let editingStudent: string | null = $state(null);

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
		editingStudent = student.id;
		$editData.studentId = student.id;
		$editData.name = student.name || '';
		$editData.grade = student.grade;
		$editData.isActive = student.isActive;
	}

	function cancelEdit() {
		editingStudent = null;
		editForm.reset();
	}
</script>

<svelte:head>
	<title>Manage Students - {classItem.name} - Teacher Portal</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center space-x-4">
					<a href="/classes/{classItem.id}" class="text-gray-500 hover:text-gray-700">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
						</svg>
					</a>
					<div>
						<h1 class="text-2xl font-semibold text-gray-900">{classItem.name} Students</h1>
						<p class="text-sm text-gray-500">
							Grade {classItem.grade} • {classItem.students.length} / {classItem.maxStudents} students
						</p>
					</div>
				</div>
				<div class="flex items-center space-x-3">
					<button 
						type="button"
						class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
						onclick={() => { showAddForm = true; showCreateForm = false; }}
					>
						<svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						Add Student
					</button>
					<button 
						type="button"
						class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
						onclick={() => { showCreateForm = true; showAddForm = false; }}
					>
						<svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
						Create Students
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- Add Student Form -->
		{#if showAddForm}
			<div class="bg-white shadow rounded-lg p-6 mb-8">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-lg font-semibold text-gray-900">Add Student to Class</h2>
					<button 
						type="button"
						class="text-gray-400 hover:text-gray-600"
						onclick={() => showAddForm = false}
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>

				<!-- Mode Switcher -->
				<div class="flex rounded-lg bg-gray-100 p-1 mb-6">
					<button 
						type="button"
						class="flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors {addMode === 'existing' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
						onclick={() => addMode = 'existing'}
					>
						🔍 Add Existing Student
					</button>
					<button 
						type="button"
						class="flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors {addMode === 'new' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
						onclick={() => addMode = 'new'}
					>
						✨ Create New Student
					</button>
				</div>

				{#if addMode === 'existing'}
					<!-- Add Existing Student -->
					<form method="POST" action="?/addExisting" use:addEnhance>
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
								<div class="bg-blue-50 rounded-lg p-4">
									<h4 class="text-sm font-medium text-blue-900 mb-2">Available Students (Grade {classItem.grade}):</h4>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
										{#each availableStudents as student}
											<button 
												type="button"
												class="flex items-center p-2 text-left text-sm bg-white rounded border hover:bg-blue-50 transition-colors"
												onclick={() => $addData.studentCode = student.uuid}
											>
												<span class="font-mono text-xs text-gray-500">{student.uuid}</span>
												<span class="ml-2 text-gray-900">{student.name || 'Unnamed'}</span>
											</button>
										{/each}
									</div>
								</div>
							{/if}

							<div class="flex justify-end space-x-3">
								<button 
									type="button"
									class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
									onclick={() => showAddForm = false}
								>
									Cancel
								</button>
								<AuthButton type="submit">
									Add Student
								</AuthButton>
							</div>
						</div>
					</form>
				{:else}
					<!-- Create New Student -->
					<form method="POST" action="?/addExisting" use:addEnhance>
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

							<div class="bg-green-50 rounded-lg p-4">
								<p class="text-sm text-green-700">
									📝 A new student account will be created with:
								</p>
								<ul class="text-sm text-green-600 mt-1 ml-4 list-disc">
									<li>Grade: {classItem.grade}</li>
									<li>Auto-generated unique student code</li>
									<li>Automatically added to this class</li>
								</ul>
							</div>

							<div class="flex justify-end space-x-3">
								<button 
									type="button"
									class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
									onclick={() => showAddForm = false}
								>
									Cancel
								</button>
								<AuthButton type="submit">
									Create & Add Student
								</AuthButton>
							</div>
						</div>
					</form>
				{/if}
			</div>
		{/if}

		<!-- Create Multiple Students Form -->
		{#if showCreateForm}
			<div class="bg-white shadow rounded-lg p-6 mb-8">
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-lg font-semibold text-gray-900">Create Multiple Students</h2>
					<button 
						type="button"
						class="text-gray-400 hover:text-gray-600"
						onclick={() => showCreateForm = false}
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>

				<form method="POST" action="?/createNew" use:createEnhance>
					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<AuthInput 
								name="studentCount"
								label="Number of Students"
								type="number"
								placeholder="5"
								bind:value={$createData.studentCount}
								error={$createErrors.studentCount?.[0]}
								min={1}
								max={Math.min(20, classItem.maxStudents - classItem.students.length)}
								required
							/>

							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">
									Available Spots
								</label>
								<div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
									{classItem.maxStudents - classItem.students.length} remaining
								</div>
							</div>
						</div>

						<div>
							<label for="studentNames" class="block text-sm font-medium text-gray-700 mb-1">
								Student Names (Optional)
							</label>
							<textarea 
								id="studentNames"
								name="studentNames"
								bind:value={$createData.studentNames}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								rows={3}
								placeholder={$createData.studentCount ? generateNamePlaceholders($createData.studentCount) : 'Enter names separated by commas (e.g., John Smith, Jane Doe, Bob Johnson)'}
							></textarea>
							<p class="mt-1 text-xs text-gray-500">
								Leave blank to auto-generate names like "Student 1", "Student 2", etc.
							</p>
						</div>

						<div class="bg-blue-50 rounded-lg p-4">
							<p class="text-sm text-blue-700 mb-2">
								🎯 <strong>What will happen:</strong>
							</p>
							<ul class="text-sm text-blue-600 ml-4 list-disc space-y-1">
								<li>Create {$createData.studentCount || 0} new student accounts</li>
								<li>Each gets a unique 8-character student code</li>
								<li>All set to Grade {classItem.grade}</li>
								<li>Automatically added to this class</li>
								<li>Ready for students to log in immediately</li>
							</ul>
						</div>

						<div class="flex justify-end space-x-3">
							<button 
								type="button"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
								onclick={() => showCreateForm = false}
							>
								Cancel
							</button>
							<AuthButton type="submit">
								Create {$createData.studentCount || 0} Students
							</AuthButton>
						</div>
					</div>
				</form>
			</div>
		{/if}

		<!-- Students List -->
		<div class="bg-white shadow rounded-lg">
			<div class="px-6 py-4 border-b border-gray-200">
				<h2 class="text-lg font-semibold text-gray-900">Class Roster</h2>
			</div>

			{#if classItem.students.length === 0}
				<div class="p-12 text-center">
					<svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
					</svg>
					<h3 class="text-lg font-medium text-gray-900 mb-2">No students in this class yet</h3>
					<p class="text-gray-500 mb-6">Add students to start building your class roster.</p>
					<div class="flex justify-center space-x-3">
						<button 
							type="button"
							class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
							onclick={() => showAddForm = true}
						>
							Add Individual Student
						</button>
						<button 
							type="button"
							class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
							onclick={() => showCreateForm = true}
						>
							Create Multiple Students
						</button>
					</div>
				</div>
			{:else}
				<div class="divide-y divide-gray-200">
					{#each classItem.students as student}
						<div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
							<div class="flex items-center">
								<!-- Avatar -->
								<div class="flex-shrink-0 h-10 w-10">
									<div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
										<span class="text-sm font-medium text-white">
											{getStudentInitials(student.name)}
										</span>
									</div>
								</div>

								<!-- Student Info -->
								<div class="ml-4">
									<div class="flex items-center space-x-2">
										<div class="text-sm font-medium text-gray-900">
											{student.name || 'Unnamed Student'}
										</div>
										{#if !student.isActive}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
												Inactive
											</span>
										{/if}
									</div>
									<div class="flex items-center space-x-4 text-sm text-gray-500">
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
								<button 
									type="button"
									class="text-blue-600 hover:text-blue-900 text-sm font-medium"
									onclick={() => startEditingStudent(student)}
								>
									Edit
								</button>
								<button 
									type="button"
									class="text-red-600 hover:text-red-900 text-sm font-medium"
									onclick={() => confirmRemove = student.id}
								>
									Remove
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Edit Student Modal -->
		{#if editingStudent}
			{@const studentToEdit = classItem.students.find(s => s.id === editingStudent)}
			<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onclick={() => cancelEdit()}>
				<div class="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white" onclick={(e) => e.stopPropagation()}>
					<div class="flex justify-between items-center mb-4">
						<h3 class="text-lg font-semibold text-gray-900">Edit Student</h3>
						<button 
							type="button"
							class="text-gray-400 hover:text-gray-600"
							onclick={() => cancelEdit()}
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
					
					<form method="POST" action="?/edit" use:editEnhance class="space-y-4">
						<input type="hidden" name="studentId" bind:value={$editData.studentId} />
						
						<AuthInput 
							name="name"
							label="Student Name"
							placeholder="Enter student's full name"
							bind:value={$editData.name}
							error={$editErrors.name?.[0]}
							required
						/>
						
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Grade</label>
							<select 
								name="grade" 
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								bind:value={$editData.grade}
								required
							>
								<option value={1}>Grade 1</option>
								<option value={2}>Grade 2</option>
								<option value={3}>Grade 3</option>
								<option value={4}>Grade 4</option>
							</select>
							{#if $editErrors.grade?.[0]}
								<p class="mt-1 text-sm text-red-600">{$editErrors.grade[0]}</p>
							{/if}
						</div>
						
						<div class="flex items-center">
							<input 
								type="checkbox" 
								name="isActive"
								id="isActive"
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								bind:checked={$editData.isActive}
							/>
							<label for="isActive" class="ml-2 block text-sm text-gray-900">
								Student is active
							</label>
						</div>
						{#if $editErrors.isActive?.[0]}
							<p class="mt-1 text-sm text-red-600">{$editErrors.isActive[0]}</p>
						{/if}
						
						<div class="flex justify-end space-x-3 pt-4">
							<button 
								type="button"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
								onclick={() => cancelEdit()}
							>
								Cancel
							</button>
							<AuthButton type="submit" disabled={$editSubmitting}>
								{#if $editSubmitting}
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
					</form>
				</div>
			</div>
		{/if}

		<!-- Remove Student Confirmation Modal -->
		{#if confirmRemove}
			{@const studentToRemove = classItem.students.find(s => s.id === confirmRemove)}
			<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onclick={() => confirmRemove = null}>
				<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onclick={(e) => e.stopPropagation()}>
					<div class="text-center">
						<svg class="mx-auto mb-4 h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
						<h3 class="mb-2 text-lg font-semibold text-gray-900">Remove Student</h3>
						<p class="mb-4 text-sm text-gray-500">
							Remove <strong>"{studentToRemove?.name || 'Student'}"</strong> from this class?
							<br><span class="text-xs">Note: This only removes them from the class, it doesn't delete their account.</span>
						</p>
						<div class="flex justify-center space-x-3">
							<button 
								type="button"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
								onclick={() => confirmRemove = null}
							>
								Cancel
							</button>
							<form 
								method="POST" 
								action="?/remove" 
								use:removeEnhance
								onsubmit={() => {
									console.log('Removing student with ID:', confirmRemove);
									$removeData.studentId = confirmRemove || '';
								}}
							>
								<input type="hidden" name="studentId" value={confirmRemove || ''} />
								<button 
									type="submit"
									disabled={$removeSubmitting}
									class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
								>
									{#if $removeSubmitting}
										<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Removing...
									{:else}
										Remove Student
									{/if}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
