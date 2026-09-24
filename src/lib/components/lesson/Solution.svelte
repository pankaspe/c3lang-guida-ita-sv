<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';

	/** Collapsed block: the learner opens it only after trying on their own. */
	interface Props {
		title?: string;
		children: Snippet;
	}

	let { title = 'Mostra una soluzione', children }: Props = $props();
</script>

<details class="solution not-prose group my-6 rounded-lg border border-line bg-surface-2">
	<summary
		class="flex cursor-pointer list-none flex-wrap items-center gap-x-2 px-4 py-3 font-sans text-sm font-semibold text-ink select-none marker:hidden [&::-webkit-details-marker]:hidden"
	>
		<Icon name="chevron-right" class="size-4 text-muted transition group-open:rotate-90" />
		<Icon name="lock" class="size-4 text-muted" />
		{title}
		<span class="font-normal text-muted">(prima prova da solo!)</span>
	</summary>
	<div class="lesson-prose prose-sm max-w-none border-t border-line px-4 py-3 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
		{@render children()}
	</div>
</details>
