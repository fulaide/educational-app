<script>
	import { t } from '@educational-app/i18n';
	import { Card } from '@educational-app/ui';
	
	// Reactive translations
	const pageTitle = $derived($t('parent.portal.title'));
	const welcomeTitle = $derived($t('parent.portal.welcome_title'));
	const welcomeSubtitle = $derived($t('parent.portal.welcome_subtitle'));
	const signinText = $derived($t('parent.portal.signin'));
	const registerText = $derived($t('parent.portal.register'));
	const featuresTitle = $derived($t('parent.portal.features_title'));
</script>

<svelte:head>
	<title>{pageTitle} - Lexi</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-surface-tertiary to-surface-secondary p-6">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<Card variant="elevated" padding="lg" class="text-center mb-8">
			<div class="flex items-center justify-center gap-4 mb-6">
				<div class="w-16 h-16 bg-surface-brand rounded-full flex items-center justify-center text-white text-2xl">👨‍👩‍👧‍👦</div>
				<div>
					<h1 class="text-3xl font-bold text-text-brand">{welcomeTitle}</h1>
				</div>
			</div>
			<p class="text-lg text-text-secondary mb-8">{welcomeSubtitle}</p>
			
			<div class="flex gap-4 justify-center">
				<a 
					href="/auth/signin"
					class="inline-flex items-center justify-center px-lg py-md px-3 text-lg font-medium bg-surface-inverse hover:bg-primary-dark text-white shadow-sm rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
				>
					{signinText}
				</a>
				<a 
					href="/auth/register"
					class="inline-flex items-center justify-center px-lg py-md px-3  text-lg font-medium border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
				>
					{registerText}
				</a>
			</div>
		</Card>

		<!-- Features -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card variant="elevated" padding="md" class="text-center">
				<div class="w-12 h-12 bg-surface-brand rounded-lg flex items-center justify-center mx-auto mb-4">
					📊
				</div>
				<h3 class="font-semibold text-text-primary mb-2">{$t('parent.portal.track_progress')}</h3>
				<p class="text-sm text-text-secondary">{$t('parent.portal.track_progress_desc')}</p>
			</Card>

			<Card variant="elevated" padding="md" class="text-center">
				<div class="w-12 h-12 bg-surface-brand rounded-lg flex items-center justify-center mx-auto mb-4">
					🎯
				</div>
				<h3 class="font-semibold text-text-primary mb-2">{$t('parent.portal.view_achievements')}</h3>
				<p class="text-sm text-text-secondary">{$t('parent.portal.view_achievements_desc')}</p>
			</Card>

			<Card variant="elevated" padding="md" class="text-center">
				<div class="w-12 h-12 bg-surface-brand rounded-lg flex items-center justify-center mx-auto mb-4">
					🔗
				</div>
				<h3 class="font-semibold text-text-primary mb-2">{$t('parent.portal.link_children')}</h3>
				<p class="text-sm text-text-secondary">{$t('parent.portal.link_children_desc')}</p>
			</Card>
		</div>
	</div>
</div>