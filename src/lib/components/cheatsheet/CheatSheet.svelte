<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { afterNavigate } from '$app/navigation';
	import { panels } from '$lib/shortcuts.svelte';
	import { t } from '$lib/i18n/index.svelte';

	const open = $derived(panels.open === 'cheatsheet');
	const close = () => panels.close();

	afterNavigate(() => {
		if (open) close();
	});
</script>

<!-- Floating button: the cheat sheet is one click (or the K key) away on every page. -->
<button
	type="button"
	onclick={() => panels.toggle('cheatsheet')}
	aria-haspopup="dialog"
	aria-keyshortcuts="k"
	aria-label={t('cheatsheet.openAria')}
	title={t('cheatsheet.openAria')}
	class="fixed right-4 bottom-4 z-30 flex h-11 items-center gap-2 rounded-full border border-line bg-surface/85 pr-4 pl-3.5 font-sans text-sm font-medium text-ink-soft shadow-lg backdrop-blur transition hover:border-accent hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:right-6 sm:bottom-6 max-sm:w-11 max-sm:justify-center max-sm:p-0"
>
	<Icon name="scroll" class="size-4.5 text-accent" />
	<span class="max-sm:sr-only">{t('cheatsheet.open')}</span>
	<kbd class="kbd hidden sm:inline-block">K</kbd>
</button>

<Modal {open} onclose={close} label={t('cheatsheet.title')} class="modal-sheet w-[min(76rem,calc(100vw-2rem))]">
	{#await import('./CheatSheetBody.svelte')}
		<p class="p-8 text-center font-sans text-sm text-muted">{t('cheatsheet.loading')}</p>
	{:then { default: Body }}
		<Body onclose={close} />
	{/await}
</Modal>
