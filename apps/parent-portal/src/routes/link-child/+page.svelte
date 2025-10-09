<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { 
		AuthPageContainer, 
		AuthHeader, 
		AuthForm, 
		AuthInput, 
		AuthButton, 
		AuthError, 
		AuthSuccess, 
		LocaleSwitcher,
		QRScanner 
	} from '@educational-app/ui';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let studentUuid = $state('');
	let loading = $state(false);
	let useQRScanner = $state(false);
	let qrScannerActive = $state(false);

	// Make translations reactive
	const pageTitle = $derived($t('parent.link_child.title'));
	const pageSubtitle = $derived($t('parent.link_child.subtitle'));
	const studentUuidLabel = $derived($t('parent.link_child.student_uuid_label'));
	const studentUuidPlaceholder = $derived($t('parent.link_child.student_uuid_placeholder'));
	const submitText = $derived($t('parent.link_child.submit'));
	const submittingText = $derived($t('parent.link_child.submitting'));
	const backToDashboard = $derived($t('parent.link_child.back_to_dashboard'));
	const successTitle = $derived($t('parent.link_child.success_title'));

	// QR Scanner handlers
	function handleQRScan(event: CustomEvent<{ data: string }>) {
		const scannedData = event.detail.data;
		// Validate that it's a valid 8-character UUID format
		if (/^[A-Za-z0-9]{8}$/.test(scannedData)) {
			studentUuid = scannedData.toUpperCase();
			qrScannerActive = false;
			useQRScanner = false;
		}
	}

	function handleQRError(event: CustomEvent<{ error: Error | string }>) {
		console.error('QR Scanner Error:', event.detail.error);
	}

	function startQRScanning() {
		useQRScanner = true;
		qrScannerActive = true;
	}

	function stopQRScanning() {
		qrScannerActive = false;
		useQRScanner = false;
	}
</script>

<svelte:head>
	<title>{pageTitle} - Lexi</title>
</svelte:head>

<AuthPageContainer>
	<LocaleSwitcher variant="buttons" size="sm" />

	<AuthHeader 
		title={pageTitle}
		subtitle={pageSubtitle}
	/>

	{#if form?.success}
		<AuthSuccess 
			title={successTitle}
			message={$t('parent.link_child.success_message')}
		>
			{#snippet actions()}
				<div class="flex gap-4 justify-center">
					<a 
						href="/dashboard" 
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
					>
						{backToDashboard}
					</a>
					<a 
						href="/link-child" 
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					>
						{$t('parent.link_child.link_another')}
					</a>
				</div>
			{/snippet}
		</AuthSuccess>
		
		{#if form.linkedChild}
			<div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
				<h4 class="font-medium text-green-900 mb-2">
					{$t('parent.link_child.linked_child_info')}
				</h4>
				<div class="text-sm text-green-800">
					<p><strong>{$t('common.name')}:</strong> {form.linkedChild.name || `Student ${form.linkedChild.uuid.slice(0, 8)}`}</p>
					<p><strong>{$t('parent.dashboard.grade')}:</strong> {form.linkedChild.grade}</p>
					<p><strong>UUID:</strong> {form.linkedChild.uuid}</p>
				</div>
			</div>
		{/if}
	{:else}
		<AuthForm 
			onSubmit={(isLoading) => loading = isLoading}
			onResult={async ({ result, update }) => {
				await update();
			}}
		>
			{#if form?.error}
				<AuthError message={form.error}>
					{#if form?.alreadyLinked}
						<a 
							href="/dashboard" 
							class="font-medium text-red-700 hover:text-red-800 underline"
						>
							{backToDashboard}
						</a>
					{/if}
				</AuthError>
			{/if}

			<!-- Method Selection -->
			<div class="mb-6">
				<div class="flex gap-4 justify-center mb-4">
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium rounded-md {!useQRScanner ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						onclick={() => { useQRScanner = false; qrScannerActive = false; }}
						disabled={loading}
					>
						Manual Entry
					</button>
					<button
						type="button"
						class="px-4 py-2 text-sm font-medium rounded-md {useQRScanner ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						onclick={startQRScanning}
						disabled={loading}
					>
						Scan QR Code
					</button>
				</div>
			</div>

			{#if useQRScanner}
				<!-- QR Scanner -->
				<div class="mb-6">
					<div class="text-center mb-4">
						<h3 class="text-lg font-medium text-gray-900 mb-2">Scan Student QR Code</h3>
						<p class="text-sm text-gray-600">Position the QR code within the camera frame</p>
					</div>
					
					<div class="flex justify-center mb-4">
						<QRScanner
							active={qrScannerActive}
							width={300}
							height={300}
							facingMode="environment"
							showFrame={true}
							onscan={handleQRScan}
							onerror={handleQRError}
							onready={() => console.log('QR Scanner ready')}
						/>
					</div>

					<div class="text-center">
						<button
							type="button"
							class="text-sm text-gray-600 hover:text-gray-500 underline"
							onclick={stopQRScanning}
						>
							Cancel and enter code manually
						</button>
					</div>
				</div>
			{:else}
				<!-- Instructions -->
				<div class="p-4 bg-blue-50 rounded-md mb-6">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-blue-800">
								{$t('parent.link_child.how_to_find_code')}
							</h3>
							<div class="mt-2 text-sm text-blue-700">
								<ul class="list-disc list-inside space-y-1">
									<li>{$t('parent.link_child.code_instruction_1')}</li>
									<li>{$t('parent.link_child.code_instruction_2')}</li>
									<li>{$t('parent.link_child.code_instruction_3')}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if !useQRScanner}
				<AuthInput
					id="studentUuid"
					name="studentUuid"
					type="text"
					label={studentUuidLabel}
					placeholder={studentUuidPlaceholder}
					bind:value={studentUuid}
					required
					disabled={loading}
					maxlength="8"
					pattern="[A-Za-z0-9]{8}"
					class="uppercase"
				/>
			{/if}

			<AuthButton 
				{loading}
				loadingText={submittingText}
			>
				{submitText}
			</AuthButton>

			<div class="text-center">
				<a 
					href="/dashboard" 
					class="text-sm text-green-600 hover:text-green-500"
				>
					← {backToDashboard}
				</a>
			</div>
		</AuthForm>
	{/if}
</AuthPageContainer>