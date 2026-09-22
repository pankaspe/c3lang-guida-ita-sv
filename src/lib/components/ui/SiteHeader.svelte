<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { allLessons } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';

	const total = allLessons.length;
	const completed = $derived(progress.countCompleted(allLessons.map((lesson) => lesson.id)));
</script>

<header
	class="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
		<a href="/" class="group flex items-center gap-2.5 font-sans">
			<span
				class="grid size-8 place-items-center rounded-md bg-accent font-mono text-sm font-bold text-accent-ink"
				aria-hidden="true">C3</span
			>
			<span class="leading-tight">
				<span class="block text-sm font-semibold text-ink group-hover:text-accent">Impara C3</span>
				<span class="block text-[11px] text-muted">un percorso, non un manuale</span>
			</span>
		</a>

		<div class="flex items-center gap-3">
			{#if progress.loaded && total > 0}
				<span class="hidden font-sans text-xs text-muted tabular-nums sm:inline">
					{completed}/{total} lezioni
				</span>
			{/if}
			<ThemeToggle />
		</div>
	</div>
</header>
