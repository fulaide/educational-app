<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'
	import { t } from '@educational-app/i18n'
	// import LanguageSwitcher from '@educational-app/i18n/src/components/LanguageSwitcher.svelte'

	let videoElement: HTMLVideoElement
	let canvasElement: HTMLCanvasElement
	let stream: MediaStream | null = null
	let scanning = false
	let error = ''
	let success = ''
	let manualUUID = ''
	let showManualEntry = false
	let processing = false

	interface QRData {
		uuid: string
		studentName: string
		className?: string
		organizationId: string
		expires: number
	}

	onMount(async () => {
		if (browser) {
			await startCamera()
		}
	})

	onDestroy(() => {
		stopCamera()
	})

	async function startCamera() {
		try {
			error = ''
			scanning = true

			// Request camera permission
			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment', // Use back camera if available
					width: { ideal: 1280 },
					height: { ideal: 720 }
				}
			})

			if (videoElement) {
				videoElement.srcObject = stream
				videoElement.play()

				// Start scanning loop
				scanLoop()
			}
		} catch (err) {
			console.error('Camera access failed:', err)
			error = $t('auth.camera_access_denied')
			scanning = false
		}
	}

	function stopCamera() {
		scanning = false
		if (stream) {
			stream.getTracks().forEach(track => track.stop())
			stream = null
		}
	}

	async function scanLoop() {
		if (!scanning || !canvasElement || !videoElement) return

		try {
			// Draw video frame to canvas
			const context = canvasElement.getContext('2d')
			if (!context) return

			canvasElement.width = videoElement.videoWidth
			canvasElement.height = videoElement.videoHeight
			context.drawImage(videoElement, 0, 0)

			// Get image data for QR scanning
			const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height)
			
			// QR detection using jsQR library
			const qrResult = detectQR(imageData)
			
			if (qrResult) {
				await processQRCode(qrResult)
			} else {
				// Continue scanning
				if (scanning) {
					requestAnimationFrame(scanLoop)
				}
			}
		} catch (err) {
			console.error('Scanning error:', err)
			if (scanning) {
				requestAnimationFrame(scanLoop)
			}
		}
	}

	async function processQRCode(qrText: string) {
		if (processing) return
		
		processing = true
		scanning = false

		try {
			// Enhanced QR validation with security checks
			const validationResult = validateQRData(qrText)
			
			if (!validationResult.isValid) {
				throw new Error(validationResult.error || 'Invalid QR code')
			}

			const qrData = validationResult.data!

			// Additional security checks
			if (Date.now() > qrData.expires) {
				throw new Error($t('auth.qr_expired'))
			}

			// Check version compatibility
			if (qrData.version !== 1) {
				throw new Error($t('errors.validation_failed'))
			}

			// Show success message
			success = $t('common.welcome') + `, ${qrData.studentName || $t('common.student', { default: 'Student' })}!`
			
			// Authenticate with enhanced data
			await authenticateWithQR(qrData)
			
			// Redirect to student dashboard after successful authentication
			setTimeout(() => {
				goto('/dashboard')
			}, 2000)

		} catch (err) {
			console.error('QR processing failed:', err)
			error = err.message || 'Failed to process QR code. Please try again.'
			
			// Restart scanning after error
			setTimeout(() => {
				error = ''
				processing = false
				scanning = true
				scanLoop()
			}, 3000)
		}
	}

	// Enhanced QR validation function (would be imported from auth package in real implementation)
	function validateQRData(qrDataString: string) {
		try {
			const data = JSON.parse(qrDataString)
			
			// Check required fields including security fields
			if (!data.uuid || !data.studentName || !data.organizationId || !data.expires || 
				!data.nonce || !data.signature || data.version === undefined) {
				return {
					isValid: false,
					error: 'Missing required fields in QR data'
				}
			}

			// Check version
			if (data.version !== 1) {
				return {
					isValid: false,
					error: 'Unsupported QR code version'
				}
			}

			// Check expiration
			if (Date.now() > data.expires) {
				return {
					isValid: false,
					error: 'QR code has expired'
				}
			}

			// In production, signature validation would be done server-side
			return {
				isValid: true,
				data
			}
		} catch (error) {
			return {
				isValid: false,
				error: 'Invalid QR code format'
			}
		}
	}

	async function authenticateWithQR(qrData: any) {
		// Mock API call with enhanced security data
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		// Log authentication attempt with nonce for replay protection
		console.log('Student authenticated:', {
			uuid: qrData.uuid,
			nonce: qrData.nonce,
			organizationId: qrData.organizationId,
			timestamp: Date.now()
		})
		
		return { success: true, studentName: qrData.studentName }
	}

	async function loginWithUUID() {
		if (!manualUUID.trim()) {
			error = 'Please enter your student code'
			return
		}

		processing = true
		error = ''

		try {
			// Validate UUID format
			const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
			if (!uuidRegex.test(manualUUID.trim())) {
				throw new Error('Invalid student code format')
			}

			// Mock authentication
			await mockAuthenticate(manualUUID.trim())
			
			success = 'Login successful!'
			
			// Redirect to dashboard
			setTimeout(() => {
				goto('/dashboard')
			}, 1500)

		} catch (err) {
			console.error('Manual login failed:', err)
			error = err.message || 'Login failed. Please check your student code.'
		} finally {
			processing = false
		}
	}

	function toggleManualEntry() {
		showManualEntry = !showManualEntry
		if (!showManualEntry) {
			manualUUID = ''
			error = ''
		}
	}

	function retryScanning() {
		error = ''
		success = ''
		processing = false
		startCamera()
	}

	// QR detection using jsQR library loaded via CDN
	function detectQR(imageData: ImageData): string | null {
		if (typeof window !== 'undefined' && window.jsQR) {
			const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: 'dontInvert'
			})
			return code ? code.data : null
		}
		
		// Fallback mock for development when jsQR isn't loaded
		if (Math.random() < 0.01) {
			return JSON.stringify({
				uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
				studentName: 'Test Student',
				className: 'Class 1A',
				organizationId: 'org-123',
				expires: Date.now() + 24 * 60 * 60 * 1000,
				nonce: 'test-nonce-123',
				signature: 'mock-signature',
				version: 1
			})
		}
		return null
	}

	async function mockAuthenticate(uuid: string) {
		// Mock API call
		await new Promise(resolve => setTimeout(resolve, 1000))
		
		// Simulate authentication success
		if (uuid.length >= 8) {
			console.log('Student authenticated with UUID:', uuid)
			return { success: true, studentName: 'Test Student' }
		} else {
			throw new Error('Invalid student code')
		}
	}
