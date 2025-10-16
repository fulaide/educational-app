<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { t } from '@educational-app/i18n';
	import { Button, Card, QRCode, useNotifications } from '@educational-app/ui';
	import { ArrowLeft, CheckSquare, Download, Printer, RefreshCw, Square } from 'lucide-svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const notifications = useNotifications();

	// Make translations reactive
	const pageTitle = $derived($t('student.qr_codes.title'));
	const pageSubtitle = $derived($t('student.qr_codes.subtitle'));
	const generateAllText = $derived($t('student.qr_codes.generate_all'));
	const printAllText = $derived($t('student.qr_codes.print_all'));
	const backToDashboard = $derived($t('student.qr_codes.back_to_dashboard'));
	const expiresInText = $derived($t('student.qr_codes.expires_in'));
	const generateNewText = $derived($t('student.qr_codes.generate_new'));

	let selectedStudents = $state(new Set<string>());
	let selectAll = $state(false);
	let isGenerating = $state(false);

	function toggleSelectAll() {
		if (selectAll) {
			selectedStudents = new Set(data.students.map(s => s.id));
		} else {
			selectedStudents = new Set();
		}
	}

	function toggleStudent(studentId: string) {
		if (selectedStudents.has(studentId)) {
			selectedStudents.delete(studentId);
		} else {
			selectedStudents.add(studentId);
		}
		selectedStudents = selectedStudents; // Trigger reactivity
	}

	async function handleBulkGenerate() {
		isGenerating = true;
		const form = document.getElementById('bulk-generate-form') as HTMLFormElement;
		if (form) {
			form.requestSubmit();
		}
	}
</script>

<svelte:head>
	<title>{pageTitle} - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<div class="flex items-center space-x-4 mb-2">
				<a href="/students" class="text-gray-500 hover:text-gray-700">
					<ArrowLeft class="h-6 w-6" />
				</a>
				<h1 class="text-2xl font-bold text-neutral-900">{pageTitle}</h1>
			</div>
			<p class="text-sm text-neutral-500 ml-10">
				{pageSubtitle}
			</p>
		</div>
	</div>
</div>

<!-- Info Box -->
<Card variant="outlined" padding="md" class="mb-6 bg-blue-50 border-blue-200">
	<div class="flex items-start space-x-3">
		<div class="flex-shrink-0">
			<svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
				<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
			</svg>
		</div>
		<div class="flex-1">
			<h3 class="text-sm font-medium text-blue-900 mb-1">How to use QR Codes</h3>
			<p class="text-sm text-blue-700">
				Generate QR codes for your students to scan with their devices. Each QR code is unique and expires after a set time for security.
			</p>
		</div>
	</div>
</Card>

<!-- Actions Bar -->
<div class="flex justify-between items-center mb-6">
	<div class="flex items-center gap-4">
		<label class="flex items-center gap-2 cursor-pointer">
			<input
				type="checkbox"
				bind:checked={selectAll}
				onchange={toggleSelectAll}
				class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
			>
			<span class="text-sm text-neutral-700">
				{$t('student.qr_codes.select_all')} ({data.students.length})
			</span>
		</label>

		{#if selectedStudents.size > 0}
			<span class="text-sm text-primary-600 font-medium">
				{selectedStudents.size} {$t('student.qr_codes.selected')}
			</span>
		{/if}
	</div>

	<div class="flex gap-3">
		<Button
			variant="outline"
			disabled={selectedStudents.size === 0 || isGenerating}
			loading={isGenerating}
			onclick={handleBulkGenerate}
		>
			<Download class="w-4 h-4 mr-2" />
			{generateAllText}
		</Button>

		<Button
			variant="solid"
			color="primary"
			disabled={selectedStudents.size === 0}
			onclick={() => window.print()}
		>
			<Printer class="w-4 h-4 mr-2" />
			{printAllText}
		</Button>
	</div>
</div>

<!-- Hidden bulk generate form -->
<form
	id="bulk-generate-form"
	method="POST"
	action="?/generateBulkQR"
	class="hidden"
	use:enhance={() => {
		return async ({ result, update }) => {
			isGenerating = false;
			await update();
			if (result.type === 'success') {
				notifications.success(result.data?.message || 'QR codes generated successfully');
				await invalidateAll();
			} else if (result.type === 'failure') {
				notifications.error(result.data?.error || 'Failed to generate QR codes');
			}
		};
	}}
>
	{#each Array.from(selectedStudents) as studentId}
		<input type="hidden" name="studentIds" value={studentId} />
	{/each}
</form>

<!-- Students Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	{#each data.students as student (student.id)}
		<Card variant="elevated" padding="lg" class="relative">
			<!-- Selection checkbox -->
			<div class="absolute top-4 left-4 z-10">
				<input
					type="checkbox"
					checked={selectedStudents.has(student.id)}
					onchange={() => toggleStudent(student.id)}
					class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer w-5 h-5"
				>
			</div>

			<div class="text-center pt-4">
				<!-- Student Info -->
				<div class="mb-4">
					<h3 class="font-semibold text-neutral-900 mb-1">
						{student.name || `Student ${student.uuid.slice(0, 8)}`}
					</h3>
					<p class="text-sm text-neutral-500">
						{$t('student.qr_codes.grade')} {student.grade} • UUID: {student.uuid.slice(0, 8)}...
					</p>
				</div>

				<!-- QR Code -->
				{#if student.currentQRCode}
					<div class="mb-4 bg-white p-4 rounded-lg border-2 border-neutral-200">
						<QRCode
							value={student.currentQRCode.token}
							size={150}
							class="mx-auto"
						/>
						<p class="text-xs text-neutral-500 mt-3">
							{expiresInText}: {new Date(student.currentQRCode.expiresAt).toLocaleString()}
						</p>
					</div>
				{:else}
					<div class="mb-4 flex flex-col items-center justify-center h-[150px] bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300">
						<Square class="h-12 w-12 text-neutral-400 mb-2" />
						<p class="text-neutral-500 text-sm">{$t('student.qr_codes.no_qr_code')}</p>
					</div>
				{/if}

				<!-- Actions -->
				<form
					method="POST"
					action="?/generateQR"
					class="w-full"
					use:enhance={() => {
						return async ({ result, update }) => {
							await update();
							if (result.type === 'success') {
								notifications.success(result.data?.message || 'QR code generated');
								await invalidateAll();
							} else if (result.type === 'failure') {
								notifications.error(result.data?.error || 'Failed to generate QR code');
							}
						};
					}}
				>
					<input type="hidden" name="studentId" value={student.id} />
					<Button
						type="submit"
						variant="soft"
						color="primary"
						class="w-full"
					>
						<RefreshCw class="w-4 h-4 mr-2" />
						{generateNewText}
					</Button>
				</form>
			</div>
		</Card>
	{/each}
</div>