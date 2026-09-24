<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';

	/** One labelled setting: title and description on the left, control on the right (stacked on mobile). */
	interface Props {
		icon: IconName;
		title: string;
		description?: string;
		children: Snippet;
	}

	let { icon, title, description, children }: Props = $props();
</script>

<div class="flex flex-col gap-3 border-b border-line py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
	<div class="flex min-w-0 gap-3">
		<Icon name={icon} class="mt-0.5 size-5 text-muted" />
		<div class="min-w-0">
			<p class="font-sans text-sm font-semibold text-ink">{title}</p>
			{#if description}
				<p class="mt-0.5 font-sans text-sm text-muted">{description}</p>
			{/if}
		</div>
	</div>
	<div class="shrink-0 pl-8 sm:pl-0">
		{@render children()}
	</div>
</div>
