import type { Handle } from '@sveltejs/kit';
import { applyStoredPreferences } from '$lib/state/preferences';
import { course } from '$lib/content/course';

/**
 * Inline the preferences bootstrap into every prerendered page, so theme and
 * reader settings are applied before first paint (no flash). The function is
 * shared with the settings store, so there is one implementation only.
 */
const bootScript = `<script>try{(${applyStoredPreferences.toString()})()}catch(e){}</script>`;

export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		// <html lang> is the content language: lessons are what most of the page is.
		transformPageChunk: ({ html }) => html.replace('%c3.boot%', bootScript).replace('%c3.lang%', course.locale)
	});
