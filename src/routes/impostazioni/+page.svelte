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
	import { COMPILER_VERSION } from '$lib/course';
	import { feedback } from '$lib/feedback';

	const sections: { id: string; label: string; icon: IconName }[] = [
		{ id: 'aspetto', label: 'Aspetto', icon: 'palette' },
		{ id: 'lettura', label: 'Lettura', icon: 'book-open' },
		{ id: 'codice', label: 'Codice', icon: 'code' },
		{ id: 'esperienza', label: 'Esperienza', icon: 'sparkles' },
		{ id: 'dati', label: 'Dati', icon: 'database' },
		{ id: 'info', label: 'Info', icon: 'info' }
	];

	type Swatch = { paper: string; surface: string; accent: string; ink: string; line: string };
	const palettes: { value: Palette; label: string; description: string; light: Swatch; dark: Swatch }[] = [
		{
			value: 'c3',
			label: 'C3',
			description: 'Blu e viola del logo',
			light: { paper: '#f6f7fb', surface: '#ffffff', accent: '#4f46e5', ink: '#151a2d', line: '#dde0ec' },
			dark: { paper: '#0b0e1a', surface: '#121629', accent: '#8b8ff9', ink: '#e4e7f5', line: '#262c47' }
		},
		{
			value: 'paper',
			label: 'Carta',
			description: 'Caldo, da libro',
			light: { paper: '#f6f1e7', surface: '#fdfaf3', accent: '#b4512b', ink: '#2b2620', line: '#e0d7c5' },
			dark: { paper: '#1b1917', surface: '#232019', accent: '#e08a5c', ink: '#e6dfd2', line: '#3a352e' }
		},
		{
			value: 'terminal',
			label: 'Terminale',
			description: 'Fosfori verdi',
			light: { paper: '#f2f6f1', surface: '#fbfdfa', accent: '#15803d', ink: '#0f1f12', line: '#d0ddcf' },
			dark: { paper: '#070b08', surface: '#0c130e', accent: '#3ddc84', ink: '#c9f5d3', line: '#1b3021' }
		},
		{
			value: 'contrast',
			label: 'Alto contrasto',
			description: 'Massima leggibilità',
			light: { paper: '#ffffff', surface: '#ffffff', accent: '#1d2bd6', ink: '#000000', line: '#6b6b6b' },
			dark: { paper: '#000000', surface: '#000000', accent: '#ffd400', ink: '#ffffff', line: '#9a9a9a' }
		}
	];

	const prefs = $derived(settings.prefs);
	const isDefault = $derived(JSON.stringify(prefs) === JSON.stringify(DEFAULT_PREFERENCES));

	// --- Section navigation: highlight the section being read. -------------------
	let activeSection = $state('aspetto');

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

	function formatDate(iso: string): string {
		const date = new Date(iso);
		return Number.isNaN(date.getTime())
			? 'data sconosciuta'
			: date.toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'short' });
	}
</script>

