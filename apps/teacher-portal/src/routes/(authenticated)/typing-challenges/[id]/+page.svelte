<script lang="ts">
	import { Button, Card, notifications, ConfirmationDialog } from '@educational-app/ui';
	import {
		ArrowLeft,
		Edit,
		Trash2,
		Keyboard,
		FileText,
		Clock,
		Zap,
		Users,
		Check,
		X,
		Play,
		AlertTriangle
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const challenge = $derived(data.challenge);

	// Delete confirmation state
	let showDeleteDialog = $state(false);

	// Deletion state
	let isDeleting = $state(false);

	// Check for success notifications
	onMount(() => {
		const created = $page.url.searchParams.get('created');
		const updated = $page.url.searchParams.get('updated');

		if (created) {
			notifications.success('Typing challenge created successfully!');
			goto(`/typing-challenges/${challenge.id}`, { replaceState: true });
		} else if (updated) {
			notifications.success('Typing challenge updated successfully!');
			goto(`/typing-challenges/${challenge.id}`, { replaceState: true });
		}
	});

	// Handle delete with native confirm - TEMPORARY WORKAROUND for cache issues
	async function handleDelete() {
		const confirmed = window.confirm(`Are you sure you want to delete "${challenge.title}"? This action cannot be undone.`);

		if (!confirmed) {
			return;
		}

		isDeleting = true;

		const formElement = document.getElementById('deleteForm') as HTMLFormElement;
		if (!formElement) {
			console.error('[Delete Page] Form element not found!');
			isDeleting = false;
			return;
		}

		formElement.requestSubmit();
	}

	// OLD HANDLERS - kept for reference
	async function handleDeleteConfirm() {
		console.log('[Delete Page] handleDeleteConfirm called');
		isDeleting = true;

		const formElement = document.getElementById('deleteForm') as HTMLFormElement;
		if (!formElement) {
			console.error('[Delete Page] Form element not found!');
			isDeleting = false;
			return;
		}

		console.log('[Delete Page] Form element found, submitting...');
		formElement.requestSubmit();
	}

	function handleDeleteCancel() {
		console.log('[Delete Page] handleDeleteCancel called');
		if (!isDeleting) {
			showDeleteDialog = false;
		}
	}

	function getDifficultyColor(difficulty: string): string {
		switch (difficulty) {
			case 'BEGINNER':
				return 'text-success-600 bg-success-50';
			case 'INTERMEDIATE':
				return 'text-warning-600 bg-warning-50';
			case 'ADVANCED':
				return 'text-danger-600 bg-danger-50';
			default:
				return 'text-neutral-600 bg-neutral-50';
		}
	}

	function getThemeLabel(theme: string): string {
		const labels: Record<string, string> = {
			STORY: 'Story (Geschichten)',
			POEM: 'Poem (Gedichte)',
			EDUCATIONAL: 'Educational (Wissenstexte)',
			RHYME: 'Rhyme (Reime)',
			CUSTOM: 'Custom'
		};
		return labels[theme] || theme;
	}

	function getErrorHandlingLabel(mode: string): string {
		const labels: Record<string, string> = {
			BLOCKING: 'Blocking - Student must fix errors',
			HIGHLIGHTING: 'Highlighting - Errors shown but progress continues',
			SPEED_FOCUSED: 'Speed Focused - Errors tracked but not blocking'
		};
		return labels[mode] || mode;
	}

	function getTimerModeLabel(mode: string): string {
		const labels: Record<string, string> = {
			PER_WORD: 'Per Word Timer',
			GLOBAL: 'Global Timer',
			DISABLED: 'No Timer'
		};
		return labels[mode] || mode;
	}
</script>

<svelte:head>
	<title>{challenge.title} - Typing Challenges - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center gap-3 mb-2">
		<a
			href="/typing-challenges"
			class="text-neutral-500 hover:text-neutral-700 transition-colors"
		>
			<ArrowLeft class="w-5 h-5" />
		</a>
		<h1 class="text-2xl font-bold text-neutral-900">{challenge.title}</h1>
	</div>
	{#if challenge.description}
		<p class="text-sm text-neutral-500 ml-8">{challenge.description}</p>
	{/if}
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
	<!-- Main Content -->
	<div class="lg:col-span-2 space-y-6">
		<!-- Metadata Card -->
		<Card variant="outlined" padding="lg">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4">Challenge Details</h2>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-neutral-500 mb-1">Difficulty</p>
					<span
						class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getDifficultyColor(
							challenge.difficulty
						)}"
					>
						{challenge.difficulty}
					</span>
				</div>

				<div>
					<p class="text-sm text-neutral-500 mb-1">Grade Level</p>
					<p class="text-base font-medium text-neutral-900">Grade {challenge.gradeLevel}</p>
				</div>

				<div>
					<p class="text-sm text-neutral-500 mb-1">Theme</p>
					<p class="text-base font-medium text-neutral-900">
						{getThemeLabel(challenge.theme)}
					</p>
				</div>

				<div>
					<p class="text-sm text-neutral-500 mb-1">Status</p>
					<span
						class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {challenge.isActive
							? 'bg-success-50 text-success-700'
							: 'bg-neutral-100 text-neutral-600'}"
					>
						{challenge.isActive ? 'Active' : 'Inactive'}
					</span>
				</div>
			</div>
		</Card>

		<!-- Settings Card -->
		<Card variant="outlined" padding="lg">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4">Challenge Settings</h2>

			<div class="space-y-4">
				<div>
					<p class="text-sm text-neutral-500 mb-1">Error Handling</p>
					<p class="text-base font-medium text-neutral-900">
						{getErrorHandlingLabel(challenge.errorHandling)}
					</p>
				</div>

				<div>
					<p class="text-sm text-neutral-500 mb-1">Timer Mode</p>
					<p class="text-base font-medium text-neutral-900">
						{getTimerModeLabel(challenge.timerMode)}
						{#if challenge.timerMode === 'PER_WORD'}
							<span class="text-sm text-neutral-500">
								({challenge.baseTimePerWord / 1000}s per word)
							</span>
						{/if}
					</p>
				</div>

				<div class="flex items-center gap-6">
					<div class="flex items-center gap-2">
						{#if challenge.enableHints}
							<Check class="w-4 h-4 text-success-600" />
						{:else}
							<X class="w-4 h-4 text-neutral-400" />
						{/if}
						<span class="text-sm text-neutral-700">Progressive Hints</span>
					</div>

					<div class="flex items-center gap-2">
						{#if challenge.enableSounds}
							<Check class="w-4 h-4 text-success-600" />
						{:else}
							<X class="w-4 h-4 text-neutral-400" />
						{/if}
						<span class="text-sm text-neutral-700">Sound Effects</span>
					</div>

					<div class="flex items-center gap-2">
						{#if challenge.showKeyboard}
							<Check class="w-4 h-4 text-success-600" />
						{:else}
							<X class="w-4 h-4 text-neutral-400" />
						{/if}
						<span class="text-sm text-neutral-700">Virtual Keyboard</span>
					</div>
				</div>
			</div>
		</Card>

		<!-- Text Snippets -->
		<Card variant="outlined" padding="lg">
			<h2 class="text-lg font-semibold text-neutral-900 mb-4">
				Text Content
			</h2>

			<div class="space-y-4">
				{#each challenge.texts as text, index}
					<div class="border border-neutral-200 rounded-lg p-4">
						<div class="flex items-center justify-end mb-2">
							<div class="flex items-center gap-3 text-xs text-neutral-500">
								<span>{text.wordCount} words</span>
								<span>{text.characterCount} characters</span>
							</div>
						</div>

						<p class="text-sm text-neutral-700 font-mono leading-relaxed mb-3">
							{text.content}
						</p>

						<div class="flex items-center gap-2 flex-wrap">
							{#if text.hasUmlauts}
								<span class="text-xs px-2 py-0.5 bg-info-100 text-info-700 rounded">
									Umlauts
								</span>
							{/if}
							{#if text.hasNumbers}
								<span class="text-xs px-2 py-0.5 bg-info-100 text-info-700 rounded">
									Numbers
								</span>
							{/if}
							{#if text.hasPunctuation}
								<span class="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
									Punctuation
								</span>
							{/if}
							{#if text.hasUppercase}
								<span class="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
									Uppercase
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</Card>
	</div>

	<!-- Sidebar -->
	<div class="space-y-6">
		<!-- Stats Card -->
		<Card variant="elevated" padding="lg" class="sticky top-6">
			<h3 class="text-lg font-semibold text-neutral-900 mb-4">Statistics</h3>

			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-neutral-600">
						<FileText class="w-4 h-4" />
						<span class="text-sm">Total Texts</span>
					</div>
					<span class="text-lg font-bold text-neutral-900">{challenge.texts.length}</span>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-neutral-600">
						<Zap class="w-4 h-4" />
						<span class="text-sm">Total Words</span>
					</div>
					<span class="text-lg font-bold text-neutral-900">
						{challenge.texts.reduce((sum, t) => sum + t.wordCount, 0)}
					</span>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-neutral-600">
						<Keyboard class="w-4 h-4" />
						<span class="text-sm">Characters</span>
					</div>
					<span class="text-lg font-bold text-neutral-900">
						{challenge.texts.reduce((sum, t) => sum + t.characterCount, 0)}
					</span>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-neutral-600">
						<Users class="w-4 h-4" />
						<span class="text-sm">Assignments</span>
					</div>
					<span class="text-lg font-bold text-neutral-900">{challenge._count.assignments}</span>
				</div>
			</div>

			<div class="mt-6 pt-6 border-t border-neutral-200 space-y-2">
				<a href="/typing-challenges/{challenge.id}/preview" class="block">
					<Button variant="soft" color="secondary" class="w-full">
						<Play class="w-4 h-4 mr-2" />
						Preview Challenge
					</Button>
				</a>

				<a href="/typing-challenges/{challenge.id}/edit" class="block">
					<Button variant="outline" color="primary" class="w-full">
						<Edit class="w-4 h-4 mr-2" />
						Edit Challenge
					</Button>
				</a>

				<Button
					variant="ghost"
					color="danger"
					class="w-full"
					onclick={handleDelete}
					disabled={challenge._count.assignments > 0 || isDeleting}
				>
					<Trash2 class="w-4 h-4 mr-2" />
					{isDeleting ? 'Deleting...' : 'Delete Challenge'}
				</Button>

				{#if challenge._count.assignments > 0}
					<p class="text-xs text-center text-warning-600 mt-2">
						Cannot delete: assigned to {challenge._count.assignments} student{challenge._count
							.assignments > 1
							? 's'
							: ''}
					</p>
				{/if}
			</div>

			<div class="mt-6 pt-6 border-t border-neutral-200 text-xs text-neutral-500">
				<p class="mb-1">
					<span class="font-medium">Created:</span>
					{new Date(challenge.createdAt).toLocaleDateString()}
				</p>
				<p class="mb-1">
					<span class="font-medium">Updated:</span>
					{new Date(challenge.updatedAt).toLocaleDateString()}
				</p>
				{#if challenge.creator}
					<p>
						<span class="font-medium">By:</span>
						{challenge.creator.name || challenge.creator.email}
					</p>
				{/if}
			</div>
		</Card>
	</div>
</div>

<!-- Hidden delete form -->
<form
	id="deleteForm"
	method="POST"
	action="?/deleteChallenge"
	class="hidden"
	use:enhance={() => {
		isDeleting = true;

		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				await update();
			} else if (result.type === 'failure') {
				notifications.error(result.data?.form?.message || 'Failed to delete challenge');
				showDeleteDialog = false;
				isDeleting = false;
			} else if (result.type === 'error') {
				notifications.error('An error occurred. Please try again.');
				showDeleteDialog = false;
				isDeleting = false;
			} else {
				await update();
				isDeleting = false;
			}
		};
	}}
>
	<!-- No form fields needed, just the action -->
</form>

<!-- Delete Confirmation Dialog -->
<ConfirmationDialog
	bind:open={showDeleteDialog}
	title="Delete Typing Challenge?"
	icon={Trash2}
	iconColor="danger"
	confirmLabel="Delete Challenge"
	confirmColor="danger"
	cancelLabel="Cancel"
	loading={isDeleting}
	onConfirm={handleDeleteConfirm}
	onCancel={handleDeleteCancel}
	closeOnBackdropClick={!isDeleting}
	closeOnEscape={!isDeleting}
>
	<p class="text-sm text-neutral-600">
		Are you sure you want to delete <span class="font-semibold">"{challenge.title}"</span>?
		This action cannot be undone.
	</p>
</ConfirmationDialog>
