<!--
	mdsvex layout applied to every lesson (.svx). Components exported from the
	module script are available inside lessons without importing them.
-->
<script module lang="ts">
	export { default as CodeBlock } from '$lib/components/lesson/CodeBlock.svelte';
	export { default as Callout } from '$lib/components/lesson/Callout.svelte';
	export { default as Quiz } from '$lib/components/lesson/Quiz.svelte';
	export { default as Exercise } from '$lib/components/lesson/Exercise.svelte';
	export { default as Solution } from '$lib/components/lesson/Solution.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	// Frontmatter fields are forwarded as props too; the page shell renders
	// them, so only `children` is needed here.
	let { children }: { children: Snippet; [key: string]: unknown } = $props();
</script>

<div class="lesson-prose prose max-w-none">
	{@render children()}
</div>
