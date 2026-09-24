<script lang="ts">
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import Identicon from '$lib/components/ui/Identicon.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Heatmap from '$lib/components/profile/Heatmap.svelte';
	import { allLessons, lessonPath, modulePath, moduleIcon, modules } from '$lib/content/registry';
	import { BADGES, type BadgeStats } from '$lib/content/badges';
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
		if (minutes < 60) return `${minutes} min`;
		return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
	}

	const stats = $derived<{ icon: IconName; label: string; value: string; hint: string }[]>([
		{
			icon: 'book-open',
			label: 'Lezioni completate',
			value: `${progress.completed.size}/${allLessons.length}`,
			hint: `${Math.round((progress.completed.size / Math.max(1, allLessons.length)) * 100)}% del corso`
		},
		{
			icon: 'target',
			label: 'Precisione nei quiz',
			value: accuracy === null ? '—' : `${accuracy}%`,
			hint: `${quiz.correct} su ${quiz.answered} al primo colpo`
		},
		{
			icon: 'terminal',
			label: 'Esercizi risolti',
			value: String(activity.exercisesSolved),
			hint: 'sul tuo computer'
		},
		{
			icon: 'clock',
			label: 'Tempo di studio',
			value: formatDuration(activity.totalSeconds),
			hint: 'lettura attiva'
		},
		{
			icon: 'flame',
			label: 'Serie attuale',
			value: `${activity.currentStreak} ${activity.currentStreak === 1 ? 'giorno' : 'giorni'}`,
			hint: `record: ${activity.bestStreak}`
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
	const badges = $derived(BADGES.map((badge) => ({ ...badge, isEarned: badge.earned(badgeStats) })));
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

	function timeAgo(date: Date): string {
		const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
		if (minutes < 1) return 'proprio ora';
		if (minutes < 60) return `${minutes} min fa`;
		const hours = Math.round(minutes / 60);
		if (hours < 24) return `${hours} ${hours === 1 ? 'ora' : 'ore'} fa`;
		const days = Math.round(hours / 24);
		return days === 1 ? 'ieri' : `${days} giorni fa`;
	}

	const since = $derived(
		activity.since
			? new Date(`${activity.since}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
			: null
	);
</script>

<svelte:head>
	<title>Profilo · Impara C3</title>
	<meta name="description" content="I tuoi progressi, le statistiche e i traguardi raggiunti." />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
	<p class="font-mono text-sm text-accent">// profilo</p>

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
					<label class="sr-only" for="profile-name">Il tuo nome</label>
					<input
						id="profile-name"
						bind:value={draft}
						maxlength={MAX_NAME_LENGTH}
						placeholder="Come ti chiami?"
						autocomplete="nickname"
						onkeydown={(event) => event.key === 'Escape' && (editing = false)}
						{@attach focusOnMount}
						class="w-full max-w-xs rounded-md border border-line bg-surface px-3 py-1.5 font-sans text-2xl font-bold text-ink focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
					/>
					<button type="submit" class="rounded-md bg-accent px-3 py-2 font-sans text-sm font-semibold text-accent-ink hover:opacity-90">
						Salva
					</button>
					<button type="button" onclick={() => (editing = false)} class="px-2 py-2 font-sans text-sm text-muted hover:text-ink">
						Annulla
					</button>
				</form>
			{:else}
				<h1 class="flex flex-wrap items-center gap-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
					{ready ? profile.displayName : ' '}
					<button
						type="button"
						onclick={startEditing}
						class="grid size-8 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink"
						aria-label="Modifica il nome"
						title="Modifica il nome"
					>
						<Icon name="pencil" class="size-4" />
					</button>
				</h1>
			{/if}
			<p class="mt-1 font-sans text-sm text-muted">
				{#if since}In viaggio dal {since}{:else}Il viaggio comincia con la prima lezione{/if}
				· {earnedCount}/{badges.length} traguardi
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
						<span class="block font-mono text-xs text-muted">Riprendi da qui · {timeAgo(resume.at)}</span>
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
						<span class="block text-lg font-semibold text-ink">Inizia il percorso</span>
						<span class="block text-sm text-muted">Le tue statistiche prenderanno vita dalla prima lezione.</span>
					</span>
				</a>
			{/if}
		</section>
	{/if}

	<!-- Stats -->
	<section class="mt-8" aria-labelledby="stats-heading">
		<h2 id="stats-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Statistiche</h2>
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
		<h2 id="activity-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Attività</h2>
		<div class="mt-3 rounded-xl border border-line bg-surface p-5">
			<div class="md:hidden"><Heatmap weeks={17} /></div>
			<div class="hidden md:block"><Heatmap weeks={40} /></div>
		</div>
	</section>

	<!-- Modules -->
	<section class="mt-8" aria-labelledby="modules-heading">
		<h2 id="modules-heading" class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Moduli</h2>
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
			Traguardi · {earnedCount}/{badges.length}
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
		Il profilo vive solo in questo browser.
		<a href="/impostazioni#dati" class="text-link hover:underline">Esporta o elimina i dati</a>
	</p>
</div>
