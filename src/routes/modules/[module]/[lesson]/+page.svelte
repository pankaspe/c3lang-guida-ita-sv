<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { lessonPath, loadLessonMarkdown, modulePath, moduleIcon } from '$lib/content/registry';
	import { progress } from '$lib/state/progress.svelte';
	import { reading, readingTracker } from '$lib/state/reading.svelte';
	import { feedback } from '$lib/feedback';
	import { activity } from '$lib/state/activity.svelte';
	import { setLessonContext } from '$lib/content/lesson-context';
	import { course } from '$lib/content/course';
	import { reveal } from '$lib/motion';
	import { t } from '$lib/i18n/index.svelte';

	let { data } = $props();

	// Lets Quiz / Exercise / Callout key their activity records by lesson.
	setLessonContext({
		get lessonId() {
			return data.lesson.id;
		}
	});

	const { module, lesson, previous, next, headings } = $derived(data);
	const Content = $derived(data.content);
	const done = $derived(progress.isCompleted(lesson.id));
	const position = $derived(module.lessons.findIndex((item) => item.id === lesson.id) + 1);

	/** For each TOC heading, the id of the h2 section it lives in. */
	const sectionOf = $derived.by(() => {
		const map = new Map<string, string>();
		let current = 'intro';
		for (const heading of headings) {
			if (heading.depth === 2) current = heading.id;
			map.set(heading.id, current);
		}
		return map;
	});

	/** Lesson whose markdown was just copied, for the button's confirmation. */
	let copied = $state<string | null>(null);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyLesson() {
		const id = lesson.id;
		try {
			await navigator.clipboard.writeText(await loadLessonMarkdown(lesson));
			copied = id;
			feedback('tap');
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = null), 1800);
		} catch {
			// Clipboard blocked (insecure context): nothing else to do.
		}
	}

	/** Lesson just marked as completed, to play the celebration once. */
	let celebrated = $state<string | null>(null);

	function toggleCompleted() {
		const wasDone = done;
		progress.toggle(lesson.id);
		celebrated = wasDone ? null : lesson.id;
		if (!wasDone) {
			feedback('complete');
			activity.recordLessonCompleted();
		}
	}

	function sectionReached(section: string, sectionTitle: string) {
		activity.setLast({ lessonId: lesson.id, section, sectionTitle });
	}

	// Reading time: count 15 s ticks while the tab is visible and the learner
	// has interacted (scroll, keys, pointer) in the last 90 seconds.
	const TICK = 15;
	let lastInteraction = Date.now();
	const interacted = () => (lastInteraction = Date.now());

	$effect(() => {
		const timer = setInterval(() => {
			if (document.visibilityState === 'visible' && Date.now() - lastInteraction < 90_000) {
				activity.addReadingTime(TICK);
			}
		}, TICK * 1000);
		return () => clearInterval(timer);
	});
</script>

<svelte:window onscroll={interacted} onkeydown={interacted} onpointermove={interacted} ontouchstart={interacted} />

<svelte:head>
	<title>{lesson.meta.title} · {module.meta.title} · {course.title}</title>
	<meta name="description" content={lesson.meta.description} />
</svelte:head>

