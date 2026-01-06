<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { Button, Card, Input, notifications, Badge } from '@educational-app/ui';
	import {
		Plus,
		Keyboard,
		FileText,
		Users,
		Eye,
		Clock,
		Zap,
		Trophy,
		Play,
		Lightbulb,
		Languages
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Check for success notifications
	onMount(() => {
		const createdId = $page.url.searchParams.get('created');
		const deleted = $page.url.searchParams.get('deleted');

		if (createdId) {
			notifications.success('Typing challenge created successfully!');
			goto('/typing-challenges', { replaceState: true });
		} else if (deleted) {
			notifications.success('Typing challenge deleted successfully!');
			goto('/typing-challenges', { replaceState: true });
		}
	});

	// Filter and sort state
	let searchQuery = $state('');
	let gradeFilter = $state<number | 'all'>('all');
	let themeFilter = $state<string>('all');
	let sortBy = $state<'recent' | 'words'>('recent');

	// Reactive challenges
	const challenges = $derived(data.challenges || []);

	// Filtered challenges
	const filteredChallenges = $derived.by(() => {
		let filtered = challenges;

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.title.toLowerCase().includes(query) ||
					c.description?.toLowerCase().includes(query)
			);
		}

		// Grade filter
		if (gradeFilter !== 'all') {
			filtered = filtered.filter((c) => c.gradeLevel === gradeFilter);
		}

		// Theme filter
		if (themeFilter !== 'all') {
			filtered = filtered.filter((c) => c.theme === themeFilter);
		}

		// Sort
		switch (sortBy) {
			case 'recent':
				filtered = [...filtered].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				break;
			case 'words':
				filtered = [...filtered].sort(
					(a, b) => b.stats.totalWords - a.stats.totalWords
				);
				break;
		}

		return filtered;
	});

	function getDifficultyColor(difficulty: string): string {
		switch (difficulty) {
			case 'BEGINNER':
				return 'text-success-600 bg-success-50';
			case 'INTERMEDIATE':
				return 'text-warning-600 bg-warning-50';
			case 'ADVANCED':
				return 'text-danger-600 bg-danger-50';
			default:
				return 'text-neutral-600 bg-neutral-50';
		}
	}

	function getThemeLabel(theme: string): string {
		const labels: Record<string, string> = {
			STORY: 'Story',
			POEM: 'Poem',
			EDUCATIONAL: 'Educational',
			RHYME: 'Rhyme',
			CUSTOM: 'Custom'
		};
		return labels[theme] || theme;
	}
</script>

<svelte:head>
	<title>Typing Challenges - Teacher Portal</title>
</svelte:head>

<!-- Header -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-neutral-900">Typing Challenges</h1>
			<p class="mt-1 text-sm text-neutral-500">
				Create and manage keyboard learning challenges for your students
			</p>
		</div>
		<Button
			variant="solid"
			color="primary"
			onclick={() => (window.location.href = '/typing-challenges/create')}
		>
			<Plus class="w-4 h-4 mr-2" />
			Create Challenge
		</Button>
	</div>
</div>

