<script lang="ts">
	interface Props {
		maxFileSize: number;
		acceptedFormats: string[];
		isUploading: boolean;
		uploadProgress: number;
		uploadError: string | null;
		onFileSelect: (files: FileList | null) => void;
	}

	let {
		maxFileSize,
		acceptedFormats,
		isUploading,
		uploadProgress,
		uploadError,
		onFileSelect
	}: Props = $props();

	let fileInputRef: HTMLInputElement;
	let dragOver = $state(false);

	// Format file size for display
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	// Handle drag events
	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		
		if (isUploading) return;
		
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			onFileSelect(files);
		}
	}

	// Handle file input change
	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			onFileSelect(target.files);
		}
		// Reset input to allow selecting the same file again
		target.value = '';
	}

	// Trigger file picker
	function triggerFileSelect() {
		if (!isUploading) {
			fileInputRef?.click();
		}
	}
</script>

<div class="custom-upload">
	<!-- Hidden file input -->
	<input
		bind:this={fileInputRef}
		type="file"
		accept={acceptedFormats.join(',')}
		style="display: none;"
		onchange={handleFileChange}
		disabled={isUploading}
	/>

	<!-- Upload area -->
	<div
		class="upload-area {dragOver ? 'drag-over' : ''} {isUploading ? 'uploading' : ''}"
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		ondrop={handleDrop}
		onclick={triggerFileSelect}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? triggerFileSelect() : null}
	>
		{#if isUploading}
			<!-- Upload progress -->
			<div class="upload-status">
				<div class="upload-spinner">
					<svg class="animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
				<div class="upload-text">
					<p class="upload-title">Uploading...</p>
					<div class="progress-bar">
						<div class="progress-fill" style="width: {uploadProgress}%"></div>
					</div>
					<p class="upload-percentage">{uploadProgress}%</p>
				</div>
			</div>
		{:else}
			<!-- Upload prompt -->
			<div class="upload-prompt">
				<div class="upload-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						></path>
					</svg>
				</div>
				<div class="upload-text">
					<p class="upload-title">Drop your image here</p>
					<p class="upload-subtitle">or <span class="upload-link">click to browse</span></p>
				</div>
			</div>
		{/if}
	</div>

	<!-- File requirements -->
	<div class="file-requirements">
		<h4>File Requirements:</h4>
		<ul>
			<li>Maximum size: {formatFileSize(maxFileSize)}</li>
			<li>Supported formats: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}</li>
			<li>Recommended dimensions: 512×512px or larger</li>
		</ul>
	</div>

	<!-- Error display -->
	{#if uploadError}
		<div class="error-message">
			<svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<span>{uploadError}</span>
		</div>
	{/if}
</div>

<style>
	.custom-upload {
		width: 100%;
	}

	.upload-area {
		border: 2px dashed #d1d5db;
		border-radius: 12px;
		padding: 40px 20px;
		text-align: center;
		cursor: pointer;
		transition: all 200ms;
		background: #fafafa;
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-area:hover {
		border-color: #2563eb;
		background: #f0f4ff;
	}

	.upload-area.drag-over {
		border-color: #2563eb;
		background: #e0f2fe;
		transform: scale(1.02);
	}

	.upload-area.uploading {
		border-color: #16a34a;
		background: #f0fdf4;
		cursor: not-allowed;
	}

	.upload-prompt,
	.upload-status {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.upload-icon {
		width: 48px;
		height: 48px;
		color: #6b7280;
	}

	.upload-spinner {
		width: 32px;
		height: 32px;
		color: #16a34a;
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.upload-text {
		text-align: center;
	}

	.upload-title {
		margin: 0 0 8px 0;
		font-size: 16px;
		font-weight: 600;
		color: #374151;
	}

	.upload-subtitle {
		margin: 0;
		font-size: 14px;
		color: #6b7280;
	}

	.upload-link {
		color: #2563eb;
		font-weight: 500;
	}

	.progress-bar {
		width: 200px;
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
		margin: 8px 0;
	}

	.progress-fill {
		height: 100%;
		background: #16a34a;
		border-radius: 4px;
		transition: width 200ms;
	}

	.upload-percentage {
		margin: 0;
		font-size: 12px;
		color: #16a34a;
		font-weight: 500;
	}

	.file-requirements {
		margin-top: 20px;
		padding: 16px;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	.file-requirements h4 {
		margin: 0 0 8px 0;
		font-size: 13px;
		font-weight: 600;
		color: #374151;
	}

	.file-requirements ul {
		margin: 0;
		padding-left: 16px;
		list-style: none;
	}

	.file-requirements li {
		margin: 4px 0;
		font-size: 12px;
		color: #6b7280;
		position: relative;
	}

	.file-requirements li::before {
		content: '•';
		color: #2563eb;
		font-weight: bold;
		position: absolute;
		left: -12px;
	}

	.error-message {
		margin-top: 16px;
		padding: 12px;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 6px;
		color: #dc2626;
		font-size: 14px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.error-icon {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	/* Responsive design */
	@media (max-width: 640px) {
		.upload-area {
			padding: 30px 16px;
			min-height: 160px;
		}

		.upload-icon {
			width: 40px;
			height: 40px;
		}

		.upload-title {
			font-size: 14px;
		}

		.upload-subtitle {
			font-size: 12px;
		}

		.progress-bar {
			width: 150px;
		}
	}
</style>