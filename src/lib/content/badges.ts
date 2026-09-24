/**
 * Milestones shown on the profile page. Each one is a pure check over the
 * learner's progress and activity, so there is nothing extra to persist.
 */
import type { IconName } from '$lib/components/ui/Icon.svelte';
import { modules } from '$lib/content/registry';

export interface BadgeStats {
	completed: ReadonlySet<string>;
	quizCorrect: number;
	exercisesSolved: number;
	nerdOpened: number;
	bestStreak: number;
	totalSeconds: number;
}

export interface Badge {
	id: string;
	title: string;
	description: string;
	icon: IconName;
	earned: (stats: BadgeStats) => boolean;
}

const BASE_BADGES: Badge[] = [
	{
		id: 'first-step',
		title: 'Primo passo',
		description: 'Completa la tua prima lezione',
		icon: 'rocket',
		earned: (s) => s.completed.size >= 1
	},
	{
		id: 'hello-world',
		title: 'Hello, World!',
		description: 'Completa la lezione sul primo programma',
		icon: 'terminal',
		earned: (s) => s.completed.has('primi-passi/hello-world')
	},
	{
		id: 'sharp-eye',
		title: 'Occhio di falco',
		description: '5 quiz giusti al primo tentativo',
		icon: 'target',
		earned: (s) => s.quizCorrect >= 5
	},
	{
		id: 'hands-on',
		title: 'Mani in pasta',
		description: 'Risolvi 3 esercizi sul tuo computer',
		icon: 'wrench',
		earned: (s) => s.exercisesSolved >= 3
	},
	{
		id: 'nerd',
		title: 'Curiosità nerd',
		description: 'Apri 5 riquadri «Dettagli nerd»',
		icon: 'cpu',
		earned: (s) => s.nerdOpened >= 5
	},
	{
		id: 'streak',
		title: 'Costanza',
		description: 'Studia 3 giorni di fila',
		icon: 'flame',
		earned: (s) => s.bestStreak >= 3
	},
	{
		id: 'hour',
		title: "Un'ora di C3",
		description: '60 minuti di studio in totale',
		icon: 'clock',
		earned: (s) => s.totalSeconds >= 3600
	}
];

/** Base badges plus one per module ("module completed"). */
export const BADGES: Badge[] = [
	...BASE_BADGES,
	...modules.map(
		(module): Badge => ({
			id: `module-${module.slug}`,
			title: `Modulo ${module.order} completato`,
			description: module.meta.title,
			icon: 'award',
			earned: (s) => module.lessons.every((lesson) => s.completed.has(lesson.id))
		})
	)
];
