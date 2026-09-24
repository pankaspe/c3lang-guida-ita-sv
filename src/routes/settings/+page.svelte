<script lang="ts">
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import Segmented from '$lib/components/settings/Segmented.svelte';
	import SettingRow from '$lib/components/settings/SettingRow.svelte';
	import Switch from '$lib/components/settings/Switch.svelte';
	import { settings } from '$lib/state/settings.svelte';
	import { progress } from '$lib/state/progress.svelte';
	import { DEFAULT_PREFERENCES, type Palette } from '$lib/state/preferences';
	import { clearCourseData, downloadBackup, parseBackup, restoreBackup, storedBytes, type Backup } from '$lib/state/storage';
	import { allLessons, modules } from '$lib/content/registry';
	import { course } from '$lib/content/course';
	import { reveal } from '$lib/motion';
	import { feedback } from '$lib/feedback';
	import { AVAILABLE_LOCALES, i18n, t } from '$lib/i18n/index.svelte';

	type SectionId = 'appearance' | 'reading' | 'code' | 'experience' | 'data' | 'info';
	const sections: { id: SectionId; icon: IconName }[] = [
		{ id: 'appearance', icon: 'palette' },
		{ id: 'reading', icon: 'book-open' },
		{ id: 'code', icon: 'code' },
		{ id: 'experience', icon: 'sparkles' },
		{ id: 'data', icon: 'database' },
		{ id: 'info', icon: 'info' }
	];

	const localeOptions = $derived([
		{ value: 'auto', label: t('settings.language.auto') },
		...AVAILABLE_LOCALES.map(([value, label]) => ({ value, label }))
	]);

	type Swatch = { paper: string; surface: string; accent: string; ink: string; line: string };
	const palettes: { value: Palette; light: Swatch; dark: Swatch }[] = [
		{
			value: 'c3',
			light: { paper: '#f6f7fb', surface: '#ffffff', accent: '#4f46e5', ink: '#151a2d', line: '#dde0ec' },
			dark: { paper: '#0b0e1a', surface: '#121629', accent: '#8b8ff9', ink: '#e4e7f5', line: '#262c47' }
		},
		{
			value: 'paper',
			light: { paper: '#f6f1e7', surface: '#fdfaf3', accent: '#b4512b', ink: '#2b2620', line: '#e0d7c5' },
			dark: { paper: '#1b1917', surface: '#232019', accent: '#e08a5c', ink: '#e6dfd2', line: '#3a352e' }
		},
		{
			value: 'terminal',
			light: { paper: '#f2f6f1', surface: '#fbfdfa', accent: '#15803d', ink: '#0f1f12', line: '#d0ddcf' },
			dark: { paper: '#070b08', surface: '#0c130e', accent: '#3ddc84', ink: '#c9f5d3', line: '#1b3021' }
		},
		{
			value: 'contrast',
			light: { paper: '#ffffff', surface: '#ffffff', accent: '#1d2bd6', ink: '#000000', line: '#6b6b6b' },
			dark: { paper: '#000000', surface: '#000000', accent: '#ffd400', ink: '#ffffff', line: '#9a9a9a' }
		}
	];

	const prefs = $derived(settings.prefs);
	const isDefault = $derived(JSON.stringify(prefs) === JSON.stringify(DEFAULT_PREFERENCES));

	// --- Section navigation: highlight the section being read. -------------------
	let activeSection = $state<string>('appearance');

	function trackSections(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) activeSection = entry.target.id;
			},
			{ rootMargin: '-30% 0px -60% 0px' }
		);
		for (const section of node.querySelectorAll('section[id]')) observer.observe(section);
		return () => observer.disconnect();
	}

	// --- Data: export / import / delete. ------------------------------------------
	// Recomputed whenever the stored data changes (settings or progress).
	const bytes = $derived.by(() => {
		void settings.prefs;
		void progress.completed.size;
		return progress.loaded ? storedBytes() : 0;
	});
	let pendingBackup = $state<Backup | null>(null);
	let importError = $state('');
	let confirmingDelete = $state(false);
	let deleteText = $state('');
	let fileInput: HTMLInputElement;

	async function pickBackup(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		importError = '';
		pendingBackup = null;
		if (!file) return;
		try {
			pendingBackup = parseBackup(await file.text());
		} catch (error) {
			importError = (error as Error).message;
		}
		fileInput.value = '';
	}

	function applyBackup() {
		if (!pendingBackup) return;
		restoreBackup(pendingBackup);
		location.reload();
	}

	function deleteEverything() {
		clearCourseData();
		location.reload();
	}

	const deleteWord = $derived(t('settings.data.deleteWord'));
