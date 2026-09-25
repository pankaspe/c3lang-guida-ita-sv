<script lang="ts">
	import { NAMED_KEYS, SHORTCUTS, type NamedKey, type ShortcutGroup } from '$lib/shortcuts.svelte';
	import { t } from '$lib/i18n/index.svelte';

	const GROUPS: ShortcutGroup[] = ['global', 'lesson'];

	const label = (key: string) => (NAMED_KEYS.includes(key) ? t(`shortcuts.keys.${key as NamedKey}`) : key);
</script>

{#snippet combo(keys: string[])}
	<span class="inline-flex items-center gap-1">
		{#each keys as key, index (index)}
			{#if index > 0}<span class="text-muted">+</span>{/if}
			<kbd class="kbd">{label(key)}</kbd>
		{/each}
	</span>
{/snippet}

<div class="grid gap-5">
	{#each GROUPS as group (group)}
		<div>
			<h3 class="mb-2 font-mono text-[11px] font-semibold tracking-wider text-muted uppercase">
				{t(`shortcuts.groups.${group}`)}
			</h3>
			<dl class="divide-y divide-line rounded-lg border border-line bg-surface font-sans text-sm">
				{#each SHORTCUTS.filter((shortcut) => shortcut.group === group) as shortcut (shortcut.action)}
					<div class="flex items-center justify-between gap-4 px-4 py-2.5">
						<dt class="text-ink-soft">{t(`shortcuts.actions.${shortcut.action}`)}</dt>
						<dd class="flex shrink-0 items-center gap-2 text-xs">
							{@render combo(shortcut.keys)}
							{#if shortcut.alt}
								<span class="text-muted">/</span>
								{@render combo(shortcut.alt)}
							{/if}
						</dd>
					</div>
				{/each}
			</dl>
		</div>
	{/each}
</div>
