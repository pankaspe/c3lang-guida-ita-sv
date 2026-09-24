<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { settings } from '$lib/state/settings.svelte';
	import { t } from '$lib/i18n/index.svelte';

	const isDark = $derived(settings.isDark);
</script>

<button
	type="button"
	onclick={() => settings.toggleDark()}
	class="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition hover:text-ink hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
	aria-label={isDark ? t('nav.toLight') : t('nav.toDark')}
	title={isDark ? t('nav.lightTheme') : t('nav.darkTheme')}
>
	<Icon name={isDark ? 'sun' : 'moon'} class="size-4" />
</button>
