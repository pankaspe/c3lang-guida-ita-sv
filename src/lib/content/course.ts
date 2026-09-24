/**
 * Course-wide configuration from `src/content/course.json`: the texts that
 * belong to *this* course (title, hero, footer...) rather than to the app.
 * They are written in the course language, like the lessons; everything else
 * the UI shows comes from the i18n dictionaries (`src/lib/i18n`).
 */
import raw from '../../content/course.json';

export interface CourseBadge {
	id: string;
	title: string;
	description: string;
	/** Icon name from `Icon.svelte`. */
	icon: string;
	/** Lesson ids (`<moduleSlug>/<lessonSlug>`) that must all be completed. */
	lessons: string[];
}

export interface CourseConfig {
	/** Language of the content (BCP 47, e.g. "it"). Also the default UI language. */
	locale: string;
	/** Site name, used in the header and page titles. */
	title: string;
	/** What the course teaches, short (e.g. "C3"); used in generic UI strings. */
	subject: string;
	/** Short text in the header logo mark. */
	logo: string;
	tagline: string;
	/** Default meta description. */
	description: string;
	hero: {
		kicker: string;
		title: string;
		/** Part of `hero.title` rendered with the brand gradient. */
		highlight?: string;
		intro: string;
	};
	footer: string;
	/** Paragraph shown in Settings → Info. */
	about: string;
	docs?: { label: string; url: string };
	/** Reference toolchain every example was verified with, e.g. "c3c 0.8.4". */
	compiler?: string;
	/** Show the "more modules coming" placeholder card on the home page. */
	moreModulesComing?: boolean;
	badges?: CourseBadge[];
}

export const course: CourseConfig = raw;
