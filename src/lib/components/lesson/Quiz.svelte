<script lang="ts">
	import type { Snippet } from 'svelte';
	import { renderInline } from '$lib/markdown/inline';

	/**
	 * In-app multiple-choice check. The learner picks an option, gets
	 * immediate feedback, and can read the explanation (children).
	 *
	 * <Quiz question="Cosa stampa `io::printn(7 / 2)`?" options={['3.5', '3']} answer={1}>
	 *   Spiegazione in markdown...
	 * </Quiz>
	 */
	interface Props {
		question: string;
		options: string[];
		/** Zero-based index of the correct option. */
		answer: number;
		children?: Snippet;
	}

	let { question, options, answer, children }: Props = $props();

	let picked = $state<number | null>(null);
	const isCorrect = $derived(picked !== null && picked === answer);
	const answered = $derived(picked !== null);

	function reset() {
		picked = null;
	}
</script>

<section class="quiz not-prose my-8 rounded-lg border border-line bg-surface p-5 shadow-sm">
	<p class="mb-1 font-sans text-xs font-semibold tracking-wide text-accent uppercase">✏️ Quiz</p>
	<p class="mb-4 font-sans text-base font-medium text-ink">{@html renderInline(question)}</p>

	<ul class="grid gap-2">
		{#each options as option, index (option)}
			{@const state =
				!answered ? 'idle' : index === answer ? 'correct' : index === picked ? 'wrong' : 'dim'}
			<li>
				<button
					type="button"
					disabled={answered}
					onclick={() => (picked = index)}
					class={[
						'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left font-sans text-sm transition',
						state === 'idle' && 'border-line bg-paper hover:border-accent hover:bg-accent-soft',
						state === 'correct' && 'border-success bg-success-soft text-ink',
						state === 'wrong' && 'border-danger bg-danger-soft text-ink',
						state === 'dim' && 'border-line bg-paper text-muted opacity-70'
					]}
				>
					<span
						class="grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-xs"
					>
						{#if state === 'correct'}✓{:else if state === 'wrong'}✗{:else}{String.fromCharCode(
								65 + index
							)}{/if}
					</span>
					<span>{@html renderInline(option)}</span>
				</button>
			</li>
		{/each}
	</ul>

	{#if answered}
		<div
			class="mt-4 rounded-md border px-4 py-3 text-sm {isCorrect
				? 'border-success bg-success-soft'
				: 'border-danger bg-danger-soft'}"
		>
			<p class="font-sans font-semibold text-ink">
				{isCorrect ? '🎯 Esatto!' : '🤔 Non proprio.'}
			</p>
			{#if children}
				<div class="lesson-prose prose-sm mt-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
					{@render children()}
				</div>
			{/if}
			<button
				type="button"
				onclick={reset}
				class="mt-3 font-sans text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
			>
				Riprova
			</button>
		</div>
	{/if}
</section>
