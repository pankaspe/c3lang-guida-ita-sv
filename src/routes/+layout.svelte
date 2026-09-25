<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/ui/SiteHeader.svelte';
	import SiteFooter from '$lib/components/ui/SiteFooter.svelte';
	import CheatSheet from '$lib/components/cheatsheet/CheatSheet.svelte';
	import ShortcutsDialog from '$lib/components/shortcuts/ShortcutsDialog.svelte';
	import { handleShortcut } from '$lib/shortcuts.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { settings } from '$lib/state/settings.svelte';
	import { activity } from '$lib/state/activity.svelte';
	import { profile } from '$lib/state/profile.svelte';

	let { children } = $props();

	// Browser-only state is read after hydration so SSR output stays deterministic.
	$effect(() => {
		progress.load();
		activity.load();
		profile.load();
		settings.sync();
	});
</script>

<svelte:window onkeydown={handleShortcut} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<CheatSheet />
<ShortcutsDialog />
