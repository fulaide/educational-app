<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { AuthPageContainer, AuthHeader, AuthForm, AuthInput, AuthButton } from '@educational-app/ui';
	import { QRScanner } from '@educational-app/ui';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Form schemas
	const loginSchema = z.object({
		uuid: z.string().min(8).max(8)
	});

	const registerSchema = z.object({
		name: z.string().min(1, 'Please enter your name'),
		grade: z.number().min(1).max(12)
	});

	// Auth mode state
	let authMode: 'login' | 'register' = $state('login');
	let loginMethod: 'manual' | 'qr' = $state('manual');
	let showQRScanner = $state(false);

	// Forms
	const loginForm = superForm(data.loginForm, {
		validators: zodClient(loginSchema),
		id: 'login'
	});

	const registerForm = superForm(data.registerForm, {
		validators: zodClient(registerSchema),
		id: 'register'
	});

	const { form: loginData, errors: loginErrors, enhance: loginEnhance } = loginForm;
	const { form: registerData, errors: registerErrors, enhance: registerEnhance } = registerForm;

	// QR Scanner handlers
	function handleQRScan(event: CustomEvent<{ data: string }>) {
		const scannedCode = event.detail.data;
		if (/^[A-Za-z0-9]{8}$/.test(scannedCode)) {
			$loginData.uuid = scannedCode.toUpperCase();
			showQRScanner = false;
			// Auto-submit the form
			document.getElementById('loginForm')?.requestSubmit();
		}
	}

	function handleQRError(event: CustomEvent<{ error: Error | string }>) {
		console.error('QR Scanner error:', event.detail.error);
	}

	function toggleQRScanner() {
		showQRScanner = !showQRScanner;
		loginMethod = showQRScanner ? 'qr' : 'manual';
	}
</script>

<svelte:head>
	<title>Student Login - Educational App</title>
</svelte:head>

<AuthPageContainer>
	<AuthHeader 
		title="Student Portal" 
		subtitle={authMode === 'login' ? 'Login with your student code' : 'Create your student account'}
	/>

	<!-- Auth Mode Switcher -->
	<div class="flex rounded-lg bg-gray-100 p-1 mb-6">
		<button 
			type="button"
			class="flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors {authMode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
			onclick={() => authMode = 'login'}
		>
			🔑 Login with Code
		</button>
		<button 
			type="button"
			class="flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors {authMode === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
			onclick={() => authMode = 'register'}
		>
			✨ Create Account
		</button>
	</div>

	{#if authMode === 'login'}
		<!-- LOGIN MODE -->
		<AuthForm>
			<!-- Login Method Switcher -->
			<div class="flex rounded-lg bg-blue-50 p-1 mb-4">
				<button 
					type="button"
					class="flex-1 rounded-md py-2 px-3 text-xs font-medium transition-colors {loginMethod === 'manual' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-600 hover:text-blue-800'}"
					onclick={() => { loginMethod = 'manual'; showQRScanner = false; }}
				>
					⌨️ Type Code
				</button>
				<button 
					type="button"
					class="flex-1 rounded-md py-2 px-3 text-xs font-medium transition-colors {loginMethod === 'qr' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-600 hover:text-blue-800'}"
					onclick={toggleQRScanner}
				>
					📱 Scan QR
				</button>
			</div>

			{#if showQRScanner}
				<!-- QR Scanner Mode -->
				<div class="space-y-4">
					<div class="bg-gray-50 rounded-lg p-4 text-center">
						<p class="text-sm text-gray-600 mb-3">Point your camera at the QR code</p>
						<QRScanner 
							active={showQRScanner}
							width={280}
							height={280}
							facingMode="environment"
							showFrame={true}
							class="mx-auto"
							on:scan={handleQRScan}
							on:error={handleQRError}
						/>
					</div>
					<button 
						type="button"
						class="w-full py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
						onclick={() => { showQRScanner = false; loginMethod = 'manual'; }}
					>
						Switch to Manual Entry
					</button>
				</div>
			{:else}
				<!-- Manual Code Entry Mode -->
				<form id="loginForm" method="POST" action="?/login" use:loginEnhance>
					<div class="space-y-4">
						<AuthInput 
							name="uuid"
							label="Student Code"
							placeholder="Enter your 8-character code"
							bind:value={$loginData.uuid}
							error={$loginErrors.uuid?.[0]}
							maxlength={8}
							class="text-center text-lg tracking-wider font-mono uppercase"
						/>
						
						<AuthButton type="submit" class="w-full">
							Login
						</AuthButton>

						<button 
							type="button"
							class="w-full py-2 px-4 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
							onclick={toggleQRScanner}
						>
							📱 Use QR Scanner Instead
						</button>
					</div>
				</form>
			{/if}
		</AuthForm>
	{:else}
		<!-- REGISTER MODE -->
		<AuthForm>
			<form method="POST" action="?/register" use:registerEnhance>
				<div class="space-y-4">
					<AuthInput 
						name="name"
						label="Your Name"
						placeholder="Enter your first and last name"
						bind:value={$registerData.name}
						error={$registerErrors.name?.[0]}
					/>
					
					<div>
						<label for="grade" class="block text-sm font-medium text-gray-700 mb-1">
							Grade
						</label>
						<select 
							id="grade"
							name="grade"
							bind:value={$registerData.grade}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Select your grade</option>
							{#each Array(12) as _, i}
								<option value={i + 1}>Grade {i + 1}</option>
							{/each}
						</select>
						{#if $registerErrors.grade?.[0]}
							<p class="mt-1 text-sm text-red-600">{$registerErrors.grade[0]}</p>
						{/if}
					</div>

					<div class="bg-blue-50 rounded-lg p-4">
						<p class="text-xs text-blue-700 mb-2">📝 <strong>Note:</strong></p>
						<p class="text-xs text-blue-600">
							You'll get a unique student code after creating your account. 
							Save it safely - you'll need it to log in!
						</p>
					</div>
					
					<AuthButton type="submit" class="w-full">
						Create My Account
					</AuthButton>
				</div>
			</form>
		</AuthForm>
	{/if}

	<!-- Help Links -->
	<div class="mt-6 text-center">
		<p class="text-xs text-gray-500">
			Need help? Ask your teacher for your student code.
		</p>
	</div>
</AuthPageContainer>
