<script lang="ts">
	import type { Snippet } from 'svelte';

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

	const presets: Record<Kind, { icon: string; label: string; classes: string }> = {
		tip: { icon: '💡', label: 'Consiglio', classes: 'border-success bg-success-soft' },
		note: { icon: '📝', label: 'Nota', classes: 'border-info bg-info-soft' },
		warning: { icon: '⚠️', label: 'Attenzione', classes: 'border-warning bg-warning-soft' },
		fun: { icon: '🎉', label: 'Curiosità', classes: 'border-fun bg-fun-soft' },
		c: { icon: '🧓', label: 'Se vieni dal C', classes: 'border-accent bg-accent-soft' },
		deep: { icon: '🔬', label: 'Approfondimento', classes: 'border-muted bg-surface-2' },
		nerd: { icon: '🤓', label: 'Dettagli nerd', classes: 'border-nerd bg-nerd-soft' }
	};

	const preset = $derived(presets[type]);
</script>

{#if type === 'nerd'}
	<details class="callout group my-6 rounded-r-lg border-l-4 {preset.classes}" data-type={type}>
		<summary
			class="not-prose flex cursor-pointer list-none items-start gap-3 px-5 py-3 font-sans select-none [&::-webkit-details-marker]:hidden"
		>
			<span class="text-lg leading-6" aria-hidden="true">{preset.icon}</span>
			<span class="min-w-0 flex-1">
				<span class="block font-mono text-[11px] font-semibold tracking-wider text-nerd uppercase">{preset.label}</span>
				{#if title}<span class="block text-sm font-semibold text-ink">{title}</span>{/if}
			</span>
			<span
				class="mt-0.5 shrink-0 font-mono text-xs text-muted transition group-open:rotate-90"
				aria-hidden="true">▶</span
			>
		</summary>
		<div class="callout-body px-5 pb-4 text-[0.95em] [&>:first-child]:mt-0 [&>:last-child]:mb-0">
			{@render children()}
		</div>
	</details>
{:else}
	<aside class="callout my-6 rounded-r-lg border-l-4 px-5 py-4 {preset.classes}" data-type={type}>
		<p class="not-prose mb-1 flex items-center gap-2 font-sans text-sm font-semibold text-ink">
			<span aria-hidden="true">{preset.icon}</span>
			{title ?? preset.label}
		</p>
		<div class="callout-body text-[0.95em] [&>:first-child]:mt-0 [&>:last-child]:mb-0">
			{@render children()}
		</div>
	</aside>
{/if}
