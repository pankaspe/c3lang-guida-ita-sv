<script lang="ts">
	import { lessonPath, modulePath } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';

	let { data } = $props();

	const { module, lesson, previous, next, headings } = $derived(data);
	const Content = $derived(data.content);
	const done = $derived(progress.isCompleted(lesson.id));
	const position = $derived(module.lessons.findIndex((item) => item.id === lesson.id) + 1);
</script>

<svelte:head>
	<title>{lesson.meta.title} · {module.meta.title} · Impara C3</title>
	<meta name="description" content={lesson.meta.description} />
</svelte:head>

<div class="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
	<!-- Module navigation -->
	<aside class="lg:sticky lg:top-20 lg:self-start">
		<details class="group rounded-lg border border-line bg-surface lg:border-0 lg:bg-transparent" open>
			<summary
				class="cursor-pointer list-none px-4 py-3 font-sans text-xs font-semibold tracking-wide text-muted uppercase lg:cursor-default lg:px-0 lg:py-0"
			>
				<span class="mr-1 inline-block transition group-open:rotate-90 lg:hidden" aria-hidden="true">▸</span>
				<a href={modulePath(module)} class="hover:text-ink">{module.meta.emoji} {module.meta.title}</a>
			</summary>
			<ol class="grid gap-0.5 border-t border-line px-2 py-2 lg:mt-3 lg:border-0 lg:p-0">
				{#each module.lessons as item (item.id)}
					{@const active = item.id === lesson.id}
					{@const completed = progress.isCompleted(item.id)}
					<li>
						<a
							href={lessonPath(item)}
							aria-current={active ? 'page' : undefined}
							class={[
								'flex items-center gap-2 rounded-md px-2 py-1.5 font-sans text-sm transition',
								active ? 'bg-accent-soft font-semibold text-ink' : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
							]}
						>
							<span
								class={[
									'grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px]',
									completed ? 'bg-success text-paper' : 'border border-line text-muted'
								]}>{completed ? '✓' : item.order}</span
							>
							<span class="truncate">{item.meta.title}</span>
						</a>
					</li>
				{/each}
			</ol>
		</details>
	</aside>

	<!-- Lesson -->
	<article class="min-w-0">
		<header class="mb-8">
			<p class="font-sans text-xs text-muted">
				Lezione {position} di {module.lessons.length} · {lesson.meta.minutes} min di lettura
			</p>
			<h1 class="mt-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
				{lesson.meta.title}
			</h1>
			<p class="mt-3 font-serif text-lg leading-relaxed text-ink-soft">{lesson.meta.description}</p>
		</header>

		<Content />

		<!-- Completion + pager -->
		<footer class="mt-14 border-t border-line pt-6">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<button
					type="button"
					onclick={() => progress.toggle(lesson.id)}
					class={[
						'inline-flex items-center gap-2 rounded-md border px-4 py-2 font-sans text-sm font-semibold transition',
						done
							? 'border-success bg-success-soft text-ink'
							: 'border-accent bg-accent text-accent-ink hover:opacity-90'
					]}
				>
					{done ? '✓ Lezione completata' : 'Segna come completata'}
				</button>
				{#if done && next}
					<span class="font-sans text-sm text-muted">Bravo! Pronto per la prossima?</span>
				{/if}
			</div>

			<nav class="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Lezione precedente e successiva">
				{#if previous}
					<a
						href={lessonPath(previous)}
						class="group rounded-lg border border-line bg-surface p-4 transition hover:border-accent"
					>
						<span class="font-sans text-xs text-muted">← Precedente</span>
						<span class="mt-1 block font-sans font-semibold text-ink group-hover:text-accent"
							>{previous.meta.title}</span
						>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if next}
					<a
						href={lessonPath(next)}
						class="group rounded-lg border border-line bg-surface p-4 text-right transition hover:border-accent"
					>
						<span class="font-sans text-xs text-muted">Successiva →</span>
						<span class="mt-1 block font-sans font-semibold text-ink group-hover:text-accent"
							>{next.meta.title}</span
						>
					</a>
				{:else}
					<a
						href="/"
						class="rounded-lg border border-line bg-surface p-4 text-right font-sans text-sm text-muted transition hover:border-accent"
					>
						Hai finito le lezioni disponibili. Torna ai moduli →
					</a>
				{/if}
			</nav>
		</footer>
	</article>

	<!-- Table of contents -->
	{#if headings.length}
		<aside class="hidden xl:block xl:sticky xl:top-20 xl:self-start">
			<p class="font-sans text-xs font-semibold tracking-wide text-muted uppercase">In questa lezione</p>
			<ol class="mt-3 grid gap-1 border-l border-line">
				{#each headings as heading (heading.id)}
					<li>
						<a
							href="#{heading.id}"
							class={[
								'-ml-px block border-l border-transparent py-0.5 pr-2 font-sans text-[13px] leading-snug text-muted transition hover:border-accent hover:text-ink',
								heading.depth === 2 ? 'pl-3' : 'pl-6'
							]}>{heading.text}</a
						>
					</li>
				{/each}
			</ol>
		</aside>
	{/if}
</div>
