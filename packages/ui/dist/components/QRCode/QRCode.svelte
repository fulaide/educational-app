<script lang="ts">
	import { cn } from '../../utils/index.js';
	import { Copy, Download, QrCode } from 'lucide-svelte';
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

	// QR Code generation function (simplified - in real implementation you'd use a library like qrcode)
	function generateQRCode() {
		if (!canvas || !data) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, size, size);

		// For demo purposes, create a simple grid pattern
		// In real implementation, use a proper QR code library
		const gridSize = 20;
		const cellSize = size / gridSize;

		// Simple hash-based pattern generation (demo only)
		let hash = 0;
		for (let i = 0; i < data.length; i++) {
			const char = data.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32-bit integer
		}

		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, size, size);

		ctx.fillStyle = fgColor;

		// Create a pattern based on the data hash
		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < gridSize; col++) {
				const cellHash = hash + row * gridSize + col;
				if (cellHash % 3 === 0) {
					ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
				}
			}
		}

		// Add corner markers (simplified)
		const markerSize = cellSize * 3;
		ctx.fillRect(0, 0, markerSize, markerSize);
		ctx.fillRect(size - markerSize, 0, markerSize, markerSize);
		ctx.fillRect(0, size - markerSize, markerSize, markerSize);

		// Add white squares inside corners
		ctx.fillStyle = bgColor;
		const innerSize = cellSize;
		ctx.fillRect(innerSize, innerSize, innerSize, innerSize);
		ctx.fillRect(size - markerSize + innerSize, innerSize, innerSize, innerSize);
		ctx.fillRect(innerSize, size - markerSize + innerSize, innerSize, innerSize);

		qrCodeGenerated = true;
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
			class="rounded-lg border-2 border-gray-200 shadow-sm"
		/>

		{#if !qrCodeGenerated}
			<div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
				<QrCode class="w-12 h-12 text-gray-400" />
			</div>
		{/if}
	</div>

	{#if showActions && qrCodeGenerated}
		<div class="flex gap-2">
			<button
				type="button"
				class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
				onclick={copyToClipboard}
			>
				<Copy class="w-4 h-4" />
				Copy Data
			</button>

			<button
				type="button"
				class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
				onclick={downloadQRCode}
			>
				<Download class="w-4 h-4" />
				Download
			</button>
		</div>
	{/if}

	<div class="text-xs text-gray-500 text-center max-w-xs break-all">
		{data.slice(0, 50)}{data.length > 50 ? '...' : ''}
	</div>
</div>

<!-- Note: In production, replace the generateQRCode function with a proper QR code library -->
<!-- Example: npm install qrcode @types/qrcode -->