<script lang="ts">
	import TeacherLayout from '$lib/components/TeacherLayout.svelte';
	import { LocaleSwitcher } from '@educational-app/ui';
	import type { LayoutData } from './$types';
	
	interface Props {
		data: LayoutData;
		children: any;
	}
	
	let { data, children }: Props = $props();
</script>

{#snippet sidebarAd()}
	<LocaleSwitcher variant="toggle" size="sm" compact={true} />
{/snippet}

<TeacherLayout 
	user={data.user}
	badges={data.badges}
	organization={data.organization}
	sidebarAd={sidebarAd}
>
	{@render children?.()}
</TeacherLayout>