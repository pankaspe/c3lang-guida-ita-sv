<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ShortcutList from './ShortcutList.svelte';
	import { panels } from '$lib/shortcuts.svelte';
	import { t } from '$lib/i18n/index.svelte';

	const close = () => panels.close();
</script>

<Modal open={panels.open === 'shortcuts'} onclose={close} label={t('shortcuts.title')} class="w-[min(32rem,calc(100vw-2rem))]">
	<div class="flex max-h-[inherit] flex-col">
		<header class="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
			<h2 class="flex items-center gap-2 font-sans text-lg font-semibold text-ink">
				<Icon name="keyboard" class="size-5 text-accent" />
				{t('shortcuts.title')}
			</h2>
			<button
				type="button"
				onclick={close}
				class="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
				aria-label={t('common.close')}
				title={t('common.close')}
			>
				<Icon name="x" class="size-4" />
			</button>
		</header>
		<div class="min-h-0 overflow-y-auto overscroll-contain px-5 py-5">
			<p class="mb-5 font-sans text-sm text-ink-soft">{t('shortcuts.intro')}</p>
			<ShortcutList />
		</div>
	</div>
</Modal>
