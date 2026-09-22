<script lang="ts">
	import type { Snippet } from 'svelte';
	import { normaliseOutput } from '$lib/markdown/inline';

	/**
	 * "Outside the app" exercise: the learner writes and runs code on their
	 * machine, then comes back and types what the program printed.
	 * If `expected` is omitted the exercise is a simple self-check ("done").
	 *
	 * <Exercise title="Saluta il mondo" expected={'Ciao, mondo!'}>
	 *   Istruzioni in markdown...
	 * </Exercise>
	 */
	interface Props {
		title: string;
		/** Exact expected program output. Trailing whitespace is ignored. */
		expected?: string;
		/** Label above the answer box; defaults to a generic prompt. */
		prompt?: string;
		children: Snippet;
	}

	let { title, expected, prompt = 'Cosa ha stampato il programma?', children }: Props = $props();

	let answer = $state('');
	let checked = $state(false);
	let done = $state(false);

	const isCorrect = $derived(
		expected !== undefined && normaliseOutput(answer) === normaliseOutput(expected)
	);
	const multiline = $derived((expected ?? '').includes('\n'));

	function check() {
		checked = true;
	}

	function retry() {
		checked = false;
		answer = '';
	}
</script>

<section
	class="exercise not-prose my-8 rounded-lg border-2 border-dashed border-accent/60 bg-surface p-5"
>
	<p class="mb-1 font-sans text-xs font-semibold tracking-wide text-accent uppercase">
		🛠️ Esercizio · sul tuo computer
	</p>
	<h4 class="mb-3 font-sans text-lg font-semibold text-ink">{title}</h4>

	<div class="lesson-prose prose-sm max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
		{@render children()}
	</div>

	<div class="mt-5 border-t border-line pt-4">
		{#if expected !== undefined}
			<label class="block font-sans text-sm font-medium text-ink">
				{prompt}
				{#if multiline}
					<textarea
						bind:value={answer}
						rows={Math.min(8, expected.split('\n').length + 1)}
						disabled={checked && isCorrect}
						spellcheck="false"
						class="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none"
						placeholder="Incolla qui l'output, riga per riga"
					></textarea>
				{:else}
					<input
						type="text"
						bind:value={answer}
						disabled={checked && isCorrect}
						spellcheck="false"
						onkeydown={(event) => event.key === 'Enter' && check()}
						class="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none"
						placeholder="Scrivi qui l'output"
					/>
				{/if}
			</label>

			<div class="mt-3 flex flex-wrap items-center gap-3">
				{#if !(checked && isCorrect)}
					<button
						type="button"
						onclick={check}
						disabled={answer.trim() === ''}
						class="rounded-md bg-accent px-4 py-1.5 font-sans text-sm font-semibold text-accent-ink transition hover:opacity-90 disabled:opacity-40"
					>
						Verifica
					</button>
				{/if}
				{#if checked}
					{#if isCorrect}
						<span class="font-sans text-sm font-semibold text-success">🏆 Perfetto, è proprio così!</span>
					{:else}
						<span class="font-sans text-sm font-semibold text-danger">Non coincide.</span>
						<span class="font-sans text-sm text-muted">
							Riesegui il programma e confronta con calma, spazi inclusi.
						</span>
						<button
							type="button"
							onclick={retry}
							class="font-sans text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
						>
							Ricomincia
						</button>
					{/if}
				{/if}
			</div>
		{:else}
			<label class="flex cursor-pointer items-center gap-3 font-sans text-sm font-medium text-ink">
				<input type="checkbox" bind:checked={done} class="size-4 accent-[var(--accent)]" />
				{done ? '🏆 Fatto! Avanti così.' : 'Segna come fatto quando hai finito'}
			</label>
		{/if}
	</div>
</section>
