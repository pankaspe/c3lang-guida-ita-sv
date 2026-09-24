<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { settings } from '$lib/state/settings.svelte';

	const isDark = $derived(settings.isDark);
</script>

<button
	type="button"
	onclick={() => settings.toggleDark()}
	class="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition hover:text-ink hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
	aria-label={isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
	title={isDark ? 'Tema chiaro' : 'Tema scuro'}
>
	<Icon name={isDark ? 'sun' : 'moon'} class="size-4" />
</button>
