<script lang="ts">
	interface Props {
		links: Array<{
			href: string;
			text: string;
			variant?: 'primary' | 'secondary';
		}>;
		class?: string;
	}

	let { links, class: className }: Props = $props();
</script>

<div class="text-center space-y-2 {className || ''}">
	{#each links as link}
		<div>
			<a
				href={link.href}
				class="text-sm {link.variant === 'secondary' ? 'text-text-secondary hover:text-text-primary' : 'text-primary-600 hover:text-primary-700'} transition-colors"
			>
				{link.text}
			</a>
		</div>
	{/each}
</div>