</script>

<svelte:head>
	<title>{t('settings.title')} · {course.title}</title>
	<meta name="description" content={t('settings.description')} />
</svelte:head>

<div class="anim-fade mx-auto max-w-6xl px-4 py-10 sm:px-6">
	<p class="font-mono text-sm text-accent">{t('settings.kicker')}</p>
	<h1 class="mt-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t('settings.heading')}</h1>
	<p class="mt-3 max-w-2xl font-reading text-lg leading-relaxed text-ink-soft">
		{t('settings.intro')}
	</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
		<!-- Section navigation: horizontal chips on mobile, sticky list on desktop -->
		<nav
			class="sticky top-[61px] z-10 -mx-4 overflow-x-auto border-b border-line bg-paper/90 px-4 py-2 backdrop-blur lg:top-24 lg:mx-0 lg:self-start lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0"
			aria-label={t('settings.sectionsAria')}
		>
			<ul class="flex gap-1 lg:flex-col">
				{#each sections as section (section.id)}
					{@const active = activeSection === section.id}
					<li>
						<a
							href="#{section.id}"
							aria-current={active ? 'true' : undefined}
							class={[
								'flex items-center gap-2 rounded-md px-3 py-1.5 font-sans text-sm whitespace-nowrap transition',
								active ? 'bg-accent-soft font-semibold text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
							]}
						>
							<Icon name={section.icon} class={['size-4', active && 'text-accent']} />
							{t(`settings.sections.${section.id}`)}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="min-w-0" {@attach trackSections} {@attach reveal(':scope > section')}>
			<!-- Appearance -->
			<section id="appearance" class="scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('settings.sections.appearance')}</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow
						icon="languages"
						title={t('settings.language.title')}
						description={t('settings.language.description', { language: i18n.languageName(course.locale) })}
					>
						<Segmented
							label={t('settings.language.title')}
							value={prefs.locale in Object.fromEntries(AVAILABLE_LOCALES) ? prefs.locale : 'auto'}
							onchange={(locale) => settings.update({ locale })}
							options={localeOptions}
						/>
					</SettingRow>
					<SettingRow icon="monitor" title={t('settings.theme.title')} description={t('settings.theme.description')}>
						<Segmented
							label={t('settings.theme.title')}
							value={prefs.mode}
							onchange={(mode) => settings.update({ mode })}
							options={[
								{ value: 'system', label: t('settings.theme.system'), icon: 'monitor' },
								{ value: 'light', label: t('settings.theme.light'), icon: 'sun' },
								{ value: 'dark', label: t('settings.theme.dark'), icon: 'moon' }
							]}
						/>
					</SettingRow>
					<div class="py-5">
						<div class="flex gap-3">
							<Icon name="palette" class="mt-0.5 size-5 text-muted" />
							<div>
								<p class="font-sans text-sm font-semibold text-ink">{t('settings.palette.title')}</p>
								<p class="mt-0.5 font-sans text-sm text-muted">{t('settings.palette.description')}</p>
							</div>
						</div>
						<div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup" aria-label={t('settings.palette.title')}>
							{#each palettes as palette (palette.value)}
								{@const active = prefs.palette === palette.value}
								{@const swatch = settings.isDark ? palette.dark : palette.light}
								<button
									type="button"
									role="radio"
									aria-checked={active}
									onclick={() => settings.update({ palette: palette.value })}
									class={[
										'group rounded-lg border p-2 text-left transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
										active ? 'border-accent ring-1 ring-accent' : 'border-line hover:border-accent'
									]}
								>
									<!-- Miniature of the palette -->
									<span
										class="block overflow-hidden rounded-md border p-2"
										style:background={swatch.paper}
										style:border-color={swatch.line}
										aria-hidden="true"
									>
										<span class="block rounded border p-2" style:background={swatch.surface} style:border-color={swatch.line}>
											<span class="block h-1.5 w-3/4 rounded-full" style:background={swatch.ink}></span>
											<span class="mt-1 block h-1.5 w-1/2 rounded-full opacity-50" style:background={swatch.ink}></span>
											<span class="mt-2 block h-3 w-10 rounded" style:background={swatch.accent}></span>
										</span>
									</span>
									<span class="mt-2 flex items-center justify-between gap-1 px-0.5 font-sans text-sm font-semibold text-ink">
										{t(`settings.palette.${palette.value}.label`)}
										{#if active}<Icon name="check" class="size-4 text-accent" />{/if}
									</span>
									<span class="block px-0.5 font-sans text-xs text-muted">{t(`settings.palette.${palette.value}.description`)}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</section>

			<!-- Reading -->
			<section id="reading" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('settings.sections.reading')}</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="type" title={t('settings.font.title')} description={t('settings.font.description')}>
						<Segmented
							label={t('settings.font.title')}
							value={prefs.font}
							onchange={(font) => settings.update({ font })}
							options={[
								{ value: 'serif', label: t('settings.font.serif') },
								{ value: 'sans', label: t('settings.font.sans') }
							]}
						/>
					</SettingRow>
					<SettingRow icon="type" title={t('settings.textSize.title')} description={t('settings.textSize.description')}>
						<Segmented
							label={t('settings.textSize.title')}
							value={prefs.textSize}
							onchange={(textSize) => settings.update({ textSize })}
							options={[
								{ value: 100, label: '100%' },
								{ value: 125, label: '125%' },
								{ value: 150, label: '150%' }
							]}
						/>
					</SettingRow>
					<SettingRow icon="layers" title={t('settings.lineHeight.title')} description={t('settings.lineHeight.description')}>
						<Segmented
							label={t('settings.lineHeight.title')}
							value={prefs.lineHeight}
							onchange={(lineHeight) => settings.update({ lineHeight })}
							options={[
								{ value: 'compact', label: t('settings.lineHeight.compact') },
								{ value: 'normal', label: t('settings.lineHeight.normal') },
								{ value: 'relaxed', label: t('settings.lineHeight.relaxed') }
							]}
						/>
					</SettingRow>
					<SettingRow icon="book-open" title={t('settings.measure.title')} description={t('settings.measure.description')}>
						<Segmented
							label={t('settings.measure.title')}
							value={prefs.measure}
							onchange={(measure) => settings.update({ measure })}
							options={[
								{ value: 'narrow', label: t('settings.measure.narrow') },
								{ value: 'normal', label: t('settings.measure.normal') },
								{ value: 'wide', label: t('settings.measure.wide') }
							]}
						/>
					</SettingRow>
					<SettingRow icon="eye" title={t('settings.focus.title')} description={t('settings.focus.description')}>
						<Switch label={t('settings.focus.title')} checked={prefs.focus} onchange={(focus) => settings.update({ focus })} />
					</SettingRow>
					<SettingRow icon="layers" title={t('settings.snap.title')} description={t('settings.snap.description')}>
						<Switch label={t('settings.snap.title')} checked={prefs.snap} onchange={(snap) => settings.update({ snap })} />
					</SettingRow>
				</div>

				<div class="lesson-prose prose mt-4 max-w-(--reading-measure) rounded-xl border border-dashed border-line px-5 py-4">
					<p class="!my-0">
						<span class="font-mono text-xs text-muted not-italic">{t('settings.preview')}</span>
						{@html i18n.md('settings.previewTextMd')}
					</p>
				</div>
			</section>

			<!-- Code -->
			<section id="code" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('settings.sections.code')}</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="code" title={t('settings.codeSize.title')} description={t('settings.codeSize.description')}>
						<Segmented
							label={t('settings.codeSize.title')}
							value={prefs.codeSize}
							onchange={(codeSize) => settings.update({ codeSize })}
							options={[
								{ value: 90, label: t('settings.codeSize.small') },
								{ value: 100, label: t('settings.codeSize.normal') },
								{ value: 115, label: t('settings.codeSize.large') }
							]}
						/>
					</SettingRow>
					<SettingRow icon="terminal" title={t('settings.ligatures.title')} description={t('settings.ligatures.description')}>
						<Switch label={t('settings.ligatures.title')} checked={prefs.ligatures} onchange={(ligatures) => settings.update({ ligatures })} />
					</SettingRow>
				</div>
				<figure class="code-block not-prose mt-4 overflow-hidden rounded-lg border border-line" data-lang="c3">
					<pre><code
							><span class="token keyword">if</span> <span class="token punctuation">(</span>a <span class="token operator">!=</span> b <span class="token operator">&amp;&amp;</span> x <span class="token operator">&gt;=</span> <span class="token number">10</span><span class="token punctuation">)</span> io<span class="token punctuation">::</span><span class="token function">printn</span><span class="token punctuation">(</span><span class="token string">"ok"</span><span class="token punctuation">);</span> <span class="token comment">// != &amp;&amp; &gt;= -&gt;</span></code
						></pre>
				</figure>
			</section>

			<!-- Experience -->
			<section id="experience" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('settings.sections.experience')}</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="sparkles" title={t('settings.motion.title')} description={t('settings.motion.description')}>
						<Segmented
							label={t('settings.motion.title')}
							value={prefs.motion}
							onchange={(motion) => settings.update({ motion })}
							options={[
								{ value: 'system', label: t('settings.motion.system') },
								{ value: 'full', label: t('settings.motion.full') },
								{ value: 'reduced', label: t('settings.motion.reduced') }
							]}
						/>
					</SettingRow>
					<SettingRow icon="volume" title={t('settings.sound.title')} description={t('settings.sound.description')}>
						<div class="flex items-center gap-3">
							<button
								type="button"
								onclick={() => feedback('success', true)}
								class="font-sans text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
							>
								{t('settings.sound.try')}
							</button>
							<Switch label={t('settings.sound.title')} checked={prefs.sound} onchange={(sound) => settings.update({ sound })} />
						</div>
					</SettingRow>
					<SettingRow icon="smartphone" title={t('settings.haptics.title')} description={t('settings.haptics.description')}>
						<Switch label={t('settings.haptics.title')} checked={prefs.haptics} onchange={(haptics) => settings.update({ haptics })} />
					</SettingRow>
				</div>
				<button
					type="button"
					onclick={() => settings.reset()}
					disabled={isDefault}
					class="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 font-sans text-sm font-medium text-ink-soft transition hover:border-accent hover:text-ink disabled:opacity-40 disabled:hover:border-line"
				>
					<Icon name="history" class="size-4" />
					{t('settings.reset')}
				</button>
			</section>

			<!-- Data -->
			<section id="data" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('settings.sections.data')}</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface p-5">
					<div class="flex gap-3">
						<Icon name="lock" class="mt-0.5 size-5 text-muted" />
						<p class="font-sans text-sm text-ink-soft [&_code]:font-mono [&_code]:text-xs [&_strong]:text-ink">
							{@html i18n.md('settings.data.localMd')}
						</p>
					</div>
					<dl class="mt-4 grid grid-cols-2 gap-3 font-sans sm:max-w-md">
						<div class="rounded-lg bg-surface-2 px-3 py-2">
							<dt class="text-xs text-muted">{t('settings.data.completed')}</dt>
							<dd class="font-mono text-lg text-ink">{progress.completed.size}/{allLessons.length}</dd>
						</div>
						<div class="rounded-lg bg-surface-2 px-3 py-2">
							<dt class="text-xs text-muted">{t('settings.data.storage')}</dt>
							<dd class="font-mono text-lg text-ink">{(bytes / 1024).toFixed(1)} KB</dd>
						</div>
					</dl>
				</div>

				<div class="mt-3 grid gap-3 md:grid-cols-2">
					<div class="rounded-xl border border-line bg-surface p-5">
						<p class="flex items-center gap-2 font-sans text-sm font-semibold text-ink">
							<Icon name="download" class="size-4 text-muted" />
							{t('settings.data.exportTitle')}
						</p>
						<p class="mt-1 font-sans text-sm text-muted">{t('settings.data.exportDescription')}</p>
						<button
							type="button"
							onclick={downloadBackup}
							class="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-sm font-semibold text-accent-ink transition hover:opacity-90"
						>
							<Icon name="download" class="size-4" />
							{t('settings.data.exportButton')}
						</button>
					</div>

					<div class="rounded-xl border border-line bg-surface p-5">
						<p class="flex items-center gap-2 font-sans text-sm font-semibold text-ink">
							<Icon name="upload" class="size-4 text-muted" />
							{t('settings.data.importTitle')}
						</p>
						<p class="mt-1 font-sans text-sm text-muted">{t('settings.data.importDescription')}</p>
						<input bind:this={fileInput} type="file" accept="application/json,.json" class="hidden" onchange={pickBackup} />
						{#if pendingBackup}
							<div class="anim-rise mt-4 rounded-lg border border-warning bg-warning-soft p-3 font-sans text-sm text-ink">
								{@html i18n.md('settings.data.importConfirmMd', {
									date: i18n.date(new Date(pendingBackup.exportedAt), { dateStyle: 'long', timeStyle: 'short' }),
									entries: t('settings.data.importEntries', { count: Object.keys(pendingBackup.data).length })
								})}
								<div class="mt-3 flex gap-2">
									<button type="button" onclick={applyBackup} class="rounded-md bg-accent px-3 py-1.5 font-semibold text-accent-ink hover:opacity-90">
										{t('settings.data.importRestore')}
									</button>
									<button type="button" onclick={() => (pendingBackup = null)} class="rounded-md px-3 py-1.5 text-muted hover:text-ink">
										{t('common.cancel')}
									</button>
								</div>
							</div>
						{:else}
							<button
								type="button"
								onclick={() => fileInput.click()}
								class="mt-4 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-sans text-sm font-medium text-ink-soft transition hover:border-accent hover:text-ink"
							>
								<Icon name="upload" class="size-4" />
								{t('settings.data.importPick')}
							</button>
						{/if}
						{#if importError}
							<p class="anim-rise mt-3 flex items-center gap-1.5 font-sans text-sm text-danger" role="alert">
								<Icon name="warning" class="size-4" />
								{importError}
							</p>
						{/if}
					</div>
				</div>

				<div class="mt-3 rounded-xl border border-danger/50 bg-surface p-5">
					<p class="flex items-center gap-2 font-sans text-sm font-semibold text-danger">
						<Icon name="trash" class="size-4" />
						{t('settings.data.deleteTitle')}
					</p>
					<p class="mt-1 font-sans text-sm text-muted">
						{t('settings.data.deleteDescription')}
					</p>
					{#if confirmingDelete}
						<div class="anim-rise mt-4 font-sans text-sm">
							<label class="block text-ink-soft">
								{t('settings.data.deleteConfirm')} <strong class="font-mono text-danger">{deleteWord}</strong>
								<input
									bind:value={deleteText}
									class="mt-2 block w-full max-w-xs rounded-md border border-line bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-danger focus:ring-2 focus:ring-danger/30 focus:outline-none"
									autocomplete="off"
									spellcheck="false"
								/>
							</label>
							<div class="mt-3 flex gap-2">
								<button
									type="button"
									onclick={deleteEverything}
									disabled={deleteText.trim().toLowerCase() !== deleteWord.toLowerCase()}
									class="rounded-md bg-danger px-3 py-1.5 font-semibold text-paper transition hover:opacity-90 disabled:opacity-40"
								>
									{t('settings.data.deleteForever')}
								</button>
								<button
									type="button"
									onclick={() => {
										confirmingDelete = false;
										deleteText = '';
									}}
									class="rounded-md px-3 py-1.5 text-muted hover:text-ink"
								>
									{t('common.cancel')}
								</button>
							</div>
						</div>
					{:else}
						<button
							type="button"
							onclick={() => (confirmingDelete = true)}
							class="mt-4 inline-flex items-center gap-2 rounded-md border border-danger/60 px-4 py-2 font-sans text-sm font-medium text-danger transition hover:bg-danger-soft"
						>
							<Icon name="trash" class="size-4" />
							{t('settings.data.deleteStart')}
						</button>
					{/if}
				</div>
			</section>

			<!-- Info -->
			<section id="info" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">{t('settings.sections.info')}</h2>
				<dl class="mt-3 divide-y divide-line rounded-xl border border-line bg-surface px-5 font-sans text-sm">
					<div class="flex justify-between gap-4 py-3">
						<dt class="text-muted">{t('settings.info.content')}</dt>
						<dd class="text-ink">
							{t('settings.info.modules', { count: modules.length })} · {t('settings.info.lessons', { count: allLessons.length })}
						</dd>
					</div>
					{#if course.compiler}
						<div class="flex justify-between gap-4 py-3">
							<dt class="text-muted">{t('settings.info.compiler')}</dt>
							<dd class="font-mono text-ink">{course.compiler}</dd>
						</div>
					{/if}
					{#if course.docs}
						<div class="flex justify-between gap-4 py-3">
							<dt class="text-muted">{t('settings.info.docs')}</dt>
							<dd>
								<a href={course.docs.url} class="inline-flex items-center gap-1 text-link hover:underline" target="_blank" rel="noreferrer"
									>{course.docs.label} <Icon name="external-link" class="size-3.5" /></a
								>
							</dd>
						</div>
					{/if}
					<div class="py-3 text-muted">
						{course.about}
					</div>
				</dl>
			</section>
		</div>
	</div>
</div>
