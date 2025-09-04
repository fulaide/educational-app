<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { 
		AuthPageContainer, 
		AuthHeader, 
		LocaleSwitcher,
		Card,
		QRCode
	} from '@educational-app/ui';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

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
</script>

<svelte:head>
	<title>{pageTitle} - Lexi</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
	<div class="max-w-7xl mx-auto">
		<LocaleSwitcher variant="buttons" size="sm" />

		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				{pageTitle}
			</h1>
			<p class="text-gray-600">
				{pageSubtitle}
			</p>
		</div>

		<!-- Actions Bar -->
		<div class="flex justify-between items-center mb-6">
			<div class="flex items-center gap-4">
				<label class="flex items-center gap-2">
					<input 
						type="checkbox" 
						bind:checked={selectAll}
						onchange={toggleSelectAll}
						class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					>
					<span class="text-sm text-gray-700">
						{$t('student.qr_codes.select_all')} ({data.students.length})
					</span>
				</label>

				{#if selectedStudents.size > 0}
					<span class="text-sm text-indigo-600">
						{selectedStudents.size} {$t('student.qr_codes.selected')}
					</span>
				{/if}
			</div>

			<div class="flex gap-3">
				<button 
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					disabled={selectedStudents.size === 0}
				>
					{generateAllText}
				</button>
				
				<button 
					class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
					disabled={selectedStudents.size === 0}
				>
					{printAllText}
				</button>
			</div>
		</div>

		<!-- Students Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
			{#each data.students as student (student.id)}
				<Card variant="elevated" padding="md" class="relative">
					<!-- Selection checkbox -->
					<div class="absolute top-3 left-3">
						<input 
							type="checkbox" 
							checked={selectedStudents.has(student.id)}
							onchange={() => toggleStudent(student.id)}
							class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						>
					</div>

					<div class="text-center">
						<!-- Student Info -->
						<div class="mb-4">
							<h3 class="font-semibold text-gray-900 mb-1">
								{student.name || `Student ${student.uuid.slice(0, 8)}`}
							</h3>
							<p class="text-sm text-gray-500">
								{$t('student.qr_codes.grade')} {student.grade} • UUID: {student.uuid.slice(0, 8)}...
							</p>
						</div>

						<!-- QR Code -->
						{#if student.currentQRCode}
							<div class="mb-4">
								<QRCode 
									value={student.currentQRCode.token} 
									size={150}
									class="mx-auto"
								/>
								<p class="text-xs text-gray-500 mt-2">
									{expiresInText}: {new Date(student.currentQRCode.expiresAt).toLocaleString()}
								</p>
							</div>
						{:else}
							<div class="mb-4 flex items-center justify-center h-[150px] bg-gray-100 rounded-lg">
								<p class="text-gray-500 text-sm">{$t('student.qr_codes.no_qr_code')}</p>
							</div>
						{/if}

						<!-- Actions -->
						<div class="space-y-2">
							<form method="POST" action="?/generateQR">
								<input type="hidden" name="studentId" value={student.id} />
								<button 
									type="submit"
									class="w-full px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100"
								>
									{generateNewText}
								</button>
							</form>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Back to Dashboard -->
		<div class="text-center">
			<a 
				href="/dashboard" 
				class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
			>
				← {backToDashboard}
			</a>
		</div>
	</div>
</div>