<!-- Stats Cards -->
{#if challenges}
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
	<Card variant="elevated" padding="lg">
		<div class="flex items-center">
			<div class="flex-shrink-0 p-3 bg-primary-50 rounded-lg">
				<Keyboard class="h-6 w-6 text-primary-600" />
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-neutral-500">Total Challenges</p>
				<p class="text-2xl font-bold text-neutral-900">{challenges.length}</p>
			</div>
		</div>
	</Card>

	<Card variant="elevated" padding="lg">
		<div class="flex items-center">
			<div class="flex-shrink-0 p-3 bg-success-50 rounded-lg">
				<Zap class="h-6 w-6 text-success-600" />
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-neutral-500">Total Words</p>
				<p class="text-2xl font-bold text-neutral-900">
					{challenges.reduce((sum, c) => sum + (c.stats?.totalWords ?? 0), 0)}
				</p>
			</div>
		</div>
	</Card>

	<Card variant="elevated" padding="lg">
		<div class="flex items-center">
			<div class="flex-shrink-0 p-3 bg-secondary-50 rounded-lg">
				<Users class="h-6 w-6 text-secondary-600" />
			</div>
			<div class="ml-4">
				<p class="text-sm font-medium text-neutral-500">Total Assignments</p>
				<p class="text-2xl font-bold text-neutral-900">
					{challenges.reduce((sum, c) => sum + (c.stats?.assignmentCount ?? 0), 0)}
				</p>
			</div>
		</div>
	</Card>
</div>
{/if}

<!-- Filters and Search -->
<div class="flex flex-col sm:flex-row gap-4 mb-6">
	<div class="flex-1">
		<Input
			type="search"
			bind:value={searchQuery}
			placeholder="Search challenges..."
		/>
	</div>
	<div class="flex gap-2">
		<select
			bind:value={gradeFilter}
			class="px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		>
			<option value="all">All Grades</option>
			<option value={1}>Grade 1</option>
			<option value={2}>Grade 2</option>
			<option value={3}>Grade 3</option>
			<option value={4}>Grade 4</option>
		</select>

		<select
			bind:value={themeFilter}
			class="px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		>
			<option value="all">All Themes</option>
			<option value="STORY">Story</option>
			<option value="POEM">Poem</option>
			<option value="EDUCATIONAL">Educational</option>
			<option value="RHYME">Rhyme</option>
			<option value="CUSTOM">Custom</option>
		</select>

		<select
			bind:value={sortBy}
			class="px-4 py-2 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		>
			<option value="recent">Most Recent</option>
			<option value="words">Most Words</option>
		</select>
	</div>
</div>

<!-- Challenges Grid -->
{#if filteredChallenges.length === 0}
	<Card variant="outlined" padding="xl" class="text-center">
		<div class="flex flex-col items-center justify-center py-12">
			<Keyboard class="h-16 w-16 text-neutral-300 mb-4" />
			<h3 class="text-lg font-semibold text-neutral-900 mb-2">No typing challenges yet</h3>
			<p class="text-sm text-neutral-500 mb-6">
				Create your first keyboard learning challenge to get started
			</p>
			<Button
				variant="solid"
				color="primary"
				onclick={() => (window.location.href = '/typing-challenges/create')}
			>
				<Plus class="w-4 h-4 mr-2" />
				Create Challenge
			</Button>
		</div>
	</Card>
{:else}
	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
		{#each filteredChallenges as challenge (challenge.id)}
			<Card variant="elevated" padding="lg" hoverable={true}>
				<!-- Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-neutral-900 mb-1 line-clamp-2">
							{challenge.title}
						</h3>
						{#if challenge.description}
							<p class="text-sm text-neutral-500 line-clamp-2">{challenge.description}</p>
						{/if}
					</div>
				</div>

				<!-- Metadata -->
				<div class="flex items-center gap-3 mb-4">
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(
							challenge.difficulty
						)}"
					>
						{challenge.difficulty}
					</span>
					<span class="text-xs text-neutral-500">
						Grade {challenge.gradeLevel}
					</span>
					<span class="text-xs text-neutral-500">
						{getThemeLabel(challenge.theme)}
					</span>
				</div>

				<!-- Stats -->
				<div class="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-neutral-100">
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<Zap class="w-3 h-3 mr-1" />
							Words
						</div>
						<p class="text-lg font-semibold text-neutral-900">
							{challenge.stats.totalWords}
						</p>
					</div>
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<Clock class="w-3 h-3 mr-1" />
							Timer
						</div>
						<p class="text-sm font-semibold text-neutral-900">
							{challenge.timerMode === 'PER_WORD' ? `${challenge.baseTimePerWord / 1000}s` :
							 challenge.timerMode === 'GLOBAL' ? 'Global' : 'Off'}
						</p>
					</div>
					<div>
						<div class="flex items-center text-neutral-500 text-xs mb-1">
							<Users class="w-3 h-3 mr-1" />
							Assigned
						</div>
						<p class="text-lg font-semibold text-neutral-900">
							{challenge.stats.assignmentCount}
						</p>
					</div>
				</div>

				<!-- Features -->
				<div class="flex flex-wrap gap-2 mb-4">
					{#if challenge.enableHints}
						<Badge variant="neutral">
							<Lightbulb class="w-3 h-3" />
							Hints
						</Badge>
					{/if}
					{#if challenge.showKeyboard}
						<Badge variant="neutral">
							<Keyboard class="w-3 h-3" />
							Keyboard
						</Badge>
					{/if}
					{#if challenge.stats.hasUmlauts}
						<Badge variant="neutral">
							<Languages class="w-3 h-3" />
							Umlauts
						</Badge>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex gap-2">
				<Button
					variant="soft"
					color="secondary"
					class="flex-1"
					onclick={() => (window.location.href = `/typing-challenges/${challenge.id}/preview`)}
				>
					<Play class="w-4 h-4 mr-2" />
					Preview
				</Button>

					<Button
						variant="soft"
						color="primary"
						class="flex-1"
						onclick={() => (window.location.href = `/typing-challenges/${challenge.id}`)}
					>
						<Eye class="w-4 h-4 mr-2" />
						Details
					</Button>
				</div>

				<!-- Date -->
				<div class="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
					<Clock class="w-3 h-3 inline mr-1" />
					{new Date(challenge.createdAt).toLocaleDateString()}
				</div>
			</Card>
		{/each}
	</div>
{/if}
