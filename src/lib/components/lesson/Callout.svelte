<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';
	import type { IconName } from '$lib/components/ui/Icon.svelte';
	import { activity } from '$lib/state/activity.svelte';
	import { currentLessonId } from '$lib/content/lesson-context';
	import { feedback } from '$lib/feedback';
	import { t } from '$lib/i18n/index.svelte';

	/**
	 * Boxed aside used inside lessons.
	 *  tip      – practical advice
	 *  note     – extra detail worth knowing
	 *  warning  – common mistake / gotcha
	 *  fun      – trivia, humour, motivation
	 *  c        – "for those coming from C" comparisons
	 *  deep     – optional deep dive, safe to skip
	 *  nerd     – how the computer works under the hood (buffer, RAM, bits...);
	 *             collapsed by default, `title` should be the question it answers
	 */
	type Kind = 'tip' | 'note' | 'warning' | 'fun' | 'c' | 'deep' | 'nerd';

	interface Props {
		type?: Kind;
		title?: string;
		children: Snippet;
	}

	let { type = 'note', title, children }: Props = $props();

	const presets: Record<Kind, { icon: IconName; classes: string; tone: string }> = {
		tip: { icon: 'lightbulb', classes: 'border-success bg-success-soft', tone: 'text-success' },
		note: { icon: 'info', classes: 'border-info bg-info-soft', tone: 'text-info' },
		warning: { icon: 'warning', classes: 'border-warning bg-warning-soft', tone: 'text-warning' },
		fun: { icon: 'sparkles', classes: 'border-fun bg-fun-soft', tone: 'text-fun' },
		c: { icon: 'history', classes: 'border-accent bg-accent-soft', tone: 'text-accent' },
		deep: { icon: 'layers', classes: 'border-muted bg-surface-2', tone: 'text-muted' },
		nerd: { icon: 'cpu', classes: 'border-nerd bg-nerd-soft', tone: 'text-nerd' }
	};

	const preset = $derived(presets[type]);
	const label = $derived(t(`callout.${type}`));
	const lessonId = currentLessonId();

	function opened(event: Event) {
		if (!(event.currentTarget as HTMLDetailsElement).open) return;
		feedback('tap');
		if (lessonId) activity.recordNerd(`${lessonId}::${title ?? ''}`);
	}
</script>

{#if type === 'nerd'}
	<details class="callout group my-6 rounded-r-lg border-l-4 {preset.classes}" data-type={type} ontoggle={opened}>
		<summary
			class="not-prose flex cursor-pointer list-none items-start gap-3 px-5 py-3 font-sans select-none [&::-webkit-details-marker]:hidden"
		>
			<Icon name={preset.icon} class="mt-0.5 size-5 {preset.tone}" />
			<span class="min-w-0 flex-1">
				<span class="block font-mono text-[11px] font-semibold tracking-wider text-nerd uppercase">{label}</span>
				{#if title}<span class="block text-sm font-semibold text-ink">{title}</span>{/if}
			</span>
			<Icon name="chevron-right" class="mt-1 size-4 text-muted transition group-open:rotate-90" />
		</summary>
		<div class="callout-body px-5 pb-4 text-[0.95em] [&>:first-child]:mt-0 [&>:last-child]:mb-0">
			{@render children()}
		</div>
	</details>
{:else}
	<aside class="callout my-6 rounded-r-lg border-l-4 px-5 py-4 {preset.classes}" data-type={type}>
		<p class="not-prose mb-1 flex items-center gap-2 font-sans text-sm font-semibold text-ink">
			<Icon name={preset.icon} class="size-4 {preset.tone}" />
			{title ?? label}
		</p>
		<div class="callout-body text-[0.95em] [&>:first-child]:mt-0 [&>:last-child]:mb-0">
			{@render children()}
		</div>
	</aside>
{/if}
