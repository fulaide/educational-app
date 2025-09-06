<script lang="ts">
	import type { Notification } from '../../types/notifications.js'
	import { useNotifications } from '../../stores/notifications.svelte.js'
	
	interface Props {
		notification: Notification
	}
	
	let { notification }: Props = $props()
	const notifications = useNotifications()
	
	let progressWidth = $state(100)
	let isVisible = $state(false)
	let isExiting = $state(false)
	
	// Auto-dismiss countdown with progress bar
	$effect(() => {
		if (notification.duration > 0 && !notification.persistent) {
			const startTime = Date.now()
			const interval = setInterval(() => {
				const elapsed = Date.now() - startTime
				const remaining = Math.max(0, notification.duration - elapsed)
				progressWidth = (remaining / notification.duration) * 100
				
				if (remaining <= 0) {
					clearInterval(interval)
				}
			}, 50)
			
			return () => clearInterval(interval)
		}
	})
	
	// Entry animation
	$effect(() => {
		const timer = requestAnimationFrame(() => {
			isVisible = true
		})
		return () => cancelAnimationFrame(timer)
	})
	
	function dismiss() {
		if (isExiting) return
		
		isExiting = true
		isVisible = false
		
		// Remove from store after animation completes
		setTimeout(() => {
			notifications.remove(notification.id)
		}, 300)
	}
	
	function getIcon(type: string, customIcon?: string): string {
		if (customIcon === 'loading') {
			return '⟳'
		}
		if (customIcon) {
			return customIcon
		}
		
		switch (type) {
			case 'success': return '✓'
			case 'error': return '✕'
			case 'warning': return '⚠'
			case 'info': return 'ℹ'
			default: return 'ℹ'
		}
	}
</script>

<div 
	class="toast toast-{notification.type}"
	class:toast-visible={isVisible}
	class:toast-loading={notification.icon === 'loading'}
	role="alert"
	aria-live="polite"
	aria-atomic="true"
>
	<div class="toast-content">
		<div class="toast-icon">
			<span class:animate-spin={notification.icon === 'loading'}>
				{getIcon(notification.type, notification.icon)}
			</span>
		</div>
		
		<div class="toast-body">
			{#if notification.title}
				<div class="toast-title">{notification.title}</div>
			{/if}
			<div class="toast-message">{notification.message}</div>
			
			{#if notification.actions.length > 0}
				<div class="toast-actions">
					{#each notification.actions as action (action.label)}
						<button 
							class="toast-action toast-action-{action.style || 'secondary'}" 
							onclick={action.action}
							type="button"
						>
							{action.label}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		
		{#if !notification.persistent}
			<button 
				class="toast-close" 
				onclick={dismiss} 
				aria-label="Close notification"
				type="button"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>
	
	{#if notification.duration > 0 && !notification.persistent}
		<div class="toast-progress">
			<div 
				class="toast-progress-bar toast-progress-{notification.type}" 
				style="width: {progressWidth}%"
			></div>
		</div>
	{/if}
</div>

<style>
	.toast {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		margin-bottom: 0.75rem;
		transform: translateX(100%) scale(0.95);
		transition: all 300ms ease-out;
		opacity: 0;
		min-width: 320px;
		max-width: 480px;
		overflow: hidden;
	}
	
	.toast-visible {
		transform: translateX(0) scale(1);
		opacity: 1;
	}
	
	/* Toast type styles */
	.toast-success { 
		border-color: #bbf7d0;
		background-color: #f0fdf4;
	}
	.toast-error { 
		border-color: #fecaca;
		background-color: #fef2f2;
	}
	.toast-warning { 
		border-color: #fde68a;
		background-color: #fffbeb;
	}
	.toast-info { 
		border-color: #bfdbfe;
		background-color: #eff6ff;
	}
	
	.toast-content {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
	}
	
	.toast-icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	
	.toast-success .toast-icon { 
		background-color: #dcfce7;
		color: #16a34a;
	}
	.toast-error .toast-icon { 
		background-color: #fee2e2;
		color: #dc2626;
	}
	.toast-warning .toast-icon { 
		background-color: #fef3c7;
		color: #d97706;
	}
	.toast-info .toast-icon { 
		background-color: #dbeafe;
		color: #2563eb;
	}
	
	.toast-body {
		flex: 1;
		min-width: 0;
	}
	
	.toast-title {
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}
	
	.toast-message {
		color: #374151;
		font-size: 0.875rem;
		line-height: 1.5;
	}
	
	.toast-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
		flex-wrap: wrap;
	}
	
	.toast-action {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		border-radius: 0.25rem;
		border: 1px solid;
		transition: all 200ms;
		cursor: pointer;
	}
	
	.toast-action:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
	}
	
	.toast-action-primary {
		background-color: #2563eb;
		color: white;
		border-color: #2563eb;
	}
	
	.toast-action-primary:hover {
		background-color: #1d4ed8;
	}
	
	.toast-action-secondary {
		background-color: white;
		border-color: #d1d5db;
		color: #374151;
	}
	
	.toast-action-secondary:hover {
		background-color: #f9fafb;
	}
	
	.toast-action-danger {
		background-color: #dc2626;
		color: white;
		border-color: #dc2626;
	}
	
	.toast-action-danger:hover {
		background-color: #b91c1c;
	}
	
	.toast-close {
		color: #9ca3af;
		transition: color 200ms;
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		padding: 2px;
		border-radius: 0.25rem;
		cursor: pointer;
	}
	
	.toast-close:hover {
		color: #4b5563;
	}
	
	.toast-close:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5);
	}
	
	.toast-progress {
		width: 100%;
		height: 0.25rem;
		background-color: #e5e7eb;
	}
	
	.toast-progress-bar {
		height: 100%;
		transition: all 100ms linear;
	}
	
	.toast-progress-success { 
		background-color: #22c55e;
	}
	.toast-progress-error { 
		background-color: #ef4444;
	}
	.toast-progress-warning { 
		background-color: #eab308;
	}
	.toast-progress-info { 
		background-color: #3b82f6;
	}
	
	/* Loading animation */
	.toast-loading .toast-icon {
		background-color: #dbeafe;
		color: #2563eb;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>