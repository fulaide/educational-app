<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { Card, LocaleSwitcher, getNotificationContext } from '@educational-app/ui';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	
	// Get notification manager
	const notifications = getNotificationContext();

	// Reactive translations
	const pageTitle = $derived($t('parent.child.manage_title'));
	const backText = $derived($t('common.back'));
	const studentInfoTitle = $derived($t('parent.child.student_info'));
	const nameLabel = $derived($t('common.name'));
	const gradeLabel = $derived($t('parent.dashboard.grade'));
	const statusLabel = $derived($t('parent.dashboard.status'));
	const linkedAtLabel = $derived($t('parent.child.linked_at'));
	const lastLoginLabel = $derived($t('parent.child.last_login'));
	const organizationLabel = $derived($t('parent.child.organization'));
	const actionsTitle = $derived($t('parent.child.actions'));
	const viewProgressText = $derived($t('parent.dashboard.view_progress'));
	const unlinkChildText = $derived($t('parent.child.unlink_child'));
	const activeText = $derived($t('parent.dashboard.active'));
	const inactiveText = $derived($t('parent.dashboard.inactive'));
	const neverText = $derived($t('common.never'));
	const qrCodeTitle = $derived($t('parent.child.qr_code'));
	const studentCodeLabel = $derived($t('parent.child.student_code'));
	const scanInstructionsText = $derived($t('parent.child.scan_instructions'));
	const qrExpiresText = $derived($t('parent.child.qr_expires'));
	
	const childName = $derived(data.child.name || `Student ${data.child.uuid.slice(0, 8)}`);
	
	// Copy to clipboard function with toast feedback
	async function copyToClipboard(text: string, label: string = 'text') {
		try {
			await navigator.clipboard.writeText(text);
			notifications.success(`${label} copied to clipboard!`, {
				duration: 2000
			});
		} catch (error) {
			// Fallback for older browsers or if clipboard API fails
			try {
				const textArea = document.createElement('textarea');
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				
				notifications.success(`${label} copied to clipboard!`, {
					duration: 2000
				});
			} catch (fallbackError) {
				notifications.error(`Failed to copy ${label.toLowerCase()}`, {
					duration: 3000
				});
			}
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}: {childName} - Lexi</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
	<div class="max-w-4xl mx-auto">
		<LocaleSwitcher variant="buttons" size="sm" />

		<!-- Back Navigation -->
		<div class="mb-6">
			<a 
				href="/dashboard"
				class="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
			>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				{backText}
			</a>
		</div>

		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				{childName}
			</h1>
			<p class="text-gray-600">
				{pageTitle}
			</p>
		</div>

		<!-- Student Information -->
		<Card variant="elevated" padding="lg" class="mb-8">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">{studentInfoTitle}</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Child Avatar -->
				<div class="text-center md:text-left">
					<div class="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto md:mx-0 mb-4">
						{data.child.name ? data.child.name.charAt(0).toUpperCase() : '👦'}
					</div>
					<div class="text-center md:text-left">
						<h3 class="text-lg font-semibold text-gray-900">{childName}</h3>
						<p class="text-sm text-gray-500">UUID: {data.child.uuid}</p>
					</div>
				</div>

				<!-- Details -->
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{gradeLabel}</label>
						<p class="text-gray-900">{data.child.grade || 'Not specified'}</p>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{statusLabel}</label>
						{#if data.child.isActive}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
								{activeText}
							</span>
						{:else}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
								{inactiveText}
							</span>
						{/if}
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{linkedAtLabel}</label>
						<p class="text-gray-900">
							{new Date(data.linkInfo.linkedAt).toLocaleDateString()}
						</p>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{lastLoginLabel}</label>
						<p class="text-gray-900">
							{data.child.lastLoginAt ? new Date(data.child.lastLoginAt).toLocaleDateString() : neverText}
						</p>
					</div>

					{#if data.child.organization}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">{organizationLabel}</label>
							<p class="text-gray-900">{data.child.organization.name}</p>
						</div>
					{/if}
				</div>
			</div>
		</Card>

		<!-- QR Code Section -->
		{#if data.qrCode}
		<Card variant="elevated" padding="lg" class="mb-8">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">{qrCodeTitle}</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
				<!-- QR Code Display -->
				<div class="text-center">
					<div class="bg-white p-4 rounded-lg shadow-sm border inline-block">
						<img 
							src={data.qrCode.dataURL} 
							alt="Student QR Code for {childName}"
							class="w-48 h-48 mx-auto"
						/>
					</div>
					<p class="text-sm text-gray-500 mt-3">
						{qrExpiresText}: {data.qrCode.expires.toLocaleDateString()}
					</p>
				</div>

				<!-- QR Code Information -->
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">{studentCodeLabel}</label>
						<div class="flex items-center gap-2">
							<code class="text-lg font-mono bg-gray-100 px-3 py-2 rounded border">
								{data.qrCode.studentCode}
							</code>
							<button 
								onclick={() => copyToClipboard(data.qrCode.studentCode, 'Student code')}
								class="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
								title="Copy student code to clipboard"
								type="button"
							>
								📋 Copy
							</button>
						</div>
					</div>

					<div class="bg-blue-50 p-4 rounded-lg">
						<h4 class="font-medium text-blue-900 mb-2">📱 {scanInstructionsText}</h4>
						<ul class="text-sm text-blue-800 space-y-1">
							<li>• Other parents can scan this QR code to link this student</li>
							<li>• This code expires in 24 hours for security</li>
							<li>• The code contains: {data.qrCode.studentCode}</li>
						</ul>
					</div>
				</div>
			</div>
		</Card>
		{/if}

		<!-- Actions -->
		<Card variant="elevated" padding="lg">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">{actionsTitle}</h2>
			
			<div class="flex flex-col sm:flex-row gap-4">
				<a 
					href="/children/{data.child.id}/progress"
					class="flex-1 inline-flex items-center justify-center px-lg py-md text-lg font-medium bg-primary hover:bg-primary-dark shadow-sm rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
					{viewProgressText}
				</a>
				
				<button 
					class="flex-1 inline-flex items-center justify-center px-lg py-md text-lg font-medium border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
					onclick={() => alert('Unlink functionality coming soon!')}
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					{unlinkChildText}
				</button>
			</div>
		</Card>
	</div>
</div>