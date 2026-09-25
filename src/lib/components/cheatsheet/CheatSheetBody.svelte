<script lang="ts">
	// Loaded on demand the first time the cheat sheet opens: it pulls in Prism
	// and the cheat sheet data, which no page needs up front.
	import Icon, { isIconName } from '$lib/components/ui/Icon.svelte';
	import { Prism } from '$lib/markdown/prism-c3';
	import { renderInline } from '$lib/markdown/inline';
	import { cheatsheet, type CheatEntry } from '$lib/content/cheatsheet';
	import { lessonPath, modules } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		onclose: () => void;
	}

	let { onclose }: Props = $props();

	let query = $state('');

	/** Lesson id → where it lives, for the "seen in lesson 1.4" links. */
	const lessons = new Map(
		modules.flatMap((module) =>
			module.lessons.map((lesson) => [lesson.id, { lesson, number: `${module.order}.${lesson.order}` }] as const)
		)
	);

	function highlight(entry: CheatEntry): string {
		const lang = entry.lang ?? 'c3';
		return Prism.highlight(entry.code ?? '', Prism.languages[lang], lang);
	}

	function matches(entry: CheatEntry, needle: string): boolean {
		return [entry.term, entry.text, entry.code ?? ''].some((field) => field.toLowerCase().includes(needle));
	}

	const sections = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return cheatsheet.sections
			.map((section) => ({ ...section, entries: section.entries.filter((entry) => !needle || matches(entry, needle)) }))
			.filter((section) => section.entries.length > 0);
	});

	const count = $derived(sections.reduce((sum, section) => sum + section.entries.length, 0));
</script>

<div class="flex max-h-[inherit] flex-col">
	<header class="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line px-5 py-4 sm:px-6">
		<div class="flex min-w-0 flex-1 items-center gap-3">
			<span class="bg-brand grid size-9 shrink-0 place-items-center rounded-lg text-white" aria-hidden="true">
				<Icon name="scroll" class="size-4.5" />
			</span>
			<div class="min-w-0">
				<h2 class="flex items-center gap-2 font-sans text-lg font-semibold text-ink">
					{t('cheatsheet.title')}
					<kbd class="kbd hidden sm:inline-block">K</kbd>
				</h2>
				<p class="truncate font-sans text-xs text-muted">{t('cheatsheet.intro')}</p>
			</div>
		</div>
		<label class="relative order-last w-full sm:order-none sm:w-64">
			<span class="sr-only">{t('cheatsheet.searchLabel')}</span>
			<Icon name="search" class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
			<input
				type="search"
				bind:value={query}
				placeholder={t('cheatsheet.search')}
				spellcheck="false"
				autocomplete="off"
				{@attach (node) => node.focus()}
				class="w-full rounded-md border border-line bg-paper py-1.5 pr-3 pl-9 font-mono text-sm text-ink placeholder:text-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none"
			/>
		</label>
		<button
			type="button"
			onclick={onclose}
			class="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-soft transition hover:border-accent hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
			aria-label={t('common.close')}
			title={t('common.close')}
		>
			<Icon name="x" class="size-4" />
		</button>
	</header>

	<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
		<p class="sr-only" aria-live="polite">{t('cheatsheet.results', { count })}</p>
		{#if sections.length === 0}
			<p class="py-12 text-center font-sans text-sm text-muted">{t('cheatsheet.empty', { query: query.trim() })}</p>
		{:else}
			<div class="gap-6 md:columns-2 xl:columns-3">
				{#each sections as section (section.id)}
					<section class="mb-6 break-inside-avoid">
						<h3
							class="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider text-muted uppercase"
						>
							<Icon name={isIconName(section.icon) ? section.icon : 'code'} class="size-3.5 text-accent" />
							{section.title}
						</h3>
						<dl class="divide-y divide-line rounded-lg border border-line bg-surface">
							{#each section.entries as entry (entry.term)}
								{@const source = lessons.get(entry.lesson)}
								<div class="grid gap-1.5 px-3.5 py-3">
									<dt class="flex items-baseline justify-between gap-3">
										<span class="font-mono text-[13px] font-semibold text-ink">{entry.term}</span>
										{#if source}
											<a
												href={lessonPath(source.lesson)}
												onclick={onclose}
												class={[
													'shrink-0 rounded px-1.5 font-mono text-[10px] tabular-nums transition hover:bg-accent-soft hover:text-ink',
													progress.isCompleted(source.lesson.id) ? 'text-success' : 'text-muted'
												]}
												title={t('cheatsheet.lesson', { number: source.number, title: source.lesson.meta.title })}
												>{source.number}</a
											>
										{/if}
									</dt>
									{#if entry.code}
										<dd><pre class="cheat-code"><code>{@html highlight(entry)}</code></pre></dd>
									{/if}
									<dd class="cheat-text font-sans text-[13px] leading-relaxed text-ink-soft">{@html renderInline(entry.text)}</dd>
								</div>
							{/each}
						</dl>
					</section>
				{/each}
			</div>
		{/if}
	</div>

	<footer class="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-2.5 font-sans text-xs text-muted sm:px-6">
		<span>{t('cheatsheet.results', { count })}</span>
		<span class="hidden items-center gap-1.5 sm:inline-flex">
			<kbd class="kbd">{t('shortcuts.keys.esc')}</kbd>
			{t('cheatsheet.escHint')}
		</span>
	</footer>
</div>
