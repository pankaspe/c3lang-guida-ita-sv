<script lang="ts">
	import { modules, modulePath, lessonPath } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	function completedIn(lessonIds: string[]) {
		return progress.countCompleted(lessonIds);
	}

	/** First lesson not yet completed, so "Continua" lands in the right place. */
	const nextLesson = $derived(
		modules.flatMap((module) => module.lessons).find((lesson) => !progress.isCompleted(lesson.id))
	);
</script>

<svelte:head>
	<title>Impara C3 · un percorso dal C al C3</title>
	<meta
		name="description"
		content="Corso interattivo in italiano per imparare il linguaggio C3, dalle basi ai concetti avanzati."
	/>
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6">
	<p class="font-mono text-sm text-accent">import std::io;</p>
	<h1 class="mt-2 max-w-2xl font-sans text-4xl font-bold tracking-tight text-ink sm:text-5xl">
		Impara C3, un passo alla volta.
	</h1>
	<p class="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-ink-soft">
		C3 è l'evoluzione del C: stessa filosofia, meno trappole, più strumenti. Questo percorso ti
		porta da zero a programmatore, con lezioni brevi, quiz nell'app ed esercizi da fare sul tuo
		computer. Niente sandbox: il compilatore vero è il miglior insegnante.
	</p>
	{#if nextLesson}
		<a
			href={lessonPath(nextLesson)}
			class="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-accent-ink shadow-sm transition hover:opacity-90"
		>
			{progress.completed.size > 0 ? 'Continua da dove eri' : 'Inizia il percorso'} →
		</a>
	{/if}
</section>

<section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
	<h2 class="mb-4 font-sans text-sm font-semibold tracking-wide text-muted uppercase">Moduli</h2>
	<ol class="grid gap-4 sm:grid-cols-2">
		{#each modules as module (module.slug)}
			{@const ids = module.lessons.map((lesson) => lesson.id)}
			<li>
				<a
					href={modulePath(module)}
					class="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
				>
					<div class="flex items-start justify-between gap-3">
						<span class="text-3xl" aria-hidden="true">{module.meta.emoji}</span>
						<span
							class="rounded-full border border-line bg-paper px-2 py-0.5 font-sans text-[11px] font-medium text-muted"
						>
							{module.meta.level}
						</span>
					</div>
					<h3 class="mt-3 font-sans text-lg font-semibold text-ink group-hover:text-accent">
						<span class="mr-1.5 font-mono text-sm text-muted">{String(module.order).padStart(2, '0')}</span>
						{module.meta.title}
					</h3>
					<p class="mt-1 flex-1 font-serif text-sm leading-relaxed text-ink-soft">
						{module.meta.subtitle}
					</p>
					<div class="mt-4">
						<ProgressBar value={completedIn(ids)} max={ids.length} />
					</div>
				</a>
			</li>
		{/each}
		<li
			class="flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-line p-5 text-center font-sans text-sm text-muted"
		>
			Altri moduli in arrivo…
		</li>
	</ol>
</section>