<div class="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_13rem]">
	<!-- Module navigation -->
	<aside class="lg:sticky lg:top-20 lg:self-start">
		<details class="group rounded-lg border border-line bg-surface lg:border-0 lg:bg-transparent" open>
			<summary
				class="cursor-pointer list-none px-4 py-3 font-sans text-xs font-semibold tracking-wide text-muted uppercase lg:cursor-default lg:px-0 lg:py-0"
			>
				<Icon name="chevron-right" class="mr-1 size-3.5 align-[-2px] transition group-open:rotate-90 lg:hidden" />
				<a href={modulePath(module)} class="inline-flex items-center gap-1.5 hover:text-ink"
					><Icon name={moduleIcon(module.meta.icon)} class="size-3.5" /> {module.meta.title}</a
				>
			</summary>
			<ol class="grid gap-0.5 border-t border-line px-2 py-2 lg:mt-3 lg:border-0 lg:p-0">
				{#each module.lessons as item (item.id)}
					{@const active = item.id === lesson.id}
					{@const completed = progress.isCompleted(item.id)}
					<li class="min-w-0">
						<a
							href={lessonPath(item)}
							aria-current={active ? 'page' : undefined}
							class={[
								'flex items-center gap-2 rounded-md px-2 py-1.5 font-sans text-sm transition',
								active ? 'bg-accent-soft font-semibold text-ink' : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
							]}
						>
							<span
								class={[
									'grid size-5 shrink-0 place-items-center rounded-full font-mono text-[10px]',
									completed ? 'bg-success text-paper' : 'border border-line text-muted'
								]}>{#if completed}<Icon name="check" class="size-3" />{:else}{item.order}{/if}</span
							>
							<span class="truncate">{item.meta.title}</span>
						</a>
					</li>
				{/each}
			</ol>
		</details>
	</aside>

	<!-- Lesson -->
	<!-- Keyed so the entrance and scroll reveal replay when moving to another lesson. -->
	{#key lesson.id}
	<article class="anim-fade mx-auto w-full max-w-(--reading-measure) min-w-0">
		<header class="lesson-header mb-8">
			<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
				<p class="font-mono text-xs text-muted">
					{t('lesson.position', { position, total: module.lessons.length })} ·
					{t('lesson.readingTime', { minutes: lesson.meta.minutes })}
				</p>
				<button
					type="button"
					onclick={copyLesson}
					title={t('lesson.copyHint')}
					aria-live="polite"
					class={[
						'-mr-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-sans text-xs font-medium transition hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
						copied === lesson.id ? 'text-success' : 'text-muted'
					]}
				>
					{#if copied === lesson.id}
						<Icon name="check" class="anim-draw size-3.5" />
						{t('lesson.copied')}
					{:else}
						<Icon name="copy" class="size-3.5" />
						{t('lesson.copy')}
					{/if}
				</button>
			</div>
			<h1
				class="mt-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl"
			>
				{lesson.meta.title}
			</h1>
			<p class="mt-3 font-reading text-lg leading-relaxed text-ink-soft">{lesson.meta.description}</p>
		</header>

		<div {@attach readingTracker(lesson.id, sectionReached)} {@attach reveal('.lesson-section > *')}>
			<Content />
		</div>

		<!-- Completion + pager -->
		<footer class="mt-14 border-t border-line pt-6">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<button
					type="button"
					onclick={toggleCompleted}
					class={[
						'inline-flex items-center gap-2 rounded-md border px-4 py-2 font-sans text-sm font-semibold transition',
						done
							? 'border-success bg-success-soft text-ink'
							: 'border-accent bg-accent text-accent-ink hover:opacity-90',
						celebrated === lesson.id && 'anim-ring'
					]}
				>
					{#if done}
						<Icon name="check" class={['size-4 text-success', celebrated === lesson.id && 'anim-draw']} />
						{t('lesson.completed')}
					{:else}
						{t('lesson.markCompleted')}
					{/if}
				</button>
				{#if done && next}
					<span class={['font-sans text-sm text-muted', celebrated === lesson.id && 'anim-rise']}
						>{t('lesson.cheer')}</span
					>
				{/if}
			</div>

			<nav class="mt-6 grid gap-3 sm:grid-cols-2" aria-label={t('lesson.pager')}>
				{#if previous}
					<a
						href={lessonPath(previous)}
						data-shortcut="previous"
						aria-keyshortcuts="p"
						class="group rounded-lg border border-line bg-surface p-4 transition hover:border-accent"
					>
						<span class="inline-flex items-center gap-1 font-sans text-xs text-muted"
							><Icon name="arrow-left" class="size-3.5 transition group-hover:-translate-x-0.5" />
							{t('lesson.previous')}</span
						>
						<span class="mt-1 block font-sans font-semibold text-ink group-hover:text-accent"
							>{previous.meta.title}</span
						>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if next}
					<a
						href={lessonPath(next)}
						data-shortcut="next"
						aria-keyshortcuts="n"
						class="group rounded-lg border border-line bg-surface p-4 text-right transition hover:border-accent"
					>
						<span class="inline-flex items-center gap-1 font-sans text-xs text-muted"
							>{t('lesson.next')} <Icon name="arrow-right" class="size-3.5 transition group-hover:translate-x-0.5" /></span
						>
						<span class="mt-1 block font-sans font-semibold text-ink group-hover:text-accent"
							>{next.meta.title}</span
						>
					</a>
				{:else}
					<a
						href="/"
						class="group inline-flex items-center justify-end gap-1 rounded-lg border border-line bg-surface p-4 text-right font-sans text-sm text-muted transition hover:border-accent"
					>
						{t('lesson.finished')}
						<Icon name="arrow-right" class="size-4 transition group-hover:translate-x-0.5" />
					</a>
				{/if}
			</nav>
		</footer>
	</article>
	{/key}

	<!-- Table of contents -->
	{#if headings.length}
		<aside class="hidden xl:block xl:sticky xl:top-20 xl:self-start">
			<p class="font-sans text-xs font-semibold tracking-wide text-muted uppercase">{t('lesson.toc')}</p>
			<ol class="mt-3 grid gap-1 border-l border-line">
				{#each headings as heading (heading.id)}
					{@const current = heading.id === reading.section}
					{@const inCurrent = sectionOf.get(heading.id) === reading.section}
					<li>
						<a
							href="#{heading.id}"
							aria-current={current ? 'location' : undefined}
							class={[
								'-ml-px block border-l py-0.5 pr-2 font-sans text-[13px] leading-snug transition-colors duration-300 hover:border-accent hover:text-ink',
								heading.depth === 2 ? 'pl-3' : 'pl-6',
								current ? 'border-accent font-medium text-ink' : 'border-transparent',
								!current && (inCurrent ? 'text-ink-soft' : 'text-muted')
							]}>{heading.text}</a
						>
					</li>
				{/each}
			</ol>
		</aside>
	{/if}
</div>
