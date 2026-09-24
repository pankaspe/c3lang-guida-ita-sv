import type { Handle } from '@sveltejs/kit';
import { applyStoredPreferences } from '$lib/state/preferences';

/**
 * Inline the preferences bootstrap into every prerendered page, so theme and
 * reader settings are applied before first paint (no flash). The function is
 * shared with the settings store, so there is one implementation only.
 */
const bootScript = `<script>try{(${applyStoredPreferences.toString()})()}catch(e){}</script>`;

export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%c3.boot%', bootScript)
	});
