<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		open: boolean;
		/** Called when the dialog asks to close (Esc, backdrop click, close button). */
		onclose: () => void;
		/** Accessible name of the dialog. */
		label: string;
		/** Classes of the dialog box (size, radius...). */
		class?: ClassValue;
		children: Snippet;
	}

	let { open, onclose, label, class: className, children }: Props = $props();

	let dialog: HTMLDialogElement;

	// Native modal <dialog>: focus trap, Esc and the top layer come for free.
	$effect(() => {
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});
</script>

<!-- The dialog box has no padding, so a click on the dialog itself is a click on the backdrop. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	aria-label={label}
	class={['modal', className]}
	onclose={() => open && onclose()}
	onclick={(event) => event.target === dialog && onclose()}
>
	{#if open}
		{@render children()}
	{/if}
</dialog>
