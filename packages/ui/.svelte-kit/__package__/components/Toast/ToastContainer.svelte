<script lang="ts">
	import { useNotifications } from '../../stores/notifications.svelte.js'
	import Toast from './Toast.svelte'
	
	interface Props {
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
		maxVisible?: number
	}
	
	let { position = 'top-right', maxVisible = 5 }: Props = $props()
	
	const notifications = useNotifications()
	
	// Get the most recent notifications up to the limit
	const visibleNotifications = $derived.by(() => {
		const allNotifications = notifications.notifications
		
		// For bottom positions, show oldest first (natural stacking)
		// For top positions, show newest first (reverse stacking)
		if (position.includes('bottom')) {
			return allNotifications.slice(-maxVisible)
		} else {
			return allNotifications.slice(-maxVisible).reverse()
		}
	})
	
	// Position classes mapping
	const positionClasses = {
		'top-right': 'toast-position-top-right',
		'top-left': 'toast-position-top-left', 
		'bottom-right': 'toast-position-bottom-right',
		'bottom-left': 'toast-position-bottom-left',
		'top-center': 'toast-position-top-center'
	}
</script>

{#if visibleNotifications.length > 0}
	<div 
		class="toast-container {positionClasses[position]}"
		aria-live="polite" 
		aria-label="Notifications"
		role="region"
	>
		{#each visibleNotifications as notification (notification.id)}
			<Toast {notification} />
		{/each}
		
		<!-- Show overflow indicator if there are more notifications -->
		{#if notifications.notifications.length > maxVisible}
			<div class="toast-overflow">
				<button 
					class="toast-overflow-button"
					onclick={() => notifications.clearNonPersistent()}
					type="button"
				>
					+{notifications.notifications.length - maxVisible} more notifications
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		z-index: 50;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 420px;
		animation: fadeIn 0.2s ease-out;
	}
	
	.toast-container > :global(*) {
		pointer-events: auto;
	}
	
	/* Positioning classes */
	.toast-position-top-right {
		top: 1rem;
		right: 1rem;
	}
	
	.toast-position-top-left {
		top: 1rem;
		left: 1rem;
	}
	
	.toast-position-bottom-right {
		bottom: 1rem;
		right: 1rem;
	}
	
	.toast-position-bottom-left {
		bottom: 1rem;
		left: 1rem;
	}
	
	.toast-position-top-center {
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
	}
	
	/* Specific positioning adjustments */
	.toast-container:has(.toast-overflow) {
		padding-bottom: 2rem;
	}
	
	.toast-overflow {
		margin-top: 0.5rem;
	}
	
	.toast-overflow-button {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 0.75rem;
		color: #4b5563;
		background-color: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		transition: all 200ms;
		cursor: pointer;
	}
	
	.toast-overflow-button:hover {
		background-color: #f9fafb;
	}
	
	.toast-overflow-button:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	/* Responsive adjustments */
	@media (max-width: 640px) {
		.toast-container {
			left: 1rem;
			right: 1rem;
			max-width: none;
		}
		
		/* Adjust positioning for mobile */
		.toast-position-top-center {
			transform: none;
		}
		
		.toast-position-top-right,
		.toast-position-top-left {
			left: 1rem;
			right: 1rem;
		}
		
		.toast-position-bottom-right,
		.toast-position-bottom-left {
			left: 1rem;
			right: 1rem;
		}
	}
</style>