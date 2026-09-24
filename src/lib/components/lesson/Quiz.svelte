<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';
	import { renderInline } from '$lib/markdown/inline';
	import { activity, shortHash } from '$lib/state/activity.svelte';
	import { currentLessonId } from '$lib/content/lesson-context';
	import { feedback } from '$lib/feedback';
	import { t } from '$lib/i18n/index.svelte';

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

	const lessonId = currentLessonId();

	function pick(index: number) {
		picked = index;
		const correct = index === answer;
		feedback(correct ? 'success' : 'error');
		// Only the first attempt counts towards the profile's accuracy.
		if (lessonId) activity.recordQuiz(`${lessonId}::${shortHash(question)}`, correct);
	}

	function reset() {
		picked = null;
	}
</script>

<section class="quiz not-prose my-8 rounded-lg border border-line bg-surface p-5 shadow-sm">
	<p class="mb-1 flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wide text-accent uppercase">
		<Icon name="help" class="size-4" />
		{t('quiz.label')}
	</p>
	<p class="mb-4 font-sans text-base font-medium text-ink">{@html renderInline(question)}</p>

	<ul class="grid gap-2">
		{#each options as option, index (option)}
			{@const state =
				!answered ? 'idle' : index === answer ? 'correct' : index === picked ? 'wrong' : 'dim'}
			<li>
				<button
					type="button"
					disabled={answered}
					onclick={() => pick(index)}
					class={[
						'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left font-sans text-sm transition',
						state === 'idle' && 'border-line bg-paper hover:border-accent hover:bg-accent-soft',
						state === 'correct' && 'border-success bg-success-soft text-ink',
						state === 'wrong' && 'anim-shake border-danger bg-danger-soft text-ink',
						state === 'dim' && 'border-line bg-paper text-muted opacity-70'
					]}
				>
					<span
						class="grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-xs"
					>
						{#if state === 'correct'}<Icon name="check" class={['size-3.5 text-success', index === picked && 'anim-draw']} />{:else if state === 'wrong'}<Icon name="x" class="anim-pop size-3.5 text-danger" />{:else}{String.fromCharCode(
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
			class="anim-rise mt-4 rounded-md border px-4 py-3 text-sm {isCorrect
				? 'border-success bg-success-soft'
				: 'border-danger bg-danger-soft'}"
		>
			<p class="flex items-center gap-1.5 font-sans font-semibold text-ink">
				<Icon name={isCorrect ? 'target' : 'help'} class={['anim-pop size-4', isCorrect ? 'text-success' : 'text-danger']} />
				{isCorrect ? t('quiz.correct') : t('quiz.wrong')}
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
				{t('quiz.retry')}
			</button>
		</div>
	{/if}
</section>
