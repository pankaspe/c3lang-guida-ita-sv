/**
 * Italian UI dictionary. This is the reference locale: its shape defines the
 * `Messages` type every other locale must match (see ../types.ts).
 *
 * - `{name}` placeholders are filled from the params passed to `t()`.
 * - An object with `one`/`other` (and optionally `zero`/`few`/`many`) is a
 *   plural: the form is picked from the `count` param via Intl.PluralRules.
 * - Keys ending in `Md` are rendered with the inline-markdown renderer
 *   (`code`, **bold**, *italic*).
 */
const it = {
	meta: {
		/** Name of this language, in this language (for the language picker). */
		languageName: 'Italiano'
	},
	common: {
		cancel: 'Annulla',
		save: 'Salva',
		minutes: '{minutes} min',
		unknownDate: 'data sconosciuta',
		justNow: 'proprio ora',
		close: 'Chiudi'
	},
	nav: {
		profile: 'Profilo',
		profileAria: 'Il tuo profilo',
		settings: 'Impostazioni',
		toLight: 'Passa al tema chiaro',
		toDark: 'Passa al tema scuro',
		lightTheme: 'Tema chiaro',
		darkTheme: 'Tema scuro'
	},
	footer: {
		basedOn: 'basato sulla documentazione di',
		settings: 'Impostazioni',
		shortcuts: 'Scorciatoie da tastiera',
		course: 'Corso',
		resources: 'Risorse',
		home: 'Tutti i moduli',
		profile: 'Il tuo profilo',
		privacy: 'Privacy',
		docs: 'Documentazione di C3',
		source: 'Codice sorgente su GitHub',
		issue: 'Segnala un errore',
		verifiedWith: 'esempi verificati con {compiler}'
	},
	privacy: {
		title: 'Privacy',
		description: 'Come questo sito tratta i tuoi dati: niente cookie, niente tracciamento, tutto resta nel tuo browser.',
		kicker: '// privacy',
		heading: 'Privacy',
		introMd: 'In breve: questo sito **non usa cookie**, **non traccia nessuno** e **non ha un server che riceve i tuoi dati**. I tuoi progressi restano nel tuo browser.',
		updated: 'Ultimo aggiornamento: {date}',
		storage: {
			title: 'Cosa viene salvato, e dove',
			bodyMd:
				'Progressi, nome del profilo, preferenze (tema, lettura, codice), tempo di studio e risultati di quiz ed esercizi sono salvati **solo nel `localStorage` del tuo browser**, sotto chiavi che iniziano con `c3-course:`. Non vengono mai inviati da nessuna parte: restano sul tuo dispositivo.'
		},
		tracking: {
			title: 'Niente cookie, niente tracciamento',
			bodyMd:
				'Il sito non imposta cookie e non usa strumenti di analisi, pubblicità o profilazione. Non carica nulla da servizi esterni: font, script e stili sono serviti dal sito stesso. Per questo non trovi nessun banner da accettare.'
		},
		hosting: {
			title: 'Hosting',
			bodyMd:
				'Il sito è ospitato su **Cloudflare Pages**. Come qualsiasi server web, Cloudflare riceve i dati tecnici necessari a consegnarti le pagine (indirizzo IP, tipo di browser, pagina richiesta) e può conservarli per un periodo limitato per sicurezza e prevenzione degli abusi, secondo la propria informativa.',
			link: 'Informativa privacy di Cloudflare'
		},
		control: {
			title: 'I tuoi dati, le tue regole',
			bodyMd:
				'Da **Impostazioni → Dati** puoi esportare tutto in un file JSON, reimportarlo su un altro dispositivo o cancellare tutto con un clic. Anche cancellare i dati del sito dalle impostazioni del browser rimuove ogni cosa.',
			link: 'Vai a Impostazioni → Dati'
		},
		contact: {
			title: 'Contatti',
			bodyMd: 'Hai domande o dubbi su questa pagina? Apri una issue sul repository del progetto.',
			link: 'Apri una issue su GitHub'
		}
	},
	home: {
		continue: 'Continua da dove eri',
		start: 'Inizia il percorso',
		modules: 'Moduli',
		moreComing: 'Altri moduli in arrivo…'
	},
	module: {
		breadcrumb: 'Percorso',
		modules: 'Moduli',
		number: 'Modulo {number}',
		lessons: { one: '{count} lezione', other: '{count} lezioni' },
		readingTime: 'circa {minutes} minuti di lettura',
		level: 'livello {level}',
		goals: 'Alla fine saprai',
		notFound: 'Modulo non trovato'
	},
	lesson: {
		position: 'Lezione {position} di {total}',
		readingTime: '{minutes} min di lettura',
		completed: 'Lezione completata',
		copy: 'Copia lezione',
		copied: 'Lezione copiata',
		copyHint: 'Copia il testo della lezione in markdown',
		markCompleted: 'Segna come completata',
		cheer: 'Bravo! Pronto per la prossima?',
		pager: 'Lezione precedente e successiva',
		previous: 'Precedente',
		next: 'Successiva',
		finished: 'Hai finito le lezioni disponibili. Torna ai moduli',
		toc: 'In questa lezione',
		notFound: 'Lezione non trovata'
	},
	callout: {
		tip: 'Consiglio',
		note: 'Nota',
		warning: 'Attenzione',
		fun: 'Curiosità',
		c: 'Se vieni dal C',
		deep: 'Approfondimento',
		nerd: 'Dettagli nerd'
	},
	code: {
		terminal: 'terminale',
		copy: 'Copia',
		copied: 'Copiato'
	},
	quiz: {
		label: 'Quiz',
		correct: 'Esatto!',
		wrong: 'Non proprio.',
		retry: 'Riprova'
	},
	exercise: {
		label: 'Esercizio · sul tuo computer',
		solvedOn: 'risolto il {date}',
		prompt: 'Cosa ha stampato il programma?',
		placeholder: "Scrivi qui l'output",
		placeholderMultiline: "Incolla qui l'output, riga per riga",
		check: 'Verifica',
		success: 'Perfetto, è proprio così!',
		mismatch: 'Non coincide.',
		mismatchHint: 'Riesegui il programma e confronta con calma, spazi inclusi.',
		retry: 'Ricomincia',
		done: 'Fatto! Avanti così.',
		markDone: 'Segna come fatto quando hai finito'
	},
	solution: {
		title: 'Mostra una soluzione',
		tryFirst: '(prima prova da solo!)'
	},
	profile: {
		title: 'Profilo',
		description: 'I tuoi progressi, le statistiche e i traguardi raggiunti.',
		kicker: '// profilo',
		defaultName: 'Studente {subject}',
		nameLabel: 'Il tuo nome',
		namePlaceholder: 'Come ti chiami?',
		editName: 'Modifica il nome',
		since: 'In viaggio dal {date}',
		notStarted: 'Il viaggio comincia con la prima lezione',
		badgesCount: '{earned}/{total} traguardi',
		resume: 'Riprendi da qui · {ago}',
		startTitle: 'Inizia il percorso',
		startHint: 'Le tue statistiche prenderanno vita dalla prima lezione.',
		statsHeading: 'Statistiche',
		activityHeading: 'Attività',
		modulesHeading: 'Moduli',
		badgesHeading: 'Traguardi · {earned}/{total}',
		localOnly: 'Il profilo vive solo in questo browser.',
		manageData: 'Esporta o elimina i dati',
		stats: {
			lessons: 'Lezioni completate',
			lessonsHint: '{percent}% del corso',
			quiz: 'Precisione nei quiz',
			quizHint: '{correct} su {answered} al primo colpo',
			exercises: 'Esercizi risolti',
			exercisesHint: 'sul tuo computer',
			time: 'Tempo di studio',
			timeHint: 'lettura attiva',
			streak: 'Serie attuale',
			streakValue: { one: '{count} giorno', other: '{count} giorni' },
			streakHint: 'record: {best}'
		},
		duration: {
			minutes: '{minutes} min',
			hours: '{hours} h {minutes} min'
		}
	},
	heatmap: {
		aria: "Calendario dell'attività delle ultime {weeks} settimane",
		cell: '{date}: {minutes} min, {actions}',
		actions: { one: '{count} azione', other: '{count} azioni' },
		less: 'meno',
		more: 'più'
	},
	badges: {
		firstStep: { title: 'Primo passo', description: 'Completa la tua prima lezione' },
		sharpEye: { title: 'Occhio di falco', description: '5 quiz giusti al primo tentativo' },
		handsOn: { title: 'Mani in pasta', description: 'Risolvi 3 esercizi sul tuo computer' },
		nerd: { title: 'Curiosità nerd', description: 'Apri 5 riquadri «Dettagli nerd»' },
		streak: { title: 'Costanza', description: 'Studia 3 giorni di fila' },
		hour: { title: "Un'ora di {subject}", description: '60 minuti di studio in totale' },
		module: { title: 'Modulo {number} completato' }
	},
	settings: {
		title: 'Impostazioni',
		description: 'Tema, lettura, codice, esperienza e gestione dei tuoi dati.',
		kicker: '// impostazioni',
		heading: 'Il corso, a modo tuo',
		intro: 'Tema, lettura, codice ed esperienza. Ogni modifica si applica subito, a tutte le pagine.',
		sectionsAria: 'Sezioni delle impostazioni',
		sections: {
			appearance: 'Aspetto',
			reading: 'Lettura',
			code: 'Codice',
			experience: 'Esperienza',
			keyboard: 'Tastiera',
			data: 'Dati',
			info: 'Info'
		},
		language: {
			title: "Lingua dell'interfaccia",
			description: "Solo i testi dell'app: le lezioni restano in {language}.",
			auto: 'Come il corso'
		},
		theme: {
			title: 'Tema',
			description: '«Sistema» segue le impostazioni del tuo dispositivo.',
			system: 'Sistema',
			light: 'Chiaro',
			dark: 'Scuro'
		},
		palette: {
			title: 'Palette',
			description: 'Ogni palette ha una versione chiara e una scura.',
			c3: { label: 'C3', description: 'Blu e viola del logo' },
			paper: { label: 'Carta', description: 'Caldo, da libro' },
			terminal: { label: 'Terminale', description: 'Fosfori verdi' },
			contrast: { label: 'Alto contrasto', description: 'Massima leggibilità' }
		},
		font: {
			title: 'Carattere',
			description: 'Il font del testo delle lezioni.',
			serif: 'Serif',
			sans: 'Sans serif'
		},
		textSize: { title: 'Dimensione del testo', description: 'Ingrandisce tutto il sito.' },
		lineHeight: {
			title: 'Interlinea',
			description: "Lo spazio tra una riga e l'altra.",
			compact: 'Compatta',
			normal: 'Normale',
			relaxed: 'Ariosa'
		},
		measure: {
			title: 'Larghezza della colonna',
			description: 'Righe più corte si leggono più in fretta.',
			narrow: 'Stretta',
			normal: 'Normale',
			wide: 'Larga'
		},
		focus: {
			title: 'Modalità riflettore',
			description: 'Mette in risalto la sezione che stai leggendo e attenua le altre.'
		},
		snap: {
			title: 'Scorrimento a sezioni',
			description: "Quando ti fermi vicino all'inizio di una sezione, la pagina si aggancia lì."
		},
		preview: 'anteprima ·',
		previewTextMd:
			"Una variabile è una scatola con un'etichetta: il **nome**, il **tipo** e il **valore**. Per esempio `int age = 34;` crea una scatola per numeri interi e ci mette dentro 34.",
		codeSize: {
			title: 'Dimensione del codice',
			description: "Solo per i blocchi di codice e l'output.",
			small: 'Piccolo',
			normal: 'Normale',
			large: 'Grande'
		},
		ligatures: {
			title: 'Legature',
			description: "Disegna != come ≠ e -> come una freccia. Belle, ma all'inizio possono confondere."
		},
		motion: {
			title: 'Animazioni',
			description:
				'«Nessuna» toglie tutte le animazioni, dissolvenze comprese. «Sistema» segue la scelta «riduci movimento» del dispositivo.',
			system: 'Sistema',
			full: 'Attive',
			reduced: 'Nessuna'
		},
		sound: {
			title: 'Suoni',
			description: 'Piccoli suoni per quiz, esercizi e lezioni completate.',
			try: 'Prova'
		},
		haptics: {
			title: 'Vibrazione',
			description: 'Un breve feedback tattile, sui dispositivi che lo supportano.'
		},
		reset: 'Ripristina tutte le impostazioni',
		data: {
			localMd:
				'Progressi, profilo e impostazioni vivono **solo in questo browser**, nel suo `localStorage`. Nessun account, nessun server. Se cambi browser o dispositivo, esporta un backup e importalo di là.',
			completed: 'Lezioni completate',
			storage: 'Spazio occupato',
			exportTitle: 'Esporta',
			exportDescription: 'Scarica un file JSON con tutti i tuoi dati.',
			exportButton: 'Scarica backup',
			importTitle: 'Importa',
			importDescription: 'Ripristina da un backup: sostituisce i dati attuali.',
			importConfirmMd: 'Backup del **{date}** ({entries}). Sostituire i dati attuali?',
			importEntries: { one: '{count} voce', other: '{count} voci' },
			importRestore: 'Ripristina',
			importPick: 'Scegli un file…',
			deleteTitle: 'Elimina tutti i dati',
			deleteDescription:
				'Cancella progressi, profilo e impostazioni da questo browser. Non si può annullare: se vuoi, esporta prima un backup.',
			deleteConfirm: 'Per confermare scrivi',
			/** The word the learner must type to confirm the deletion. */
			deleteWord: 'elimina',
			deleteForever: 'Elimina definitivamente',
			deleteStart: 'Elimina…'
		},
		info: {
			content: 'Contenuti',
			modules: { one: '{count} modulo', other: '{count} moduli' },
			lessons: { one: '{count} lezione', other: '{count} lezioni' },
			compiler: 'Compilatore di riferimento',
			docs: 'Documentazione ufficiale'
		}
	},
	cheatsheet: {
		open: 'Prontuario',
		openAria: 'Apri il prontuario del linguaggio',
		title: 'Prontuario',
		intro: 'Parole chiave e sintassi viste finora, in una pagina sola.',
		search: 'Cerca: for, printf, %d…',
		searchLabel: 'Cerca nel prontuario',
		loading: 'Caricamento…',
		empty: 'Nessuna voce per «{query}».',
		results: { one: '{count} voce', other: '{count} voci' },
		lesson: 'Vista nella lezione {number}: {title}',
		escHint: 'per chiudere'
	},
	shortcuts: {
		title: 'Scorciatoie da tastiera',
		intro:
			'Il corso si naviga anche solo con la tastiera. Le lettere non funzionano mentre stai scrivendo in un campo di testo: premi Esc per uscirne.',
		groups: {
			global: 'Ovunque',
			lesson: 'Nelle lezioni'
		},
		actions: {
			cheatsheet: 'Apri o chiudi il prontuario',
			help: 'Mostra queste scorciatoie',
			theme: 'Passa dal tema chiaro a quello scuro',
			close: 'Chiudi la finestra aperta',
			focus: 'Passa al link o pulsante successivo / precedente',
			next: 'Lezione successiva',
			previous: 'Lezione precedente',
			check: 'Verifica la risposta di un esercizio'
		},
		keys: {
			esc: 'Esc',
			tab: 'Tab',
			shift: 'Maiusc',
			enter: 'Invio'
		}
	},
	backup: {
		invalidJson: 'Il file non è un JSON valido.',
		notABackup: 'Questo file non sembra un backup di {title}.',
		tooNew: 'Il backup viene da una versione più recente del corso.'
	}
};

export default it;
