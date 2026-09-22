import type { Component } from 'svelte';
import type { LessonHeading } from '$lib/markdown/remark-headings';

/** Metadata declared in each module folder's `module.json`. */
export interface ModuleMeta {
	title: string;
	subtitle: string;
	emoji: string;
	/** Free-form level label shown on the card, e.g. "Base", "Intermedio". */
	level: string;
	/** What the learner will be able to do at the end of the module. */
	goals: string[];
}

/** Frontmatter of a lesson `.svx` file (plus headings injected at build time). */
export interface LessonFrontmatter {
	title: string;
	description: string;
	/** Estimated reading time in minutes. */
	minutes: number;
	/** Injected at build time by remark-headings; only present on the loaded lesson module. */
	headings?: LessonHeading[];
}

export interface LessonRef {
	/** Stable id used for routing and progress: `<moduleSlug>/<lessonSlug>`. */
	id: string;
	slug: string;
	moduleSlug: string;
	order: number;
	/** Absolute-from-root source path, key of the lazy import.meta.glob map. */
	file: string;
	meta: LessonFrontmatter;
}

export interface ModuleRef {
	slug: string;
	order: number;
	meta: ModuleMeta;
	lessons: LessonRef[];
}

export interface LessonModule {
	default: Component;
	metadata: LessonFrontmatter;
}
