<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, Card, Drawer, QRCode, useNotifications } from '@educational-app/ui';
	import { BarChart3, Copy, Plus, Printer, QrCode as QrCodeIcon, RefreshCw } from 'lucide-svelte';
// Layout is now provided by parent authenticated layout
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	const notifications = useNotifications();

	interface Student {
		id: string
		name: string
		uuid: string
		email?: string
		studentQRCodes?: Array<{
			token: string
			expiresAt: Date
			createdAt: Date
		}>
		qrCode?: string
		qrExpiry?: Date
		lastScanned?: Date
	}

	interface ClassData {
		id: string
		name: string
		students: Student[]
		organization: {
			id: string
			name: string
		}
	}

	// Use $derived for reactive data access (maintains reactivity with server data)
	const classes = $derived(data.classes || [])
	let selectedClassId = $state<string | null>(null)
	let loading = $state(false)
	let showAnalytics = $state(false)

	// Compute selectedClass reactively based on selectedClassId
	const selectedClass = $derived(
		selectedClassId
			? classes.find(c => c.id === selectedClassId) || null
			: classes.length > 0 ? classes[0] : null
	)

	// Debug: Log when selectedClass changes
	$effect(() => {
		console.log('[QR-CODES] Effect running, selectedClass:', selectedClass?.name || 'null', 'selectedClassId:', selectedClassId);
		if (selectedClass) {
			console.log('[QR-CODES] Selected class:', selectedClass.name, '- Students:', selectedClass.students.length);
			selectedClass.students.forEach(student => {
				console.log(`[QR-CODES] Student "${student.name}":`, {
					hasQRCodes: !!student.studentQRCodes,
					qrCodesLength: student.studentQRCodes?.length || 0,
					qrCodeData: student.studentQRCodes?.[0]
				});
			});
		} else {
			console.log('[QR-CODES] No class selected yet');
		}
	})

	// Initialize selectedClassId when classes load
	$effect(() => {
		if (classes.length > 0 && !selectedClassId) {
			selectedClassId = classes[0].id;
		}
	})

	// QR Generation options
	let generationOptions = $state({
		size: 256,
		expires: 10 * 365 * 24, // No expiry by default (10 years)
		includeNames: true,
		format: 'individual' as 'individual' | 'sheet'
	})

	// Analytics data from server
	let analytics = {
		totalGenerated: data.analytics?.totalGenerated || 0,
		totalScanned: data.analytics?.totalScanned || 0,
		activeQRCodes: data.analytics?.activeQRCodes || 0,
		scanSuccessRate: 0
	}

	let showQRDrawer = $state(false)
	let selectedQRData = $state<{ qrCode: string; studentName: string; expiresAt: string } | null>(null)

	// Note: Form result handling moved to enhance callbacks to prevent infinite loops

	function refreshQR(_student: Student) {
		// This will be handled by the form submission
		notifications.info('Refreshing QR code...');
	}

	function isQRExpired(expiry?: Date | string): boolean {
		if (!expiry) return false;

		try {
			const expiryTime = expiry instanceof Date ? expiry.getTime() : new Date(expiry).getTime();
			const isExpired = Date.now() > expiryTime;
			console.log('[QR-CODES] isQRExpired check:', { expiry, expiryTime, now: Date.now(), isExpired });
			return isExpired;
		} catch (error) {
			console.error('[QR-CODES] Error checking expiry:', error, expiry);
			return false;
		}
	}

	function formatTimeRemaining(expiry?: Date): string {
		if (!expiry) return 'No expiry'
		
		const now = Date.now()
		const remaining = expiry.getTime() - now
		
		if (remaining <= 0) return 'Expired'
		
		const hours = Math.floor(remaining / (1000 * 60 * 60))
		const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
		
		if (hours > 0) {
			return `${hours}h ${minutes}m`
		}
		return `${minutes}m`
	}
</script>

<svelte:head>
	<title>QR Codes</title>
</svelte:head>

