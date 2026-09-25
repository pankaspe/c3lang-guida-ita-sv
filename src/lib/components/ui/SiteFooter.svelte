<script lang="ts">
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import { course } from '$lib/content/course';
	import { modules } from '$lib/content/registry';
	import { panels } from '$lib/shortcuts.svelte';
	import { t } from '$lib/i18n/index.svelte';

	interface FooterLink {
		href: string;
		label: string;
		icon: IconName;
		external?: boolean;
	}

	const courseLinks: FooterLink[] = $derived([
		{ href: '/', label: t('footer.home'), icon: 'layers' },
		{ href: '/profile', label: t('footer.profile'), icon: 'user' },
		{ href: '/settings', label: t('footer.settings'), icon: 'settings' },
		{ href: '/privacy', label: t('footer.privacy'), icon: 'shield' }
	]);

	const resourceLinks: FooterLink[] = $derived([
		...(course.docs ? [{ href: course.docs.url, label: t('footer.docs'), icon: 'book-open' as const, external: true }] : []),
		...(course.repository
			? [
					{ href: course.repository.url, label: t('footer.source'), icon: 'github' as const, external: true },
					{ href: `${course.repository.url}/issues`, label: t('footer.issue'), icon: 'help' as const, external: true }
				]
			: [])
	]);

	const linkClass = 'group inline-flex items-center gap-2 text-ink-soft transition hover:text-ink';
</script>

{#snippet link(item: FooterLink)}
	<li>
		<a
			href={item.href}
			class={linkClass}
			target={item.external ? '_blank' : undefined}
			rel={item.external ? 'noreferrer' : undefined}
		>
			<Icon name={item.icon} class="size-4 text-muted transition group-hover:text-accent" />
			{item.label}
			{#if item.external}<Icon name="external-link" class="size-3 text-muted" />{/if}
		</a>
	</li>
{/snippet}

<footer class="border-t border-line bg-surface/60 font-sans text-sm">
	<div class="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
		<div class="sm:col-span-2 lg:col-span-1">
			<a href="/" class="group inline-flex items-center gap-2.5">
				<span
					class="bg-brand grid size-8 place-items-center rounded-md font-mono text-sm font-bold text-white shadow-sm"
					aria-hidden="true">{course.logo}</span
				>
				<span class="font-semibold text-ink group-hover:text-accent">{course.title}</span>
			</a>
			<p class="mt-3 max-w-sm leading-relaxed text-ink-soft">{course.description}</p>
			<p class="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted">
				<span>{course.footer}</span>
				{#if course.compiler}<span>{t('footer.verifiedWith', { compiler: course.compiler })}</span>{/if}
				<span>{t('settings.info.modules', { count: modules.length })}</span>
			</p>
		</div>

		<nav aria-labelledby="footer-course">
			<h2 id="footer-course" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
				{t('footer.course')}
			</h2>
			<ul class="mt-3 space-y-2">
				{#each courseLinks as item (item.href)}{@render link(item)}{/each}
				<li>
					<button
						type="button"
						onclick={() => panels.toggle('shortcuts')}
						aria-keyshortcuts="?"
						class="{linkClass} cursor-pointer"
					>
						<Icon name="keyboard" class="size-4 text-muted transition group-hover:text-accent" />
						{t('footer.shortcuts')} <kbd class="kbd">?</kbd>
					</button>
				</li>
			</ul>
		</nav>

		{#if resourceLinks.length}
			<nav aria-labelledby="footer-resources">
				<h2 id="footer-resources" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
					{t('footer.resources')}
				</h2>
				<ul class="mt-3 space-y-2">
					{#each resourceLinks as item (item.href)}{@render link(item)}{/each}
				</ul>
			</nav>
		{/if}
	</div>

	<div class="border-t border-line">
		<div
			class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6"
		>
			{#if course.copyright}<p>{course.copyright}</p>{/if}
			{#if course.docs}
				<p>
					{t('footer.basedOn')}
					<a href={course.docs.url} target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-ink"
						>{course.docs.label}</a
					>
				</p>
			{/if}
		</div>
	</div>
</footer>