<svelte:head>
	<title>Impostazioni · Impara C3</title>
	<meta name="description" content="Tema, lettura, codice, esperienza e gestione dei tuoi dati." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
	<p class="font-mono text-sm text-accent">// impostazioni</p>
	<h1 class="mt-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">Il corso, a modo tuo</h1>
	<p class="mt-3 max-w-2xl font-reading text-lg leading-relaxed text-ink-soft">
		Tema, lettura, codice ed esperienza. Ogni modifica si applica subito, a tutte le pagine.
	</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
		<!-- Section navigation: horizontal chips on mobile, sticky list on desktop -->
		<nav
			class="sticky top-[61px] z-10 -mx-4 overflow-x-auto border-b border-line bg-paper/90 px-4 py-2 backdrop-blur lg:top-24 lg:mx-0 lg:self-start lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0"
			aria-label="Sezioni delle impostazioni"
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
							{section.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="min-w-0" {@attach trackSections}>
			<!-- Aspetto -->
			<section id="aspetto" class="scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Aspetto</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="monitor" title="Tema" description="«Sistema» segue le impostazioni del tuo dispositivo.">
						<Segmented
							label="Tema"
							value={prefs.mode}
							onchange={(mode) => settings.update({ mode })}
							options={[
								{ value: 'system', label: 'Sistema', icon: 'monitor' },
								{ value: 'light', label: 'Chiaro', icon: 'sun' },
								{ value: 'dark', label: 'Scuro', icon: 'moon' }
							]}
						/>
					</SettingRow>
					<div class="py-5">
						<div class="flex gap-3">
							<Icon name="palette" class="mt-0.5 size-5 text-muted" />
							<div>
								<p class="font-sans text-sm font-semibold text-ink">Palette</p>
								<p class="mt-0.5 font-sans text-sm text-muted">Ogni palette ha una versione chiara e una scura.</p>
							</div>
						</div>
						<div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup" aria-label="Palette">
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
										{palette.label}
										{#if active}<Icon name="check" class="size-4 text-accent" />{/if}
									</span>
									<span class="block px-0.5 font-sans text-xs text-muted">{palette.description}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</section>

			<!-- Lettura -->
			<section id="lettura" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Lettura</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="type" title="Carattere" description="Il font del testo delle lezioni.">
						<Segmented
							label="Carattere"
							value={prefs.font}
							onchange={(font) => settings.update({ font })}
							options={[
								{ value: 'serif', label: 'Serif' },
								{ value: 'sans', label: 'Sans serif' }
							]}
						/>
					</SettingRow>
					<SettingRow icon="type" title="Dimensione del testo" description="Ingrandisce tutto il sito.">
						<Segmented
							label="Dimensione del testo"
							value={prefs.textSize}
							onchange={(textSize) => settings.update({ textSize })}
							options={[
								{ value: 100, label: '100%' },
								{ value: 125, label: '125%' },
								{ value: 150, label: '150%' }
							]}
						/>
					</SettingRow>
					<SettingRow icon="layers" title="Interlinea" description="Lo spazio tra una riga e l'altra.">
						<Segmented
							label="Interlinea"
							value={prefs.lineHeight}
							onchange={(lineHeight) => settings.update({ lineHeight })}
							options={[
								{ value: 'compact', label: 'Compatta' },
								{ value: 'normal', label: 'Normale' },
								{ value: 'relaxed', label: 'Ariosa' }
							]}
						/>
					</SettingRow>
					<SettingRow icon="book-open" title="Larghezza della colonna" description="Righe più corte si leggono più in fretta.">
						<Segmented
							label="Larghezza della colonna"
							value={prefs.measure}
							onchange={(measure) => settings.update({ measure })}
							options={[
								{ value: 'narrow', label: 'Stretta' },
								{ value: 'normal', label: 'Normale' },
								{ value: 'wide', label: 'Larga' }
							]}
						/>
					</SettingRow>
					<SettingRow
						icon="eye"
						title="Modalità riflettore"
						description="Mette in risalto la sezione che stai leggendo e attenua le altre."
					>
						<Switch label="Modalità riflettore" checked={prefs.focus} onchange={(focus) => settings.update({ focus })} />
					</SettingRow>
				</div>

				<div class="lesson-prose prose mt-4 max-w-(--reading-measure) rounded-xl border border-dashed border-line px-5 py-4">
					<p class="!my-0">
						<span class="font-mono text-xs text-muted not-italic">anteprima ·</span>
						Una variabile è una scatola con un'etichetta: il <strong>nome</strong>, il <strong>tipo</strong> e il
						<strong>valore</strong>. Per esempio <code>int age = 34;</code> crea una scatola per numeri interi e ci mette
						dentro 34.
					</p>
				</div>
			</section>

			<!-- Codice -->
			<section id="codice" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Codice</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="code" title="Dimensione del codice" description="Solo per i blocchi di codice e l'output.">
						<Segmented
							label="Dimensione del codice"
							value={prefs.codeSize}
							onchange={(codeSize) => settings.update({ codeSize })}
							options={[
								{ value: 90, label: 'Piccolo' },
								{ value: 100, label: 'Normale' },
								{ value: 115, label: 'Grande' }
							]}
						/>
					</SettingRow>
					<SettingRow
						icon="terminal"
						title="Legature"
						description="Disegna != come ≠ e -> come una freccia. Belle, ma all'inizio possono confondere."
					>
						<Switch label="Legature" checked={prefs.ligatures} onchange={(ligatures) => settings.update({ ligatures })} />
					</SettingRow>
				</div>
				<figure class="code-block not-prose mt-4 overflow-hidden rounded-lg border border-line" data-lang="c3">
					<pre><code
							><span class="token keyword">if</span> <span class="token punctuation">(</span>a <span class="token operator">!=</span> b <span class="token operator">&amp;&amp;</span> x <span class="token operator">&gt;=</span> <span class="token number">10</span><span class="token punctuation">)</span> io<span class="token punctuation">::</span><span class="token function">printn</span><span class="token punctuation">(</span><span class="token string">"ok"</span><span class="token punctuation">);</span> <span class="token comment">// != &amp;&amp; &gt;= -&gt;</span></code
						></pre>
				</figure>
			</section>

			<!-- Esperienza -->
			<section id="esperienza" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Esperienza</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface px-5">
					<SettingRow icon="sparkles" title="Animazioni" description="«Sistema» rispetta la scelta «riduci movimento» del dispositivo.">
						<Segmented
							label="Animazioni"
							value={prefs.motion}
							onchange={(motion) => settings.update({ motion })}
							options={[
								{ value: 'system', label: 'Sistema' },
								{ value: 'full', label: 'Attive' },
								{ value: 'reduced', label: 'Ridotte' }
							]}
						/>
					</SettingRow>
					<SettingRow icon="volume" title="Suoni" description="Piccoli suoni per quiz, esercizi e lezioni completate.">
						<div class="flex items-center gap-3">
							<button
								type="button"
								onclick={() => feedback('success', true)}
								class="font-sans text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
							>
								Prova
							</button>
							<Switch label="Suoni" checked={prefs.sound} onchange={(sound) => settings.update({ sound })} />
						</div>
					</SettingRow>
					<SettingRow icon="smartphone" title="Vibrazione" description="Un breve feedback tattile, sui dispositivi che lo supportano.">
						<Switch label="Vibrazione" checked={prefs.haptics} onchange={(haptics) => settings.update({ haptics })} />
					</SettingRow>
				</div>
				<button
					type="button"
					onclick={() => settings.reset()}
					disabled={isDefault}
					class="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 font-sans text-sm font-medium text-ink-soft transition hover:border-accent hover:text-ink disabled:opacity-40 disabled:hover:border-line"
				>
					<Icon name="history" class="size-4" /> Ripristina tutte le impostazioni
				</button>
			</section>

			<!-- Dati -->
			<section id="dati" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Dati</h2>
				<div class="mt-3 rounded-xl border border-line bg-surface p-5">
					<div class="flex gap-3">
						<Icon name="lock" class="mt-0.5 size-5 text-muted" />
						<p class="font-sans text-sm text-ink-soft">
							Progressi, profilo e impostazioni vivono <strong class="text-ink">solo in questo browser</strong>, nel suo
							<code class="font-mono text-xs">localStorage</code>. Nessun account, nessun server. Se cambi browser o
							dispositivo, esporta un backup e importalo di là.
						</p>
					</div>
					<dl class="mt-4 grid grid-cols-2 gap-3 font-sans sm:max-w-md">
						<div class="rounded-lg bg-surface-2 px-3 py-2">
							<dt class="text-xs text-muted">Lezioni completate</dt>
							<dd class="font-mono text-lg text-ink">{progress.completed.size}/{allLessons.length}</dd>
						</div>
						<div class="rounded-lg bg-surface-2 px-3 py-2">
							<dt class="text-xs text-muted">Spazio occupato</dt>
							<dd class="font-mono text-lg text-ink">{(bytes / 1024).toFixed(1)} KB</dd>
						</div>
					</dl>
				</div>

				<div class="mt-3 grid gap-3 md:grid-cols-2">
					<div class="rounded-xl border border-line bg-surface p-5">
						<p class="flex items-center gap-2 font-sans text-sm font-semibold text-ink">
							<Icon name="download" class="size-4 text-muted" /> Esporta
						</p>
						<p class="mt-1 font-sans text-sm text-muted">Scarica un file JSON con tutti i tuoi dati.</p>
						<button
							type="button"
							onclick={downloadBackup}
							class="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-sm font-semibold text-accent-ink transition hover:opacity-90"
						>
							<Icon name="download" class="size-4" /> Scarica backup
						</button>
					</div>

					<div class="rounded-xl border border-line bg-surface p-5">
						<p class="flex items-center gap-2 font-sans text-sm font-semibold text-ink">
							<Icon name="upload" class="size-4 text-muted" /> Importa
						</p>
						<p class="mt-1 font-sans text-sm text-muted">Ripristina da un backup: sostituisce i dati attuali.</p>
						<input bind:this={fileInput} type="file" accept="application/json,.json" class="hidden" onchange={pickBackup} />
						{#if pendingBackup}
							<div class="anim-rise mt-4 rounded-lg border border-warning bg-warning-soft p-3 font-sans text-sm text-ink">
								Backup del <strong>{formatDate(pendingBackup.exportedAt)}</strong>
								({Object.keys(pendingBackup.data).length} voci). Sostituire i dati attuali?
								<div class="mt-3 flex gap-2">
									<button type="button" onclick={applyBackup} class="rounded-md bg-accent px-3 py-1.5 font-semibold text-accent-ink hover:opacity-90">
										Ripristina
									</button>
									<button type="button" onclick={() => (pendingBackup = null)} class="rounded-md px-3 py-1.5 text-muted hover:text-ink">
										Annulla
									</button>
								</div>
							</div>
						{:else}
							<button
								type="button"
								onclick={() => fileInput.click()}
								class="mt-4 inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-sans text-sm font-medium text-ink-soft transition hover:border-accent hover:text-ink"
							>
								<Icon name="upload" class="size-4" /> Scegli un file…
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
						<Icon name="trash" class="size-4" /> Elimina tutti i dati
					</p>
					<p class="mt-1 font-sans text-sm text-muted">
						Cancella progressi, profilo e impostazioni da questo browser. Non si può annullare: se vuoi, esporta prima un backup.
					</p>
					{#if confirmingDelete}
						<div class="anim-rise mt-4 font-sans text-sm">
							<label class="block text-ink-soft">
								Per confermare scrivi <strong class="font-mono text-danger">elimina</strong>
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
									disabled={deleteText.trim().toLowerCase() !== 'elimina'}
									class="rounded-md bg-danger px-3 py-1.5 font-semibold text-paper transition hover:opacity-90 disabled:opacity-40"
								>
									Elimina definitivamente
								</button>
								<button
									type="button"
									onclick={() => {
										confirmingDelete = false;
										deleteText = '';
									}}
									class="rounded-md px-3 py-1.5 text-muted hover:text-ink"
								>
									Annulla
								</button>
							</div>
						</div>
					{:else}
						<button
							type="button"
							onclick={() => (confirmingDelete = true)}
							class="mt-4 inline-flex items-center gap-2 rounded-md border border-danger/60 px-4 py-2 font-sans text-sm font-medium text-danger transition hover:bg-danger-soft"
						>
							<Icon name="trash" class="size-4" /> Elimina…
						</button>
					{/if}
				</div>
			</section>

			<!-- Info -->
			<section id="info" class="mt-10 scroll-mt-32 lg:scroll-mt-24">
				<h2 class="font-mono text-xs font-semibold tracking-wider text-muted uppercase">Info</h2>
				<dl class="mt-3 divide-y divide-line rounded-xl border border-line bg-surface px-5 font-sans text-sm">
					<div class="flex justify-between gap-4 py-3">
						<dt class="text-muted">Contenuti</dt>
						<dd class="text-ink">{modules.length} {modules.length === 1 ? 'modulo' : 'moduli'} · {allLessons.length} lezioni</dd>
					</div>
					<div class="flex justify-between gap-4 py-3">
						<dt class="text-muted">Compilatore di riferimento</dt>
						<dd class="font-mono text-ink">c3c {COMPILER_VERSION}</dd>
					</div>
					<div class="flex justify-between gap-4 py-3">
						<dt class="text-muted">Documentazione ufficiale</dt>
						<dd>
							<a href="https://c3-lang.org" class="inline-flex items-center gap-1 text-link hover:underline" target="_blank" rel="noreferrer"
								>c3-lang.org <Icon name="external-link" class="size-3.5" /></a
							>
						</dd>
					</div>
					<div class="py-3 text-muted">
						Corso non ufficiale, in italiano. Gli esempi sono verificati con il compilatore vero prima di finire in una
						lezione.
					</div>
				</dl>
			</section>
		</div>
	</div>
</div>