<!-- Content is now wrapped by the parent authenticated layout -->
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">QR Code Management</h1>
				<p class="mt-1 text-sm text-gray-500">Generate and manage student authentication QR codes</p>
			</div>
			<Button
				variant="outline"
				onclick={() => showAnalytics = !showAnalytics}
			>
				<BarChart3 class="w-4 h-4 mr-2" />
				{showAnalytics ? 'Hide' : 'Show'} Analytics
			</Button>
		</div>
	</div>
	<!-- Analytics Panel -->
	{#if showAnalytics}
		<Card class="mb-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">QR Code Analytics</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="text-center">
					<div class="text-2xl font-bold text-blue-600">{analytics.totalGenerated}</div>
					<div class="text-sm text-gray-600">Total Generated</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-green-600">{analytics.totalScanned}</div>
					<div class="text-sm text-gray-600">Total Scanned</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-orange-600">{analytics.activeQRCodes}</div>
					<div class="text-sm text-gray-600">Active QR Codes</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-purple-600">{analytics.scanSuccessRate}%</div>
					<div class="text-sm text-gray-600">Success Rate</div>
				</div>
			</div>
		</Card>
	{/if}

	<!-- Class Selection and Bulk Actions -->
	<Card class="mb-6">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
				<div>
					<label for="class-select" class="block text-sm font-medium text-gray-700 mb-2">
						Select Class
					</label>
					<select
						id="class-select"
						bind:value={selectedClassId}
						class="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						{#each classes as cls}
							<option value={cls.id}>{cls.name} ({cls.students.length} students)</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
					<!-- Generation Options -->
					<div class="flex items-center space-x-2">
						<label for="expiry-select" class="text-sm text-gray-700">Expires:</label>
						<select
							id="expiry-select"
							bind:value={generationOptions.expires}
							class="px-2 py-1 border border-gray-300 rounded text-sm"
						>
							<option value={10 * 365 * 24}>No expiry</option>
							<option value={24}>24 hours</option>
							<option value={72}>3 days</option>
							<option value={168}>1 week</option>
							<option value={30 * 24}>1 month</option>
							<option value={90 * 24}>3 months</option>
						</select>
					</div>

				<form method="POST" action="?/generateClassQR" use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						loading = false;
						await update();
						if (result.type === 'success' && result.data) {
							const data = result.data as any;
							notifications.success(data.message || 'QR codes generated for all students');

							// Handle individual QR code (if generated for single student)
							if (data.qrCode && data.studentName) {
								selectedQRData = {
									qrCode: data.qrCode,
									studentName: data.studentName,
									expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleString() : ''
								};
								showQRDrawer = true;
							}

							await invalidateAll();
						} else if (result.type === 'failure' && result.data) {
							const data = result.data as any;
							notifications.error(data.error || 'Failed to generate QR codes');
						}
					};
				}}>
					{#if selectedClass}
						<input type="hidden" name="classId" value={selectedClass.id} />
						<input type="hidden" name="format" value="individual" />
						<input type="hidden" name="expiresInHours" value={generationOptions.expires} />
						<input type="hidden" name="size" value={generationOptions.size} />
						<Button
					type="submit"
								variant="solid"
								color="primary"
								disabled={loading || !selectedClass}
								loading={loading}
						>
							Generate All QR Codes
						</Button>
					{/if}
				</form>

				<form method="POST" action="?/generateClassQR" use:enhance={() => {
					loading = true;
					return async ({ result, update }) => {
						loading = false;
						await update();
						if (result.type === 'success' && result.data) {
							const data = result.data as any;
							notifications.success(data.message || 'Print sheet generated');

							// Handle print sheet
							if (data.format === 'sheet' && data.html) {
								const printWindow = window.open('', '_blank');
								if (printWindow) {
									printWindow.document.write(data.html);
									printWindow.document.close();
									printWindow.focus();
									printWindow.print();
								}
							}

							await invalidateAll();
						} else if (result.type === 'failure' && result.data) {
							const data = result.data as any;
							notifications.error(data.error || 'Failed to generate print sheet');
						}
					};
				}}>
					{#if selectedClass}
						<input type="hidden" name="classId" value={selectedClass.id} />
						<input type="hidden" name="format" value="sheet" />
						<input type="hidden" name="expiresInHours" value={generationOptions.expires} />
						<input type="hidden" name="size" value="200" />
						<Button
							type="submit"
							variant="outline"
							disabled={loading || !selectedClass}
							loading={loading}
						>
							<Printer class="w-4 h-4 mr-2" />
							Print Sheet
						</Button>
					{/if}
				</form>
			</div>
		</div>
	</Card>

	<!-- Students QR Codes Grid -->
	{#if selectedClass}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each selectedClass.students as student (student.id)}
			<Card>
				<div class="flex items-center justify-between mb-4">
					<div>
						<h3 class="text-lg font-semibold text-gray-900">{student.name}</h3>
						<p class="text-sm text-gray-600">Login codes shown below</p>
					</div>
					<div class="flex space-x-2">
						<form method="POST" action="?/generateStudentQR" use:enhance={() => {
							loading = true;
							return async ({ result, update }) => {
								loading = false;
								await update();
								if (result.type === 'success' && result.data) {
									const data = result.data as any;
									notifications.success(data.message || 'QR code generated');

									// Handle individual QR code drawer
									if (data.qrCode && data.studentName) {
										selectedQRData = {
											qrCode: data.qrCode,
											studentName: data.studentName,
											expiresAt: data.expiresAt ? new Date(data.expiresAt).toLocaleString() : ''
										};
										showQRDrawer = true;
									}

									await invalidateAll();
								} else if (result.type === 'failure' && result.data) {
									const data = result.data as any;
									notifications.error(data.error || 'Failed to generate QR code');
								}
							};
						}}>
							<input type="hidden" name="studentId" value={student.id} />
							<input type="hidden" name="expiresInHours" value={generationOptions.expires} />
							<input type="hidden" name="size" value={generationOptions.size} />
							<Button
								type="submit"
								variant="ghost"
								size="sm"
								disabled={loading}
								aria-label="Generate QR Code for {student.name}"
							>
								<Plus class="w-5 h-5" />
							</Button>
						</form>
						{#if student.studentQRCodes && student.studentQRCodes.length > 0}
							<Button
								variant="ghost"
								size="sm"
								onclick={() => refreshQR(student)}
								disabled={loading}
								aria-label="Refresh QR Code for {student.name}"
							>
								<RefreshCw class="w-5 h-5" />
							</Button>
						{/if}
					</div>
				</div>

					{#if student.studentQRCodes && student.studentQRCodes.length > 0}
						{@const qrCode = student.studentQRCodes[0]}
						<div class="text-center flex flex-col justify-items-center">
							<!-- QR Code Display -->
							<div class="mx-auto mb-4">
								<QRCode
									data={qrCode.token}
									size={180}
									showActions={false}
								/>
							</div>

							<!-- Status Badge -->
							<div class={`inline-flex place-self-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${isQRExpired(qrCode.expiresAt) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
								{isQRExpired(qrCode.expiresAt) ? 'Expired' : 'Active'}
							</div>

							<!-- QR Token with Copy Button -->
							<div class="mt-3 space-y-2">
								<div class="p-2 bg-gray-50 rounded-md">
									<label class="text-xs font-medium text-gray-700 block mb-1">QR Code Token:</label>
									<div class="flex items-center justify-between gap-2">
										<code class="text-xs text-gray-600 font-mono truncate flex-1">
											{qrCode.token.slice(0, 12)}...{qrCode.token.slice(-12)}
										</code>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => {
												navigator.clipboard.writeText(qrCode.token);
												notifications.success('QR token copied to clipboard');
											}}
											class="flex-shrink-0 p-1.5"
										>
											<Copy class="w-4 h-4" />
										</Button>
									</div>
								</div>

								<!-- Student UUID (alternative login code) -->
								<div class="p-2 bg-blue-50 rounded-md">
									<label class="text-xs font-medium text-blue-700 block mb-1">Student ID (manual login):</label>
									<div class="flex items-center justify-between gap-2">
										<code class="text-xs text-blue-600 font-mono truncate flex-1">
											{student.uuid}
										</code>
										<Button
											variant="ghost"
											size="sm"
											onclick={() => {
												navigator.clipboard.writeText(student.uuid);
												notifications.success('Student ID copied to clipboard');
											}}
											class="flex-shrink-0 p-1.5"
										>
											<Copy class="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>

							<p class="text-sm text-gray-600 mt-2">
								{#if new Date(qrCode.expiresAt).getFullYear() > new Date().getFullYear() + 5}
									No expiry
								{:else if isQRExpired(qrCode.expiresAt)}
									Expired
								{:else}
									Expires in {formatTimeRemaining(qrCode.expiresAt)}
								{/if}
							</p>

							<p class="text-xs text-gray-500 mt-1">
								Created: {new Date(qrCode.createdAt).toLocaleDateString()}
							</p>
						</div>
					{:else}
				<div class="text-center py-8">
					<QrCodeIcon class="w-12 h-12 mx-auto text-gray-300 mb-4" />
					<p class="text-gray-600 text-sm">No active QR code</p>
					<p class="text-xs text-gray-500 mt-2">Refresh the page or click the + button to generate</p>
				</div>
			{/if}
		</Card>
			{/each}
		</div>
	{/if}

	<!-- Help Section -->
	<Card class="mt-8 bg-neutral-50">
		<h3 class="text-lg font-semibold text-neutral-900 mb-3">How to Use QR Codes</h3>
		<div class="text-neutral-800 space-y-2">
			<p class="flex items-start">
				<span class="flex w-6 h-6 bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold items-center justify-center mr-3 mt-0.5">1</span>
				QR codes are automatically generated for all students (no expiry by default)
			</p>
			<p class="flex items-start">
				<span class="flex w-6 h-6 bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold  items-center justify-center mr-3 mt-0.5">2</span>
				Students can scan QR codes or manually enter the "Student ID" code shown below each QR
			</p>
			<p class="flex items-start">
				<span class="flex w-6 h-6 bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold  items-center justify-center mr-3 mt-0.5">3</span>
				Print QR codes or display them on screen for students to scan with the mobile app
			</p>
			<p class="flex items-start">
				<span class="flex w-6 h-6 bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold  items-center justify-center mr-3 mt-0.5">4</span>
				Click the + button to regenerate a student's QR code if needed
			</p>
		</div>
	</Card>

	<!-- QR Code Drawer -->
<Drawer
	bind:open={showQRDrawer}
	title="QR Code Generated"
	position="right"
	size="md"
	padding="lg"
>
	{#snippet children()}
		{#if selectedQRData}
		<div class="text-center">
			<h4 class="text-lg font-semibold text-gray-900 mb-6">{selectedQRData.studentName}</h4>

			<!-- QR Code Display -->
			<div class="mb-6 p-6 bg-white border-2 border-gray-200 rounded-lg inline-block">
				<QRCode
					data={selectedQRData.qrCode}
					size={250}
					showActions={false}
					class="mx-auto"
				/>
			</div>

			<p class="text-sm text-gray-600 mb-4">
				<span class="font-medium">Expires:</span> {selectedQRData.expiresAt}
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
						navigator.clipboard.writeText(selectedQRData.qrCode);
						notifications.success('QR code copied to clipboard');
					}
				}}
			>
				Copy QR Code
			</Button>
			<Button
				variant="solid"
				color="primary"
				class="flex-1"
				onclick={() => {
					if (selectedQRData) {
						const printWindow = window.open('', '_blank')
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
										<img src="${selectedQRData.qrCode}" width="300" height="300" />
									</div>
									<p>Expires: ${selectedQRData.expiresAt}</p>
								</body>
								</html>
							`)
							printWindow.document.close()
							printWindow.print()
						}
					}
				}}
			>
				Print QR Code
			</Button>
		</div>
		{/if}
	{/snippet}
</Drawer>