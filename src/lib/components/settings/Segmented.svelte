<script lang="ts" generics="T extends string | number">
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';

	/** Radio group rendered as a segmented control. */
	interface Option {
		value: T;
		label: string;
		icon?: IconName;
	}

	interface Props {
		label: string;
		options: Option[];
		value: T;
		onchange: (value: T) => void;
	}

	let { label, options, value, onchange }: Props = $props();
</script>

<div class="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-line bg-surface p-1" role="radiogroup" aria-label={label}>
	{#each options as option (option.value)}
		{@const active = option.value === value}
		<button
			type="button"
			role="radio"
			aria-checked={active}
			onclick={() => onchange(option.value)}
			class={[
				'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-sm transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
				active ? 'bg-accent font-semibold text-accent-ink shadow-sm' : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
			]}
		>
			{#if option.icon}<Icon name={option.icon} class="size-4" />{/if}
			{option.label}
		</button>
	{/each}
</div>
