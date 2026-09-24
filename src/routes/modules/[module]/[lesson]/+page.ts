import { error } from '@sveltejs/kit';
import { allLessons, getLesson, getModule, getNeighbours, loadLessonComponent } from '$lib/content/registry';
import { t } from '$lib/i18n/index.svelte';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	allLessons.map((lesson) => ({ module: lesson.moduleSlug, lesson: lesson.slug }));

export const load: PageLoad = async ({ params }) => {
	const module = getModule(params.module);
	const lesson = getLesson(params.module, params.lesson);
	if (!module || !lesson) error(404, t('lesson.notFound'));

	const { default: content, metadata } = await loadLessonComponent(lesson);
	return { module, lesson, content, headings: metadata.headings ?? [], ...getNeighbours(lesson) };
};
