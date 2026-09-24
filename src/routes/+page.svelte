<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { modules, modulePath, lessonPath, moduleIcon, allLessons } from '$lib/content/registry';
	import { activity } from '$lib/state/activity.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import { course } from '$lib/content/course';
	import { reveal } from '$lib/motion';
	import { t } from '$lib/i18n/index.svelte';

	function completedIn(lessonIds: string[]) {
		return progress.countCompleted(lessonIds);
	}

	/** First lesson not yet completed, so "Continue" lands in the right place. */
	const nextLesson = $derived(
		modules.flatMap((module) => module.lessons).find((lesson) => !progress.isCompleted(lesson.id))
	);

	/** Exact spot where the learner stopped reading, if that lesson isn't done yet. */
	const continueHref = $derived.by(() => {
		const last = activity.last;
		const lesson = last && allLessons.find((item) => item.id === last.lessonId);
		if (lesson && !progress.isCompleted(lesson.id)) {
			return lessonPath(lesson) + (last.section !== 'intro' ? `#${last.section}` : '');
		}
		return nextLesson ? lessonPath(nextLesson) : null;
	});

	/** Hero title split around the part painted with the brand gradient. */
	const heroTitle = $derived.by(() => {
		const { title, highlight } = course.hero;
		const index = highlight ? title.indexOf(highlight) : -1;
		if (!highlight || index < 0) return { before: title, highlight: '', after: '' };
		return { before: title.slice(0, index), highlight, after: title.slice(index + highlight.length) };
	});
</script>

<svelte:head>
	<title>{course.title} · {course.tagline}</title>
	<meta name="description" content={course.description} />
</svelte:head>

<section class="relative isolate">
	<div class="bg-grid absolute inset-0 -z-10" aria-hidden="true"></div>
	<div class="anim-fade mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6">
		<p class="font-mono text-sm text-accent">{course.hero.kicker}</p>
		<h1 class="mt-2 max-w-2xl font-sans text-4xl font-bold tracking-tight text-ink sm:text-5xl">
			{heroTitle.before}<span class="text-brand">{heroTitle.highlight}</span>{heroTitle.after}
		</h1>
		<p class="mt-4 max-w-2xl font-reading text-lg leading-relaxed text-ink-soft">
			{course.hero.intro}
		</p>
		{#if continueHref}
			<a
				href={continueHref}
				class="bg-brand mt-6 inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
			>
				{progress.completed.size > 0 || activity.last ? t('home.continue') : t('home.start')}
				<Icon name="arrow-right" class="size-4" />
			</a>
		{/if}
	</div>
</section>

<section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
	<h2 class="mb-4 font-mono text-sm font-semibold tracking-wide text-muted uppercase">{t('home.modules')}</h2>
	<ol class="anim-fade grid gap-4 sm:grid-cols-2" {@attach reveal(':scope > li')}>
		{#each modules as module (module.slug)}
			{@const ids = module.lessons.map((lesson) => lesson.id)}
			<li>
				<a
					href={modulePath(module)}
					class="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
				>
					<div class="flex items-start justify-between gap-3">
						<span
							class="grid size-11 place-items-center rounded-lg border border-line bg-paper text-accent"
						>
							<Icon name={moduleIcon(module.meta.icon)} class="size-5" />
						</span>
						<span
							class="rounded-full border border-line bg-paper px-2 py-0.5 font-sans text-[11px] font-medium text-muted"
						>
							{module.meta.level}
						</span>
					</div>
					<h3 class="mt-3 font-sans text-lg font-semibold text-ink group-hover:text-accent">
						<span class="mr-1.5 font-mono text-sm text-muted">{String(module.order).padStart(2, '0')}</span>
						{module.meta.title}
					</h3>
					<p class="mt-1 flex-1 font-reading text-sm leading-relaxed text-ink-soft">
						{module.meta.subtitle}
					</p>
					<div class="mt-4">
						<ProgressBar value={completedIn(ids)} max={ids.length} />
					</div>
				</a>
			</li>
		{/each}
		{#if course.moreModulesComing}
			<li
				class="flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-line p-5 text-center font-sans text-sm text-muted"
			>
				{t('home.moreComing')}
			</li>
		{/if}
	</ol>
</section>
