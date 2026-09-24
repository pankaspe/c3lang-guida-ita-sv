/**
 * Content registry. Modules and lessons are discovered from the file system
 * by the `course-index` Vite plugin (see src/lib/build/course-index.ts):
 *
 *   src/content/modules/<NN>-<module-slug>/module.json
 *   src/content/modules/<NN>-<module-slug>/<NN>-<lesson-slug>.svx
 *
 * The numeric prefix defines ordering; the rest becomes the URL slug.
 * Lesson components are loaded lazily, one chunk per lesson.
 * Adding a module or a lesson never requires touching application code.
 */
import courseIndex from 'virtual:course-index';
import { isIconName, type IconName } from '$lib/components/ui/Icon.svelte';
import type { LessonFrontmatter, LessonModule, LessonRef, ModuleMeta, ModuleRef } from './types.ts';

const MODULE_ROOT = '/src/content/modules/';

const lessonLoaders = import.meta.glob<LessonModule>('/src/content/modules/*/*.svx');

function buildRegistry(): ModuleRef[] {
	return courseIndex.map((module) => {
		const meta = module.meta as unknown as ModuleMeta;
		const lessons: LessonRef[] = module.lessons.map((lesson) => ({
			id: `${module.slug}/${lesson.slug}`,
			slug: lesson.slug,
			moduleSlug: module.slug,
			order: lesson.order,
			file: `${MODULE_ROOT}${module.folder}/${lesson.file}`,
			meta: lesson.meta as unknown as LessonFrontmatter
		}));
		return { slug: module.slug, order: module.order, meta, lessons };
	});
}

export const modules: ModuleRef[] = buildRegistry();

export const allLessons: LessonRef[] = modules.flatMap((module) => module.lessons);

export function getModule(slug: string): ModuleRef | undefined {
	return modules.find((module) => module.slug === slug);
}

export function getLesson(moduleSlug: string, lessonSlug: string): LessonRef | undefined {
	return getModule(moduleSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

/** Previous/next lesson across module boundaries, for the pager. */
export function getNeighbours(lesson: LessonRef): { previous?: LessonRef; next?: LessonRef } {
	const index = allLessons.findIndex((candidate) => candidate.id === lesson.id);
	return { previous: allLessons[index - 1], next: allLessons[index + 1] };
}

export async function loadLessonComponent(lesson: LessonRef): Promise<LessonModule> {
	const loader = lessonLoaders[lesson.file];
	if (!loader) throw new Error(`No lesson file for "${lesson.id}" (${lesson.file})`);
	return loader();
}

export function lessonPath(lesson: LessonRef): string {
	return `/moduli/${lesson.moduleSlug}/${lesson.slug}`;
}

export function modulePath(module: ModuleRef): string {
	return `/moduli/${module.slug}`;
}

/** Module icon from `module.json`, falling back to a neutral one if unknown. */
export function moduleIcon(name: string): IconName {
	return isIconName(name) ? name : 'layers';
}
