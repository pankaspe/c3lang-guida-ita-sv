/**
 * Milestones shown on the profile page. Each one is a pure check over the
 * learner's progress and activity, so there is nothing extra to persist.
 *
 * Generic milestones are translated through the UI dictionaries; courses can
 * add their own "complete these lessons" milestones in `course.json` (written
 * in the course language, like the rest of the content).
 */
import { isIconName, type IconName } from '$lib/components/ui/Icon.svelte';
import { course } from '$lib/content/course';
import { modules } from '$lib/content/registry';
import { t } from '$lib/i18n/index.svelte';

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

/**
 * All badges with their texts in the current UI language. Call it inside a
 * `$derived` so the texts follow language changes.
 */
export function getBadges(): Badge[] {
	const subject = course.subject;
	return [
		{
			id: 'first-step',
			title: t('badges.firstStep.title'),
			description: t('badges.firstStep.description'),
			icon: 'rocket',
			earned: (s) => s.completed.size >= 1
		},
		...(course.badges ?? []).map(
			(badge): Badge => ({
				id: badge.id,
				title: badge.title,
				description: badge.description,
				icon: isIconName(badge.icon) ? badge.icon : 'award',
				earned: (s) => badge.lessons.every((lesson) => s.completed.has(lesson))
			})
		),
		{
			id: 'sharp-eye',
			title: t('badges.sharpEye.title'),
			description: t('badges.sharpEye.description'),
			icon: 'target',
			earned: (s) => s.quizCorrect >= 5
		},
		{
			id: 'hands-on',
			title: t('badges.handsOn.title'),
			description: t('badges.handsOn.description'),
			icon: 'wrench',
			earned: (s) => s.exercisesSolved >= 3
		},
		{
			id: 'nerd',
			title: t('badges.nerd.title'),
			description: t('badges.nerd.description'),
			icon: 'cpu',
			earned: (s) => s.nerdOpened >= 5
		},
		{
			id: 'streak',
			title: t('badges.streak.title'),
			description: t('badges.streak.description'),
			icon: 'flame',
			earned: (s) => s.bestStreak >= 3
		},
		{
			id: 'hour',
			title: t('badges.hour.title', { subject }),
			description: t('badges.hour.description'),
			icon: 'clock',
			earned: (s) => s.totalSeconds >= 3600
		},
		// One per module ("module completed").
		...modules.map(
			(module): Badge => ({
				id: `module-${module.slug}`,
				title: t('badges.module.title', { number: module.order }),
				description: module.meta.title,
				icon: 'award',
				earned: (s) => module.lessons.every((lesson) => s.completed.has(lesson.id))
			})
		)
	];
}
