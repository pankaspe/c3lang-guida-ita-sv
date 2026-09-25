<script lang="ts">
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import Identicon from '$lib/components/ui/Identicon.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Heatmap from '$lib/components/profile/Heatmap.svelte';
	import { allLessons, lessonPath, modulePath, moduleIcon, modules } from '$lib/content/registry';
	import { getBadges, type BadgeStats } from '$lib/content/badges';
	import { course } from '$lib/content/course';
	import Seo from '$lib/components/ui/Seo.svelte';
	import { reveal } from '$lib/motion';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { activity } from '$lib/state/activity.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { profile, MAX_NAME_LENGTH } from '$lib/state/profile.svelte';

	const ready = $derived(progress.loaded && activity.loaded && profile.loaded);

	// --- Name editing -------------------------------------------------------------
	let editing = $state(false);
	let draft = $state('');

	function startEditing() {
		draft = profile.name;
		editing = true;
	}

	function saveName() {
		profile.setName(draft);
		editing = false;
	}

	function focusOnMount(node: HTMLInputElement) {
		node.focus();
		node.select();
	}

	// --- Stats ----------------------------------------------------------------------
	const quiz = $derived(activity.quizStats);
	const accuracy = $derived(quiz.answered ? Math.round((quiz.correct / quiz.answered) * 100) : null);

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return t('profile.duration.minutes', { minutes });
		return t('profile.duration.hours', { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
	}

	const stats = $derived<{ icon: IconName; label: string; value: string; hint: string }[]>([
		{
			icon: 'book-open',
			label: t('profile.stats.lessons'),
			value: `${progress.completed.size}/${allLessons.length}`,
			hint: t('profile.stats.lessonsHint', {
				percent: Math.round((progress.completed.size / Math.max(1, allLessons.length)) * 100)
			})
		},
		{
			icon: 'target',
			label: t('profile.stats.quiz'),
			value: accuracy === null ? '—' : `${accuracy}%`,
			hint: t('profile.stats.quizHint', { correct: quiz.correct, answered: quiz.answered })
		},
		{
			icon: 'terminal',
			label: t('profile.stats.exercises'),
			value: String(activity.exercisesSolved),
			hint: t('profile.stats.exercisesHint')
		},
		{
			icon: 'clock',
			label: t('profile.stats.time'),
			value: formatDuration(activity.totalSeconds),
			hint: t('profile.stats.timeHint')
		},
		{
			icon: 'flame',
			label: t('profile.stats.streak'),
			value: t('profile.stats.streakValue', { count: activity.currentStreak }),
			hint: t('profile.stats.streakHint', { best: activity.bestStreak })
		}
	]);

	// --- Badges -----------------------------------------------------------------------
	const badgeStats = $derived<BadgeStats>({
		completed: progress.completed,
		quizCorrect: quiz.correct,
		exercisesSolved: activity.exercisesSolved,
		nerdOpened: activity.nerd.length,
		bestStreak: activity.bestStreak,
		totalSeconds: activity.totalSeconds
	});
	const badges = $derived(getBadges().map((badge) => ({ ...badge, isEarned: badge.earned(badgeStats) })));
	const earnedCount = $derived(badges.filter((badge) => badge.isEarned).length);

	// --- Resume -------------------------------------------------------------------------
	const resume = $derived.by(() => {
		const last = activity.last;
		const lesson = last && allLessons.find((item) => item.id === last.lessonId);
		if (!last || !lesson) return null;
		const href = lessonPath(lesson) + (last.section && last.section !== 'intro' ? `#${last.section}` : '');
		return { lesson, href, sectionTitle: last.sectionTitle, at: new Date(last.at) };
	});
	const firstUnfinished = $derived(allLessons.find((lesson) => !progress.isCompleted(lesson.id)));

	const since = $derived(
		activity.since
			? i18n.date(new Date(`${activity.since}T12:00:00`), { day: 'numeric', month: 'long', year: 'numeric' })
			: null
	);
</script>

<Seo title="{t('profile.title')} · {course.title}" description={t('profile.description')} noindex />

<div class="anim-fade mx-auto max-w-5xl px-4 py-10 sm:px-6" {@attach reveal(':scope > section, :scope > p')}>
	<p class="font-mono text-sm text-accent">{t('profile.kicker')}</p>

	<!-- Identity -->
	<header class="mt-3 flex flex-wrap items-center gap-5">
		<Identicon seed={profile.name} class="size-20 p-1 sm:size-24" />
		<div class="min-w-0 flex-1">
			{#if editing}
				<form
					class="flex flex-wrap items-center gap-2"
					onsubmit={(event) => {
						event.preventDefault();
						saveName();
					}}
				>
					<label class="sr-only" for="profile-name">{t('profile.nameLabel')}</label>
					<input
						id="profile-name"
						bind:value={draft}
						maxlength={MAX_NAME_LENGTH}
						placeholder={t('profile.namePlaceholder')}
						autocomplete="nickname"
						onkeydown={(event) => event.key === 'Escape' && (editing = false)}
						{@attach focusOnMount}
						class="w-full max-w-xs rounded-md border border-line bg-surface px-3 py-1.5 font-sans text-2xl font-bold text-ink focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
					/>
					<button type="submit" class="rounded-md bg-accent px-3 py-2 font-sans text-sm font-semibold text-accent-ink hover:opacity-90">
						{t('common.save')}
					</button>
					<button type="button" onclick={() => (editing = false)} class="px-2 py-2 font-sans text-sm text-muted hover:text-ink">
						{t('common.cancel')}
					</button>
				</form>
			{:else}
				<h1 class="flex flex-wrap items-center gap-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
					{ready ? profile.displayName : ' '}
					<button
						type="button"
						onclick={startEditing}
						class="grid size-8 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink"
						aria-label={t('profile.editName')}
						title={t('profile.editName')}
					>
						<Icon name="pencil" class="size-4" />
					</button>
				</h1>
			{/if}
			<p class="mt-1 font-sans text-sm text-muted">
				{since ? t('profile.since', { date: since }) : t('profile.notStarted')}
				· {t('profile.badgesCount', { earned: earnedCount, total: badges.length })}
			</p>
		</div>
	</header>

	<!-- Resume -->
	{#if ready}
		<section class="anim-rise mt-8">
			{#if resume}
				<a
					href={resume.href}
					class="group flex items-center gap-4 rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
				>
					<span class="bg-brand grid size-12 shrink-0 place-items-center rounded-full text-white shadow-sm">
						<Icon name="play" class="size-5 translate-x-px" />
					</span>
					<span class="min-w-0 flex-1">
						<span class="block font-mono text-xs text-muted">{t('profile.resume', { ago: i18n.relative(resume.at) })}</span
						>
						<span class="mt-0.5 block font-sans text-lg font-semibold text-ink group-hover:text-accent">
							{resume.lesson.meta.title}
						</span>
						{#if resume.sectionTitle}
							<span class="block truncate font-reading text-sm text-ink-soft">§ {resume.sectionTitle}</span>
						{/if}
					</span>
					<Icon name="arrow-right" class="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
				</a>
			{:else if firstUnfinished}
				<a
					href={lessonPath(firstUnfinished)}
					class="group flex items-center gap-4 rounded-xl border border-dashed border-line bg-surface p-5 transition hover:border-accent"
				>
					<span class="bg-brand grid size-12 shrink-0 place-items-center rounded-full text-white">
						<Icon name="rocket" class="size-5" />
					</span>
					<span class="flex-1 font-sans">
						<span class="block text-lg font-semibold text-ink">{t('profile.startTitle')}</span>
						<span class="block text-sm text-muted">{t('profile.startHint')}</span>
					</span>
				</a>
			{/if}
		</section>
	{/if}

	<!-- Stats -->
	<section class="mt-8" aria-labelledby="stats-heading">
		<h2 id="stats-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('profile.statsHeading')}</h2>
		<dl class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
			{#each stats as stat, index (stat.label)}
				<div
					class="anim-rise rounded-xl border border-line bg-surface p-4 last:col-span-2 md:last:col-span-1"
					style:animation-delay="{index * 50}ms"
				>
					<dt class="flex items-center gap-1.5 font-sans text-xs text-muted">
						<Icon name={stat.icon} class="size-3.5" />
						{stat.label}
					</dt>
					<dd class="mt-2 font-mono text-xl font-semibold text-ink tabular-nums sm:text-2xl">{ready ? stat.value : '—'}</dd>
					<dd class="mt-0.5 font-sans text-xs text-muted">{stat.hint}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- Activity calendar -->
	<section class="mt-8" aria-labelledby="activity-heading">
		<h2 id="activity-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('profile.activityHeading')}</h2>
		<div class="mt-3 rounded-xl border border-line bg-surface p-5">
			<div class="md:hidden"><Heatmap weeks={17} /></div>
			<div class="hidden md:block"><Heatmap weeks={40} /></div>
		</div>
	</section>

	<!-- Modules -->
	<section class="mt-8" aria-labelledby="modules-heading">
		<h2 id="modules-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('profile.modulesHeading')}</h2>
		<ul class="mt-3 grid gap-3">
			{#each modules as module (module.slug)}
				{@const ids = module.lessons.map((lesson) => lesson.id)}
				<li>
					<a
						href={modulePath(module)}
						class="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition hover:border-accent"
					>
						<span class="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-paper text-accent">
							<Icon name={moduleIcon(module.meta.icon)} class="size-5" />
						</span>
						<span class="min-w-0 flex-1">
							<span class="block font-sans font-semibold text-ink">
								<span class="font-mono text-sm text-muted">{String(module.order).padStart(2, '0')}</span>
								{module.meta.title}
							</span>
							<span class="mt-2 block"><ProgressBar value={progress.countCompleted(ids)} max={ids.length} /></span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Badges -->
	<section class="mt-8" aria-labelledby="badges-heading">
		<h2 id="badges-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">
			{t('profile.badgesHeading', { earned: earnedCount, total: badges.length })}
		</h2>
		<ul class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			{#each badges as badge (badge.id)}
				<li
					class={[
						'rounded-xl border p-4 transition',
						badge.isEarned ? 'border-accent/60 bg-surface' : 'border-dashed border-line bg-transparent'
					]}
				>
					<span
						class={[
							'grid size-10 place-items-center rounded-full',
							badge.isEarned ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted'
						]}
					>
						<Icon name={badge.isEarned ? badge.icon : 'lock'} class="size-5" />
					</span>
					<p class={['mt-3 font-sans text-sm font-semibold', badge.isEarned ? 'text-ink' : 'text-muted']}>{badge.title}</p>
					<p class="mt-0.5 font-sans text-xs text-muted">{badge.description}</p>
				</li>
			{/each}
		</ul>
	</section>

	<p class="mt-10 flex items-center gap-2 font-sans text-sm text-muted">
		<Icon name="lock" class="size-4" />
		{t('profile.localOnly')}
		<a href="/settings#data" class="text-link hover:underline">{t('profile.manageData')}</a>
	</p>
</div>
