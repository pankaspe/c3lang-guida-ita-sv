<script lang="ts">
	/** Accessible on/off switch. */
	interface Props {
		label: string;
		checked: boolean;
		onchange: (checked: boolean) => void;
	}

	let { label, checked, onchange }: Props = $props();
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	aria-label={label}
	onclick={() => onchange(!checked)}
	class={[
		'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
		checked ? 'border-accent bg-accent' : 'border-line bg-surface-2'
	]}
>
	<span
		class={[
			'inline-block size-4.5 rounded-full shadow-sm transition-transform duration-200',
			checked ? 'translate-x-5.5 bg-accent-ink' : 'translate-x-0.5 bg-muted'
		]}
	></span>
</button>
