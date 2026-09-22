import { error } from '@sveltejs/kit';
import { getModule, modules } from '$lib/content/registry';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => modules.map((module) => ({ module: module.slug }));

export const load: PageLoad = ({ params }) => {
	const module = getModule(params.module);
	if (!module) error(404, 'Modulo non trovato');
	return { module };
};
