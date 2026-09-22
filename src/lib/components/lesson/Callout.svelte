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
	 */
	type Kind = 'tip' | 'note' | 'warning' | 'fun' | 'c' | 'deep';

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
		deep: { icon: '🔬', label: 'Approfondimento', classes: 'border-muted bg-surface-2' }
	};

	const preset = $derived(presets[type]);
</script>

<aside class="callout my-6 rounded-r-lg border-l-4 px-5 py-4 {preset.classes}" data-type={type}>
	<p class="not-prose mb-1 flex items-center gap-2 font-sans text-sm font-semibold text-ink">
		<span aria-hidden="true">{preset.icon}</span>
		{title ?? preset.label}
	</p>
	<div class="callout-body text-[0.95em] [&>:first-child]:mt-0 [&>:last-child]:mb-0">
		{@render children()}
	</div>
</aside>
