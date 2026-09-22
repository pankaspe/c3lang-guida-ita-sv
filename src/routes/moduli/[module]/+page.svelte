<script lang="ts">
	import { lessonPath } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	let { data } = $props();

	const module = $derived(data.module);
	const ids = $derived(module.lessons.map((lesson) => lesson.id));
	const completed = $derived(progress.countCompleted(ids));
	const totalMinutes = $derived(module.lessons.reduce((sum, lesson) => sum + lesson.meta.minutes, 0));
</script>

<svelte:head>
	<title>{module.meta.title} · Impara C3</title>
	<meta name="description" content={module.meta.subtitle} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<nav class="mb-6 font-sans text-xs text-muted" aria-label="Percorso">
		<a href="/" class="hover:text-ink">Moduli</a>
		<span class="mx-1.5" aria-hidden="true">›</span>
		<span>Modulo {module.order}</span>
	</nav>

	<header class="mb-8">
		<div class="flex items-center gap-3">
			<span class="text-4xl" aria-hidden="true">{module.meta.emoji}</span>
			<h1 class="font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
				{module.meta.title}
			</h1>
		</div>
		<p class="mt-3 font-serif text-lg leading-relaxed text-ink-soft">{module.meta.subtitle}</p>
		<p class="mt-2 font-sans text-xs text-muted">
			{module.lessons.length} lezioni · circa {totalMinutes} minuti di lettura · livello {module.meta.level.toLowerCase()}
		</p>
		<div class="mt-4">
			<ProgressBar value={completed} max={ids.length} />
		</div>
	</header>

	{#if module.meta.goals.length}
		<section class="mb-8 rounded-lg border border-line bg-surface p-5">
			<h2 class="font-sans text-sm font-semibold tracking-wide text-muted uppercase">
				Alla fine saprai
			</h2>
			<ul class="mt-2 grid gap-1.5 font-serif text-[0.95rem] text-ink-soft">
				{#each module.meta.goals as goal (goal)}
					<li class="flex gap-2"><span class="text-success" aria-hidden="true">✓</span>{goal}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<ol class="grid gap-2">
		{#each module.lessons as lesson (lesson.id)}
			{@const done = progress.isCompleted(lesson.id)}
			<li>
				<a
					href={lessonPath(lesson)}
					class="flex items-center gap-4 rounded-lg border border-line bg-surface px-4 py-3 transition hover:border-accent hover:bg-accent-soft/40"
				>
					<span
						class={[
							'grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm',
							done ? 'bg-success text-paper' : 'border border-line bg-paper text-muted'
						]}
					>
						{done ? '✓' : lesson.order}
					</span>
					<span class="min-w-0 flex-1">
						<span class="block font-sans font-semibold text-ink">{lesson.meta.title}</span>
						<span class="block truncate font-serif text-sm text-muted">{lesson.meta.description}</span>
					</span>
					<span class="shrink-0 font-sans text-xs text-muted">{lesson.meta.minutes} min</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
