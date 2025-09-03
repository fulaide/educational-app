<script lang="ts">
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import type { PageData, ActionData } from './$types'

	export let data: PageData
	export let form: ActionData

	interface Student {
		id: string
		name: string
		uuid: string
		email?: string
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

	let classes: ClassData[] = data.classes || []
	let selectedClass = classes[0] || null
	let loading = false
	let expiresInHours = 24
	let qrSize = 256
	let showAnalytics = false

	// QR Generation options
	let generationOptions = {
		size: 256,
		expires: 24,
		includeNames: true,
		format: 'individual' as 'individual' | 'sheet'
	}

	// Analytics data from server
	let analytics = data.analytics || {
		totalGenerated: 0,
		totalScanned: 0,
		activeQRCodes: 0,
		scanSuccessRate: 0
	}

	let showQRModal = false
	let selectedQRData: { qrCode: string; studentName: string; expiresAt: string } | null = null

	// Handle form results
	$: if (form?.success) {
		if (form?.qrCode) {
			// Individual QR code generated
			selectedQRData = {
				qrCode: form.qrCode,
				studentName: form.studentName || '',
				expiresAt: form.expiresAt ? new Date(form.expiresAt).toLocaleString() : ''
			}
			showQRModal = true
		} else if (form?.format === 'sheet' && form?.html) {
			// Printable sheet generated
			const printWindow = window.open('', '_blank')
			if (printWindow) {
				printWindow.document.write(form.html)
				printWindow.document.close()
				printWindow.focus()
				printWindow.print()
			}
		}
	}

	async function generateStudentQR(student: Student) {
		loading = true
		try {
			// Mock API call - replace with actual tRPC call
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// Mock QR generation
			const qrData = {
				uuid: student.uuid,
				studentName: student.name,
				expires: Date.now() + (expiresInHours * 60 * 60 * 1000)
			}
			
			// Generate mock QR code data URL
			student.qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`
			student.qrExpiry = new Date(qrData.expires)
			
			// Trigger reactivity
			classes = [...classes]
		} catch (error) {
			console.error('Failed to generate QR code:', error)
		} finally {
			loading = false
		}
	}

	async function generateClassQRs() {
		loading = true
		try {
			// Mock API call
			await new Promise(resolve => setTimeout(resolve, 2000))
			
			// Generate QR codes for all students in selected class
			for (const student of selectedClass.students) {
				const qrData = {
					uuid: student.uuid,
					studentName: student.name,
					expires: Date.now() + (generationOptions.expires * 60 * 60 * 1000)
				}
				
				student.qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`
				student.qrExpiry = new Date(qrData.expires)
			}
			
			classes = [...classes]
		} catch (error) {
			console.error('Failed to generate class QR codes:', error)
		} finally {
			loading = false
		}
	}

	async function generatePrintableSheet() {
		loading = true
		try {
			// Mock generating printable sheet
			await new Promise(resolve => setTimeout(resolve, 1500))
			
			// Create printable HTML content
			const printContent = createPrintableContent()
			
			// Open print window
			const printWindow = window.open('', '_blank')
			if (printWindow) {
				printWindow.document.write(printContent)
				printWindow.document.close()
				printWindow.focus()
				printWindow.print()
			}
		} catch (error) {
			console.error('Failed to generate printable sheet:', error)
		} finally {
			loading = false
		}
	}

	function createPrintableContent(): string {
		return `
<!DOCTYPE html>
<html>
<head>
	<title>QR Codes - ${selectedClass.name}</title>
	<style>
		@page { size: A4; margin: 1cm; }
		body { font-family: Arial, sans-serif; }
		.header { text-align: center; margin-bottom: 20px; }
		.qr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
		.qr-item { border: 2px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
		.student-name { font-weight: bold; margin-bottom: 10px; }
		.qr-placeholder { width: 150px; height: 150px; background: #f0f0f0; margin: 10px auto; display: flex; align-items: center; justify-content: center; }
	</style>
</head>
<body>
	<div class="header">
		<h1>Student Login QR Codes</h1>
		<h2>${selectedClass.name}</h2>
		<p>Generated on ${new Date().toLocaleDateString()}</p>
	</div>
	<div class="qr-grid">
		${selectedClass.students.map(student => `
			<div class="qr-item">
				<div class="student-name">${student.name}</div>
				<div class="qr-placeholder">QR Code</div>
				<div style="font-size: 12px; color: #666;">
					Student ID: ${student.uuid.substring(0, 8)}...<br>
					Expires: ${new Date(Date.now() + generationOptions.expires * 60 * 60 * 1000).toLocaleDateString()}
				</div>
			</div>
		`).join('')}
	</div>
	<div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
		Educational App Platform - QR Authentication System
	</div>
</body>
</html>
		`
	}

	function refreshQR(student: Student) {
		generateStudentQR(student)
	}

	function isQRExpired(expiry?: Date): boolean {
		return expiry ? Date.now() > expiry.getTime() : false
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
	<title>QR Codes - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="py-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-gray-900">QR Code Management</h1>
						<p class="text-gray-600">Generate and manage student authentication QR codes</p>
					</div>
					<div class="flex space-x-3">
						<button
							on:click={() => showAnalytics = !showAnalytics}
							class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
						>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
							</svg>
							{showAnalytics ? 'Hide' : 'Show'} Analytics
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
		<!-- Analytics Panel -->
		{#if showAnalytics}
			<div class="bg-white rounded-lg shadow mb-6 p-6">
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
			</div>
		{/if}

		<!-- Class Selection and Bulk Actions -->
		<div class="bg-white rounded-lg shadow mb-6 p-6">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
				<div>
					<label for="class-select" class="block text-sm font-medium text-gray-700 mb-2">
						Select Class
					</label>
					<select
						id="class-select"
						bind:value={selectedClass}
						class="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					>
						{#each classes as cls}
							<option value={cls}>{cls.name} ({cls.students.length} students)</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
					<!-- Generation Options -->
					<div class="flex items-center space-x-2">
						<label class="text-sm text-gray-700">Expires:</label>
						<select
							bind:value={generationOptions.expires}
							class="px-2 py-1 border border-gray-300 rounded text-sm"
						>
							<option value={1}>1 hour</option>
							<option value={4}>4 hours</option>
							<option value={8}>8 hours</option>
							<option value={24}>24 hours</option>
							<option value={72}>3 days</option>
							<option value={168}>1 week</option>
						</select>
					</div>

					<form method="POST" action="?/generateClassQR" use:enhance>
						{#if selectedClass}
							<input type="hidden" name="classId" value={selectedClass.id} />
							<input type="hidden" name="format" value="individual" />
							<input type="hidden" name="expiresInHours" value={generationOptions.expires} />
							<input type="hidden" name="size" value={generationOptions.size} />
							<button
								type="submit"
								disabled={loading || !selectedClass}
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
							>
								{#if loading}
									<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								{/if}
								Generate All QR Codes
							</button>
						{/if}
					</form>

					<form method="POST" action="?/generateClassQR" use:enhance>
						{#if selectedClass}
							<input type="hidden" name="classId" value={selectedClass.id} />
							<input type="hidden" name="format" value="sheet" />
							<input type="hidden" name="expiresInHours" value={generationOptions.expires} />
							<input type="hidden" name="size" value="200" />
							<button
								type="submit"
								disabled={loading || !selectedClass}
								class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
							>
								<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
								</svg>
								Print Sheet
							</button>
						{/if}
					</form>
				</div>
			</div>
		</div>

		<!-- Students QR Codes Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each selectedClass.students as student (student.id)}
				<div class="bg-white rounded-lg shadow p-6">
					<div class="flex items-center justify-between mb-4">
						<div>
							<h3 class="text-lg font-semibold text-gray-900">{student.name}</h3>
							<p class="text-sm text-gray-600">ID: {student.uuid.substring(0, 8)}...</p>
						</div>
						<div class="flex space-x-2">
							<form method="POST" action="?/generateStudentQR" use:enhance>
								<input type="hidden" name="studentId" value={student.id} />
								<input type="hidden" name="expiresInHours" value={generationOptions.expires} />
								<input type="hidden" name="size" value={generationOptions.size} />
								<button
									type="submit"
									disabled={loading}
									class="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md"
									title="Generate QR Code"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
									</svg>
								</button>
							</form>
							{#if student.qrCode}
								<button
									on:click={() => refreshQR(student)}
									disabled={loading}
									class="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md"
									title="Refresh QR Code"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
									</svg>
								</button>
							{/if}
						</div>
					</div>

					{#if student.qrCode}
						<div class="text-center">
							<!-- QR Code Display -->
							<div class="w-48 h-48 mx-auto mb-4 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
								<!-- This will be replaced with actual QR code image -->
								<div class="text-gray-500 text-center">
									<svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h.01M12 12v4m6-4v4"/>
									</svg>
									<div class="text-sm">QR Code</div>
								</div>
							</div>

							<!-- Status -->
							<div class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isQRExpired(student.qrExpiry) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
								{isQRExpired(student.qrExpiry) ? 'Expired' : 'Active'}
							</div>

							{#if student.qrExpiry}
								<p class="text-sm text-gray-600 mt-2">
									{isQRExpired(student.qrExpiry) ? 'Expired' : `Expires in ${formatTimeRemaining(student.qrExpiry)}`}
								</p>
							{/if}

							{#if student.lastScanned}
								<p class="text-xs text-gray-500 mt-1">
									Last used: {student.lastScanned.toLocaleDateString()}
								</p>
							{/if}
						</div>
					{:else}
						<div class="text-center py-8">
							<svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h.01M12 12v4m6-4v4"/>
							</svg>
							<p class="text-gray-600 text-sm">No QR code generated</p>
							<button
								on:click={() => generateStudentQR(student)}
								disabled={loading}
								class="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50"
							>
								Generate QR Code
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Help Section -->
		<div class="mt-8 bg-blue-50 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-900 mb-3">How to Use QR Codes</h3>
			<div class="text-blue-800 space-y-2">
				<p class="flex items-start">
					<span class="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold flex items-center justify-center mr-3 mt-0.5">1</span>
					Generate QR codes for individual students or entire classes
				</p>
				<p class="flex items-start">
					<span class="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold flex items-center justify-center mr-3 mt-0.5">2</span>
					Print QR codes or display them on screen for students to scan
				</p>
				<p class="flex items-start">
					<span class="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold flex items-center justify-center mr-3 mt-0.5">3</span>
					Students scan QR codes with their mobile app to log in securely
				</p>
				<p class="flex items-start">
					<span class="inline-block w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold flex items-center justify-center mr-3 mt-0.5">4</span>
					QR codes expire automatically for security (default: 24 hours)
				</p>
			</div>
		</div>

		<!-- QR Code Modal -->
		{#if showQRModal && selectedQRData}
			<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
				<div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
					<div class="mt-3">
						<div class="flex items-center justify-between mb-4">
							<h3 class="text-lg font-semibold text-gray-900">QR Code Generated</h3>
							<button
								on:click={() => showQRModal = false}
								class="text-gray-400 hover:text-gray-600"
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</button>
						</div>
						
						<div class="text-center">
							<h4 class="text-md font-medium text-gray-900 mb-3">{selectedQRData.studentName}</h4>
							
							<!-- QR Code Display -->
							<div class="mb-4">
								<img src={selectedQRData.qrCode} alt="QR Code" class="mx-auto border rounded-lg" />
							</div>
							
							<p class="text-sm text-gray-600 mb-4">
								Expires: {selectedQRData.expiresAt}
							</p>
							
							<div class="flex space-x-3">
								<button
									on:click={() => {
										// Copy QR data URL to clipboard
										navigator.clipboard.writeText(selectedQRData.qrCode)
									}}
									class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
								>
									Copy QR Code
								</button>
								<button
									on:click={() => {
										// Print QR code
										const printWindow = window.open('', '_blank')
										if (printWindow) {
											printWindow.document.write(`
												<!DOCTYPE html>
												<html>
												<head><title>QR Code - ${selectedQRData.studentName}</title></head>
												<body style="text-align: center; font-family: Arial;">
													<h2>${selectedQRData.studentName}</h2>
													<img src="${selectedQRData.qrCode}" />
													<p>Expires: ${selectedQRData.expiresAt}</p>
												</body>
												</html>
											`)
											printWindow.document.close()
											printWindow.print()
										}
									}}
									class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
								>
									Print
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>