<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import { Button } from '@educational-app/ui';
	import { QrCode } from 'lucide-svelte';
	import QRCodeLib from 'qrcode';
	import { onMount } from 'svelte';

	interface Props {
		data: string;
		size?: number;
		bgColor?: string;
		fgColor?: string;
		level?: 'L' | 'M' | 'Q' | 'H';
		showActions?: boolean;
		title?: string;
		class?: string;
	}

	let {
		data,
		size = 200,
		bgColor = '#ffffff',
		fgColor = '#000000',
		level = 'M',
		showActions = true,
		title,
		class: className
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let qrCodeGenerated = $state(false);

	// QR Code generation function using the qrcode library
	async function generateQRCode() {
		if (!canvas || !data) return;

		try {
			await QRCodeLib.toCanvas(canvas, data, {
				width: size,
				margin: 1,
				color: {
					dark: fgColor,
					light: bgColor
				},
				errorCorrectionLevel: level
			});
			qrCodeGenerated = true;
		} catch (err) {
			console.error('Failed to generate QR code:', err);
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(data);
			// TODO: Show toast notification
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
		}
	}

	function downloadQRCode() {
		if (!canvas) return;

		const link = document.createElement('a');
		link.download = `qr-code-${Date.now()}.png`;
		link.href = canvas.toDataURL();
		link.click();
	}

	onMount(() => {
		generateQRCode();
	});

	$effect(() => {
		if (data) {
			generateQRCode();
		}
	});
</script>

<div class={cn('flex flex-col items-center space-y-4', className)}>
	{#if title}
		<div class="text-center">
			<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
		</div>
	{/if}

	<div class="relative group">
		<canvas
			bind:this={canvas}
			width={size}
			height={size}
			class="rounded-lg border-2 border-gray-200 "
		/>

		{#if !qrCodeGenerated}
			<div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
				<QrCode class="w-12 h-12 text-gray-400" />
			</div>
		{/if}
	</div>

	{#if showActions && qrCodeGenerated}
		<div class="flex gap-2">
			

			<Button
	variant="outline"
				class="flex-1"
				onclick={copyToClipboard}
			>
				Copy
			</Button>

			<Button 
				variant="soft"
				class="flex-1"
				onclick={downloadQRCode}
			>
				Download
			</Button>


		</div>
	{/if}

	<!-- <div class="text-xs text-gray-500 text-center max-w-xs break-all">
		{data.slice(0, 50)}{data.length > 50 ? '...' : ''}
	</div> -->
</div>

<!-- Note: In production, replace the generateQRCode function with a proper QR code library -->
<!-- Example: npm install qrcode @types/qrcode -->