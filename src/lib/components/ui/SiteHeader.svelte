<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { page } from '$app/state';
	import ThemeToggle from './ThemeToggle.svelte';
	import { allLessons } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';

	const total = allLessons.length;
	const completed = $derived(progress.countCompleted(allLessons.map((lesson) => lesson.id)));
	const onSettings = $derived(page.url.pathname === '/impostazioni');
</script>

<header
	class="sticky top-0 z-20 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
		<a href="/" class="group flex items-center gap-2.5 font-sans">
			<span
				class="bg-brand grid size-8 place-items-center rounded-md font-mono text-sm font-bold text-white shadow-sm"
				aria-hidden="true">C3</span
			>
			<span class="leading-tight">
				<span class="block text-sm font-semibold text-ink group-hover:text-accent">Impara C3</span>
				<span class="hidden font-mono text-[11px] text-muted min-[400px]:block">un percorso, non un manuale</span>
			</span>
		</a>

		<div class="flex items-center gap-2 sm:gap-3">
			{#if progress.loaded && total > 0}
				<span class="hidden font-mono text-xs text-muted tabular-nums sm:inline">
					{completed}/{total} lezioni
				</span>
			{/if}
			<a
				href="/impostazioni"
				aria-current={onSettings ? 'page' : undefined}
				class={[
					'grid size-9 place-items-center rounded-full border bg-surface text-ink-soft transition hover:text-ink hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
					onSettings ? 'border-accent' : 'border-line'
				]}
				aria-label="Impostazioni di lettura"
				title="Impostazioni"
			>
				<Icon name="settings" class="size-4" />
			</a>
			<ThemeToggle />
		</div>
	</div>
	<div class="bg-brand h-px opacity-60" aria-hidden="true"></div>
</header>