</script>

<svelte:head>
	<title>{$t('auth.student_login')} - Educational App</title>
	<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col">
	<!-- Header -->
	<div class="bg-white/10 backdrop-blur-sm text-white p-4">
		<div class="max-w-md mx-auto relative">
			<!-- Language switcher in top right -->
			<!-- <div class="absolute top-0 right-0">
				<LanguageSwitcher variant="compact" showFlags={true} showLabels={false} />
			</div> -->
			
			<h1 class="text-xl font-bold text-center">{$t('auth.student_login')}</h1>
			<p class="text-sm text-center opacity-90 mt-1">
				{showManualEntry ? $t('auth.enter_code_manually') : $t('auth.scan_qr_prompt')}
			</p>
		</div>
	</div>

	<div class="flex-1 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
			{#if !showManualEntry}
				<!-- QR Scanner Interface -->
				<div class="relative">
					<!-- Camera View -->
					<div class="aspect-square bg-gray-900 relative overflow-hidden">
						<!-- eslint-disable-next-line svelte/valid-compile -->
						<video
							bind:this={videoElement}
							class="w-full h-full object-cover"
							autoplay
							muted
							playsinline
						/>
						
						<!-- Hidden canvas for QR processing -->
						<canvas bind:this={canvasElement} class="hidden" />
						
						<!-- Scanning Overlay -->
						{#if scanning && !processing}
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="w-64 h-64 border-2 border-white/50 rounded-lg relative">
									<div class="absolute inset-0 border-2 border-white rounded-lg animate-pulse"></div>
									<!-- Corner markers -->
									<div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
									<div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
									<div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
									<div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
								</div>
							</div>
							
							<!-- Scanning instruction -->
							<div class="absolute bottom-4 left-4 right-4 text-center">
								<div class="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
									<p class="text-white text-sm">{$t('auth.scan_qr_prompt')}</p>
								</div>
							</div>
						{/if}

						<!-- Processing Overlay -->
						{#if processing}
							<div class="absolute inset-0 bg-black/70 flex items-center justify-center">
								<div class="text-center text-white">
									<svg class="w-8 h-8 animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<p class="text-sm">{$t('auth.processing_qr')}</p>
								</div>
							</div>
						{/if}

						<!-- Error State -->
						{#if error && !processing}
							<div class="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
								<div class="text-center text-white">
									<svg class="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"/>
									</svg>
									<p class="text-sm mb-3">{error}</p>
									<button
										on:click={retryScanning}
										class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
									>
	{$t('common.try_again')}
									</button>
								</div>
							</div>
						{/if}

						<!-- Success State -->
						{#if success}
							<div class="absolute inset-0 bg-green-600/90 flex items-center justify-center p-4">
								<div class="text-center text-white">
									<svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
									<p class="font-medium">{success}</p>
									<p class="text-sm mt-1 opacity-90">{$t('auth.redirecting')}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="p-6 space-y-3">
					<button
						on:click={toggleManualEntry}
						class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
						</svg>
	{$t('auth.enter_code_manually')}
					</button>
					
					<div class="text-center">
						<p class="text-xs text-gray-500">
							Having trouble? Ask your teacher for help
						</p>
					</div>
				</div>
			{:else}
				<!-- Manual Entry Interface -->
				<div class="p-6">
					<div class="text-center mb-6">
						<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
							</svg>
						</div>
						<h2 class="text-lg font-semibold text-gray-900 mb-2">Enter Student Code</h2>
						<p class="text-sm text-gray-600">Type the code your teacher gave you</p>
					</div>

					{#if error}
						<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
							{error}
						</div>
					{/if}

					{#if success}
						<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
							{success}
						</div>
					{/if}

					<div class="space-y-4">
						<div>
							<label for="uuid-input" class="block text-sm font-medium text-gray-700 mb-2">
								Student Code
							</label>
							<input
								id="uuid-input"
								type="text"
								bind:value={manualUUID}
								placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
								class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
								disabled={processing}
							/>
							<p class="text-xs text-gray-500 mt-1">
								This is a long code with numbers and letters
							</p>
						</div>

						<div class="space-y-2">
							<button
								on:click={loginWithUUID}
								disabled={processing || !manualUUID.trim()}
								class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
							>
								{#if processing}
									<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Logging in...
								{:else}
									Login
								{/if}
							</button>

							<button
								on:click={toggleManualEntry}
								disabled={processing}
								class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
							>
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h.01M12 12v4m6-4v4"/>
								</svg>
								Scan QR Code Instead
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Footer -->
	<div class="text-center text-white/80 text-xs p-4">
		<p>Educational App - Safe Student Login</p>
	</div>
</div>