import { error } from '@sveltejs/kit';
import { getModule, modules } from '$lib/content/registry';
import { t } from '$lib/i18n/index.svelte';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => modules.map((module) => ({ module: module.slug }));

export const load: PageLoad = ({ params }) => {
	const module = getModule(params.module);
	if (!module) error(404, t('module.notFound'));
	return { module };
};
