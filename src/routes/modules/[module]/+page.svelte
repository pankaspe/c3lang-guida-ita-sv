<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { lessonPath, moduleIcon } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import { course } from '$lib/content/course';
	import Seo from '$lib/components/ui/Seo.svelte';
	import { reveal } from '$lib/motion';
	import { t } from '$lib/i18n/index.svelte';

	let { data } = $props();

	const module = $derived(data.module);
	const ids = $derived(module.lessons.map((lesson) => lesson.id));
	const completed = $derived(progress.countCompleted(ids));
	const totalMinutes = $derived(module.lessons.reduce((sum, lesson) => sum + lesson.meta.minutes, 0));
</script>

<Seo title="{module.meta.title} · {course.title}" description={module.meta.subtitle} />

{#key module.slug}
<div class="anim-fade mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<nav class="mb-6 font-sans text-xs text-muted" aria-label={t('module.breadcrumb')}>
		<a href="/" class="hover:text-ink">{t('module.modules')}</a>
		<span class="mx-1.5" aria-hidden="true">›</span>
		<span>{t('module.number', { number: module.order })}</span>
	</nav>

	<header class="mb-8">
		<div class="flex items-center gap-3">
			<span
				class="grid size-12 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent"
			>
				<Icon name={moduleIcon(module.meta.icon)} class="size-6" />
			</span>
			<h1 class="font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
				{module.meta.title}
			</h1>
		</div>
		<p class="mt-3 font-reading text-lg leading-relaxed text-ink-soft">{module.meta.subtitle}</p>
		<p class="mt-2 font-sans text-xs text-muted">
			{t('module.lessons', { count: module.lessons.length })} · {t('module.readingTime', { minutes: totalMinutes })} ·
			{t('module.level', { level: module.meta.level.toLowerCase() })}
		</p>
		<div class="mt-4">
			<ProgressBar value={completed} max={ids.length} />
		</div>
	</header>

	{#if module.meta.goals.length}
		<section class="mb-8 rounded-lg border border-line bg-surface p-5">
			<h2 class="font-sans text-sm font-semibold tracking-wide text-muted uppercase">
				{t('module.goals')}
			</h2>
			<ul class="mt-2 grid gap-1.5 font-reading text-[0.95rem] text-ink-soft">
				{#each module.meta.goals as goal (goal)}
					<li class="flex gap-2"><Icon name="check" class="mt-1.5 size-4 text-success" />{goal}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<ol class="grid grid-cols-1 gap-2" {@attach reveal(':scope > li')}>
		{#each module.lessons as lesson (lesson.id)}
			{@const done = progress.isCompleted(lesson.id)}
			<li class="min-w-0">
				<a
					href={lessonPath(lesson)}
					class="flex items-start gap-3 rounded-lg border border-line bg-surface px-3 py-3 transition hover:border-accent hover:bg-accent-soft/40 sm:items-center sm:gap-4 sm:px-4"
				>
					<span
						class={[
							'grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm',
							done ? 'bg-success text-paper' : 'border border-line bg-paper text-muted'
						]}
					>
						{#if done}<Icon name="check" class="size-4" />{:else}{lesson.order}{/if}
					</span>
					<span class="min-w-0 flex-1">
						<span class="flex items-baseline justify-between gap-3">
							<span
								class="font-sans font-semibold text-ink">{lesson.meta.title}</span
							>
							<span class="shrink-0 font-mono text-xs text-muted sm:hidden">{t('common.minutes', { minutes: lesson.meta.minutes })}</span>
						</span>
						<span class="mt-0.5 line-clamp-2 block font-reading text-sm text-muted sm:line-clamp-1"
							>{lesson.meta.description}</span
						>
					</span>
					<span class="hidden shrink-0 font-mono text-xs text-muted sm:inline">{t('common.minutes', { minutes: lesson.meta.minutes })}</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
{/key}
