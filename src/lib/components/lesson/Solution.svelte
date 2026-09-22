<script lang="ts">
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
		class="cursor-pointer list-none px-4 py-3 font-sans text-sm font-semibold text-ink select-none marker:hidden"
	>
		<span class="mr-2 inline-block transition group-open:rotate-90" aria-hidden="true">▸</span>
		🔒 {title}
		<span class="ml-2 font-normal text-muted">(prima prova da solo!)</span>
	</summary>
	<div class="lesson-prose prose-sm max-w-none border-t border-line px-4 py-3 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
		{@render children()}
	</div>
</details>
