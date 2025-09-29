<script lang="ts">
	import TeacherLayout from '$lib/components/TeacherLayout.svelte';
	import type { LayoutData } from './$types';
	
	interface Props {
		data: LayoutData;
		children: any;
	}
	
	let { data, children }: Props = $props();
</script>

<TeacherLayout 
	user={data.user}
	badges={data.badges}
	organization={data.organization}
>
	{@render children?.()}
</TeacherLayout>