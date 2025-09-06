<script lang="ts">
	import { t } from '@educational-app/i18n';
	import {
		Card,
		LocaleSwitcher
	} from '@educational-app/ui';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Make translations reactive
	const pageTitle = $derived($t('parent.dashboard.title'));
	const userName = $derived(data.user?.name || 'Parent');
	const welcomeText = $derived(`${$t('common.welcome')}, ${userName}!`);
	const childrenTitle = $derived($t('parent.dashboard.children_title'));
	const noChildrenText = $derived($t('parent.dashboard.no_children'));
	const linkChildText = $derived($t('parent.dashboard.link_child'));
	const viewProgressText = $derived($t('parent.dashboard.view_progress'));
	const manageText = $derived($t('parent.dashboard.manage'));
</script>

<svelte:head>
	<title>{pageTitle} - Lexi</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
	<div class="max-w-6xl mx-auto">
		<LocaleSwitcher variant="buttons" size="sm" />

		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				{pageTitle}
			</h1>
			<p class="text-gray-600">
				{welcomeText}
			</p>
		</div>

		{#if data.error}
			<Card variant="elevated" padding="md" class="mb-6 bg-red-50 border-red-200">
				<p class="text-red-600">{data.error}</p>
			</Card>
		{/if}

		{#if data.hasChildren}
			<!-- Children Overview -->
			<div class="mb-8">
				<h2 class="text-2xl font-semibold text-gray-900 mb-4">
					{childrenTitle}
				</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each data.linkedChildren as child (child.id)}
						<Card variant="elevated" padding="md">
							<div class="text-center">
								<!-- Child Avatar -->
								<div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
									{child.name ? child.name.charAt(0).toUpperCase() : '👦'}
								</div>
								
								<!-- Child Info -->
								<h3 class="font-semibold text-gray-900 mb-2">
									{child.name || `Student ${child.uuid.slice(0, 8)}`}
								</h3>
								<p class="text-sm text-gray-500 mb-4">
									{$t('parent.dashboard.grade')} {child.grade} • UUID: {child.uuid.slice(0, 8)}...
								</p>
								
								<!-- Status -->
								<div class="mb-4">
									{#if child.isActive}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											{$t('parent.dashboard.active')}
										</span>
									{:else}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											{$t('parent.dashboard.inactive')}
										</span>
									{/if}
								</div>
								
								<!-- Actions -->
								<div class="space-y-2">
									<a 
										href="/children/{child.id}/progress"
										class="w-full inline-flex items-center justify-center px-sm py-xs text-sm font-medium bg-primary hover:bg-primary-dark text-white shadow-sm rounded-lg transition-all duration-200"
									>
										{viewProgressText}
									</a>
									<a 
										href="/children/{child.id}"
										class="w-full inline-flex items-center justify-center px-sm py-xs text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
									>
										{manageText}
									</a>
								</div>
							</div>
						</Card>
					{/each}
				</div>
			</div>
		{:else}
			<!-- No Children State -->
			<Card variant="elevated" padding="lg" class="text-center">
				<div class="max-w-md mx-auto">
					<!-- Empty State Icon -->
					<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
						</svg>
					</div>
					
					<h3 class="text-lg font-semibold text-gray-900 mb-2">
						{noChildrenText}
					</h3>
					<p class="text-gray-600 mb-6">
						{$t('parent.dashboard.no_children_description')}
					</p>
					
					<a 
						href="/link-child"
						class="inline-flex items-center justify-center px-lg py-md text-lg font-medium bg-primary hover:bg-primary-dark text-white shadow-sm rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
					>
						{linkChildText}
					</a>
				</div>
			</Card>
		{/if}

		<!-- Quick Actions -->
		<div class="mt-8 flex justify-center gap-4">
			<a 
				href="/link-child"
				class="inline-flex items-center justify-center px-md py-sm text-base font-medium border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200"
			>
				{linkChildText}
			</a>
			<a 
				href="/auth/signout"
				class="inline-flex items-center justify-center px-md py-sm text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
			>
				{$t('parent.dashboard.sign_out')}
			</a>
		</div>
	</div>
</div>