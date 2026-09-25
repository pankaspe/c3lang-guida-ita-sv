<script lang="ts">
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import Seo from '$lib/components/ui/Seo.svelte';
	import { course } from '$lib/content/course';
	import { i18n, t, type MessageKey } from '$lib/i18n/index.svelte';

	/** Date of the last change to this page's text. */
	const UPDATED = new Date(2026, 8, 25);

	interface PrivacySection {
		id: 'storage' | 'tracking' | 'hosting' | 'control' | 'contact';
		icon: IconName;
		link?: { href: string; external?: boolean };
	}

	const sections: PrivacySection[] = [
		{ id: 'storage', icon: 'database' },
		{ id: 'tracking', icon: 'eye' },
		{ id: 'hosting', icon: 'monitor', link: { href: 'https://www.cloudflare.com/privacypolicy/', external: true } },
		{ id: 'control', icon: 'lock', link: { href: '/settings#data' } },
		...(course.repository
			? [{ id: 'contact' as const, icon: 'github' as const, link: { href: `${course.repository.url}/issues`, external: true } }]
			: [])
	];
</script>

<Seo title="{t('privacy.title')} · {course.title}" description={t('privacy.description')} />

<div class="anim-fade mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<p class="font-mono text-sm text-accent">{t('privacy.kicker')}</p>
	<h1 class="mt-2 flex items-center gap-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
		<Icon name="shield" class="size-8 text-accent" />
		{t('privacy.heading')}
	</h1>
	<p class="mt-4 font-reading text-lg leading-relaxed text-ink-soft">{@html i18n.md('privacy.introMd')}</p>
	<p class="mt-2 font-mono text-xs text-muted">{t('privacy.updated', { date: i18n.date(UPDATED, { dateStyle: 'long' }) })}</p>

	<div class="mt-8 space-y-4">
		{#each sections as section (section.id)}
			<section class="rounded-xl border border-line bg-surface p-5 sm:p-6">
				<h2 class="flex items-center gap-2.5 font-sans text-lg font-semibold text-ink">
					<Icon name={section.icon} class="size-5 text-accent" />
					{t(`privacy.${section.id}.title` as MessageKey)}
				</h2>
				<p class="mt-2 font-reading leading-relaxed text-ink-soft">{@html i18n.md(`privacy.${section.id}.bodyMd` as MessageKey)}</p>
				{#if section.link}
					<a
						href={section.link.href}
						target={section.link.external ? '_blank' : undefined}
						rel={section.link.external ? 'noreferrer' : undefined}
						class="mt-3 inline-flex items-center gap-1 font-sans text-sm text-link hover:underline"
					>
						{t(`privacy.${section.id}.link` as MessageKey)}
						<Icon name={section.link.external ? 'external-link' : 'arrow-right'} class="size-3.5" />
					</a>
				{/if}
			</section>
		{/each}
	</div>
</div>
