<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		lang: string;
		/** Optional file name shown as a tab, from ```c3 title="main.c3" */
		title?: string;
		children: Snippet;
	}

	let { lang, title, children }: Props = $props();

	let container: HTMLElement;
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const isOutput = $derived(lang === 'output');
	const label = $derived(title ?? (isOutput ? 'output' : lang === 'bash' ? 'terminale' : lang));

	async function copy() {
		const code = container.querySelector('code')?.textContent ?? '';
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard blocked (insecure context): nothing else to do.
		}
	}
</script>

<figure
	bind:this={container}
	class="code-block not-prose my-6 overflow-hidden rounded-lg border border-line bg-surface shadow-sm"
	data-lang={lang}
>
	<figcaption
		class="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted"
	>
		<span class="flex items-center gap-2">
			{#if isOutput}
				<Icon name="terminal" class="size-3.5" />
			{:else}
				<span class="inline-block size-2 rounded-full bg-accent" aria-hidden="true"></span>
			{/if}
			{label}
		</span>
		{#if !isOutput}
			<button
				type="button"
				onclick={copy}
				class="rounded px-2 py-0.5 font-sans text-[11px] font-medium text-muted transition hover:bg-surface hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
				aria-live="polite"
			>
				{copied ? '✓ Copiato' : 'Copia'}
			</button>
		{/if}
	</figcaption>
	{@render children()}
</figure>
