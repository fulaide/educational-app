<script lang="ts">
	import { page } from '$app/stores';
	import ChallengeBuilder from '$lib/components/ChallengeBuilder/ChallengeBuilder.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Create Vocabulary Challenge - Teacher Portal</title>
</svelte:head>

<div class="min-h-screen bg-neutral-50">
	<ChallengeBuilder
		form={data.form}
		vocabularyWords={data.vocabularyWords}
		classes={data.classes}
		categories={data.categories}
		difficulties={data.difficulties}
		draftId={data.draftId}
	/>
</div>
