<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/ui/SiteHeader.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings } from '$lib/state/settings.svelte';
	import { activity } from '$lib/state/activity.svelte';
	import { profile } from '$lib/state/profile.svelte';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	// Browser-only state is read after hydration so SSR output stays deterministic.
	$effect(() => {
		progress.load();
		activity.load();
		profile.load();
		settings.sync();
	});

	// Animated page transitions where the browser supports them.
	onNavigate((navigation) => {
		if (!document.startViewTransition || settings.reducedMotion) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
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
		Corso non ufficiale · basato sulla documentazione di
		<a href="https://c3-lang.org" class="underline underline-offset-2 hover:text-ink">c3-lang.org</a>
		· aggiornato al 2026 ·
		<a href="/impostazioni" class="underline underline-offset-2 hover:text-ink">impostazioni</a>
	</footer>
</div>
