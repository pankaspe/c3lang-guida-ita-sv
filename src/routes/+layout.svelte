<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/ui/SiteHeader.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings } from '$lib/state/settings.svelte';
	import { activity } from '$lib/state/activity.svelte';
	import { profile } from '$lib/state/profile.svelte';
	import { course } from '$lib/content/course';
	import { t } from '$lib/i18n/index.svelte';

	let { children } = $props();

	// Browser-only state is read after hydration so SSR output stays deterministic.
	$effect(() => {
		progress.load();
		activity.load();
		profile.load();
		settings.sync();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<footer class="border-t border-line py-6 text-center font-sans text-xs text-muted">
		{course.footer} ·
		{#if course.docs}
			{t('footer.basedOn')}
			<a href={course.docs.url} class="underline underline-offset-2 hover:text-ink">{course.docs.label}</a> ·
		{/if}
		<a href="/settings" class="underline underline-offset-2 hover:text-ink">{t('footer.settings')}</a>
	</footer>
</div>
