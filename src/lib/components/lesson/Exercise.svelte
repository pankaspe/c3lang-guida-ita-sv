<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';
	import { normaliseOutput } from '$lib/markdown/inline';
	import { activity, shortHash } from '$lib/state/activity.svelte';
	import { currentLessonId } from '$lib/content/lesson-context';
	import { feedback } from '$lib/feedback';
	import { i18n, t } from '$lib/i18n/index.svelte';

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

	let { title, expected, prompt, children }: Props = $props();

	let answer = $state('');
	let checked = $state(false);
	let done = $state(false);

	const isCorrect = $derived(
		expected !== undefined && normaliseOutput(answer) === normaliseOutput(expected)
	);
	const multiline = $derived((expected ?? '').includes('\n'));

	const lessonId = currentLessonId();
	const key = $derived(lessonId ? `${lessonId}::ex::${shortHash(title)}` : null);
	/** Day this exercise was first solved, from the activity log. */
	const solvedOn = $derived(key ? activity.exercises[key] : undefined);

	function solved() {
		feedback('success');
		if (key) activity.recordExercise(key);
	}

	function check() {
		checked = true;
		if (isCorrect) solved();
		else feedback('error');
	}

	function toggleDone() {
		if (done) solved();
	}

	function retry() {
		checked = false;
		answer = '';
	}
</script>

<section
	class="exercise not-prose my-8 rounded-lg border-2 border-dashed border-accent/60 bg-surface p-5"
>
	<p class="mb-1 flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wide text-accent uppercase">
		<Icon name="terminal" class="size-4" />
		{t('exercise.label')}
	</p>
	<div class="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
		<h4 class="font-sans text-lg font-semibold text-ink">{title}</h4>
		{#if solvedOn}
			<span class="inline-flex items-center gap-1 font-mono text-xs text-success">
				<Icon name="check" class="size-3.5" />
				{t('exercise.solvedOn', { date: i18n.date(new Date(`${solvedOn}T12:00:00`), { dateStyle: 'short' }) })}
			</span>
		{/if}
	</div>

	<div class="lesson-prose prose-sm max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
		{@render children()}
	</div>

	<div class="mt-5 border-t border-line pt-4">
		{#if expected !== undefined}
			<label class="block font-sans text-sm font-medium text-ink">
				{prompt ?? t('exercise.prompt')}
				{#if multiline}
					<textarea
						bind:value={answer}
						oninput={() => (checked = false)}
						rows={Math.min(8, expected.split('\n').length + 1)}
						disabled={checked && isCorrect}
						spellcheck="false"
						class="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none"
						placeholder={t('exercise.placeholderMultiline')}
					></textarea>
				{:else}
					<input
						type="text"
						bind:value={answer}
						oninput={() => (checked = false)}
						disabled={checked && isCorrect}
						spellcheck="false"
						onkeydown={(event) => event.key === 'Enter' && check()}
						class="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-accent focus:ring-2 focus:ring-accent/40 focus:outline-none"
						placeholder={t('exercise.placeholder')}
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
						{t('exercise.check')}
					</button>
				{/if}
				{#if checked}
					{#if isCorrect}
						<span class="anim-rise inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-success"
							><Icon name="award" class="anim-pop size-4" />
							{t('exercise.success')}</span
						>
					{:else}
						<span class="anim-shake font-sans text-sm font-semibold text-danger">{t('exercise.mismatch')}</span>
						<span class="font-sans text-sm text-muted">
							{t('exercise.mismatchHint')}
						</span>
						<button
							type="button"
							onclick={retry}
							class="font-sans text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
						>
							{t('exercise.retry')}
						</button>
					{/if}
				{/if}
			</div>
		{:else}
			<label class="flex cursor-pointer items-center gap-3 font-sans text-sm font-medium text-ink">
				<input type="checkbox" bind:checked={done} onchange={toggleDone} class="size-4 accent-[var(--accent)]" />
				{#if done}<Icon name="award" class="anim-pop size-4 text-success" />
					{t('exercise.done')}{:else}{t('exercise.markDone')}{/if}
			</label>
		{/if}
	</div>
</section>
