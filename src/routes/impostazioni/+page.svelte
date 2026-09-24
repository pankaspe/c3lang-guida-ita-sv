<script lang="ts">
	import { settings, TEXT_SIZES, type ReadingFont } from '$lib/state/settings.svelte';

	const fonts: { value: ReadingFont; label: string; sample: string; family: string }[] = [
		{
			value: 'serif',
			label: 'Serif',
			sample: 'Literata: classica, da libro',
			family: "'Literata Variable', ui-serif, Georgia, serif"
		},
		{
			value: 'sans',
			label: 'Sans serif',
			sample: 'Inter: pulita, da schermo',
			family: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
		}
	];

	const isDefault = $derived(settings.font === 'serif' && settings.textSize === 100);
</script>

<svelte:head>
	<title>Impostazioni · Impara C3</title>
	<meta name="description" content="Scegli il carattere e la dimensione del testo delle lezioni." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
	<p class="font-mono text-sm text-accent">// impostazioni</p>
	<h1 class="mt-2 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
		Leggi come preferisci
	</h1>
	<p class="mt-3 font-reading text-lg leading-relaxed text-ink-soft">
		Scegli il carattere e la dimensione del testo. Le modifiche si applicano subito, a tutte le
		pagine del corso.
	</p>

	<section class="mt-10" aria-labelledby="font-heading">
		<h2 id="font-heading" class="font-sans text-sm font-semibold tracking-wide text-muted uppercase">
			Carattere delle lezioni
		</h2>
		<div class="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="font-heading">
			{#each fonts as font (font.value)}
				{@const active = settings.font === font.value}
				<button
					type="button"
					role="radio"
					aria-checked={active}
					onclick={() => settings.setFont(font.value)}
					class={[
						'rounded-lg border bg-surface p-4 text-left transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
						active ? 'border-accent ring-1 ring-accent' : 'border-line hover:border-accent'
					]}
				>
					<span class="flex items-center justify-between gap-2 font-sans text-sm font-semibold text-ink">
						{font.label}
						{#if active}<span class="font-mono text-xs text-accent">✓ attivo</span>{/if}
					</span>
					<span class="mt-2 block text-2xl text-ink" style:font-family={font.family}>Aa Bb 123</span>
					<span class="mt-1 block text-sm text-muted" style:font-family={font.family}>{font.sample}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="mt-10" aria-labelledby="size-heading">
		<h2 id="size-heading" class="font-sans text-sm font-semibold tracking-wide text-muted uppercase">
			Dimensione del testo
		</h2>
		<div
			class="mt-3 inline-flex rounded-lg border border-line bg-surface p-1"
			role="radiogroup"
			aria-labelledby="size-heading"
		>
			{#each TEXT_SIZES as size (size)}
				{@const active = settings.textSize === size}
				<button
					type="button"
					role="radio"
					aria-checked={active}
					onclick={() => settings.setTextSize(size)}
					class={[
						'rounded-md px-4 py-1.5 font-mono text-sm transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
						active ? 'bg-accent font-semibold text-accent-ink' : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
					]}
				>
					{size}%
				</button>
			{/each}
		</div>
	</section>

	<section class="mt-10" aria-labelledby="preview-heading">
		<h2 id="preview-heading" class="font-sans text-sm font-semibold tracking-wide text-muted uppercase">
			Anteprima
		</h2>
		<div class="lesson-prose prose mt-3 max-w-none rounded-lg border border-line bg-surface px-5 py-4">
			<p>
				Una variabile è una scatola con un'etichetta: il <strong>nome</strong>, il
				<strong>tipo</strong> e il <strong>valore</strong>. Per esempio <code>int age = 34;</code>
				crea una scatola per numeri interi e ci mette dentro 34.
			</p>
		</div>
	</section>

	<div class="mt-10 flex flex-wrap items-center gap-4">
		<button
			type="button"
			onclick={() => settings.reset()}
			disabled={isDefault}
			class="rounded-md border border-line bg-surface px-4 py-2 font-sans text-sm font-medium text-ink-soft transition hover:border-accent hover:text-ink disabled:opacity-40 disabled:hover:border-line"
		>
			Ripristina i valori predefiniti
		</button>
	</div>

	<aside class="mt-10 rounded-lg border border-line bg-surface-2 px-5 py-4 font-sans text-sm text-muted">
		<p class="font-semibold text-ink-soft">🔒 Dove finiscono queste scelte?</p>
		<p class="mt-1">
			Le impostazioni (come il tema e i tuoi progressi) vivono solo in questo browser, salvate nel suo
			<code class="font-mono text-xs">localStorage</code>. Nessun account, nessun server: se cambi
			browser o dispositivo, o cancelli i dati del sito, ripartono dai valori predefiniti.
		</p>
	</aside>
</div>
