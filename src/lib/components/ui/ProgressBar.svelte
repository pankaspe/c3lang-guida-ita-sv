<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	interface Props {
		value: number;
		max: number;
		/** Show "value/max" next to the bar. */
		label?: boolean;
	}

	let { value, max, label = true }: Props = $props();

	const percent = $derived(max === 0 ? 0 : Math.round((value / max) * 100));
	const complete = $derived(max > 0 && value >= max);
</script>

<div class="flex items-center gap-3 font-sans text-xs text-muted">
	<div
		class="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"
		role="progressbar"
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={max}
	>
		<div
			class="h-full rounded-full transition-[width] duration-500 {complete ? 'bg-success' : 'bg-accent'}"
			style:width="{percent}%"
		></div>
	</div>
	{#if label}
		<span class="inline-flex items-center gap-1 tabular-nums"
			>{value}/{max}{#if complete}<Icon name="award" class="size-3.5 text-success" />{/if}</span
		>
	{/if}
</div>
