import { SvelteComponent } from 'svelte';

export interface QRScannerProps {
	/** Whether the scanner is active */
	active?: boolean;
	/** CSS class for styling */
	class?: string;
	/** Width of the video element */
	width?: number;
	/** Height of the video element */
	height?: number;
	/** Facing mode for camera ('user' for front, 'environment' for back) */
	facingMode?: 'user' | 'environment';
	/** Whether to show the scanner frame overlay */
	showFrame?: boolean;
	/** Custom error message */
	errorMessage?: string;
}

export interface QRScannerEvents {
	scan: CustomEvent<{ data: string }>;
	error: CustomEvent<{ error: Error | string }>;
	ready: CustomEvent<void>;
}

export default class QRScanner extends SvelteComponent<QRScannerProps, QRScannerEvents> {}