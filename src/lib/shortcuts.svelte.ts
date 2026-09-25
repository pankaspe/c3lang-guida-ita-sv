/**
 * Keyboard shortcuts and the app-wide panels they open (cheat sheet, shortcut
 * help). `handleShortcut` is bound to the window in the root layout; the
 * `SHORTCUTS` table is what the help dialog and Settings → Tastiera list, so
 * a new shortcut must be added there too.
 */
import { settings } from '$lib/state/settings.svelte';

export type Panel = 'cheatsheet' | 'shortcuts';

class Panels {
	/** The panel currently open, if any (only one at a time). */
	open = $state<Panel | null>(null);

	toggle(panel: Panel): void {
		this.open = this.open === panel ? null : panel;
	}

	close(): void {
		this.open = null;
	}
}

export const panels = new Panels();

/** Named keys, shown through `shortcuts.keys.*`; anything else is shown as typed. */
export type NamedKey = 'esc' | 'tab' | 'shift' | 'enter';
export type ShortcutGroup = 'global' | 'lesson';
export type ShortcutAction = 'cheatsheet' | 'help' | 'theme' | 'close' | 'focus' | 'next' | 'previous' | 'check';

export interface Shortcut {
	/** Keys pressed together. */
	keys: (NamedKey | string)[];
	/** Alternative key combination with the same effect, if any. */
	alt?: (NamedKey | string)[];
	action: ShortcutAction;
	group: ShortcutGroup;
}

export const SHORTCUTS: Shortcut[] = [
	{ keys: ['K'], action: 'cheatsheet', group: 'global' },
	{ keys: ['?'], action: 'help', group: 'global' },
	{ keys: ['T'], action: 'theme', group: 'global' },
	{ keys: ['esc'], action: 'close', group: 'global' },
	{ keys: ['tab'], alt: ['shift', 'tab'], action: 'focus', group: 'global' },
	{ keys: ['N'], action: 'next', group: 'lesson' },
	{ keys: ['P'], action: 'previous', group: 'lesson' },
	{ keys: ['enter'], action: 'check', group: 'lesson' }
];

export const NAMED_KEYS: readonly string[] = ['esc', 'tab', 'shift', 'enter'] satisfies NamedKey[];

/** True when the key press is meant for a text field, not for us. */
function isTyping(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

/** Follows the link marked `data-shortcut="<name>"` on the current page, if any. */
function follow(name: string): boolean {
	const link = document.querySelector<HTMLAnchorElement>(`a[data-shortcut="${name}"]`);
	link?.click();
	return link !== null;
}

export function handleShortcut(event: KeyboardEvent): void {
	if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
	if (isTyping(event.target)) {
		// Esc leaves a text field on the page, so the letter shortcuts work again
		// (inside a dialog, Esc closes the dialog instead).
		const field = event.target as HTMLElement;
		if (event.key === 'Escape' && !field.closest('dialog')) field.blur();
		return;
	}

	let handled = true;
	switch (event.key.toLowerCase()) {
		case 'k':
			panels.toggle('cheatsheet');
			break;
		case '?':
			panels.toggle('shortcuts');
			break;
		case 't':
			settings.toggleDark();
			break;
		case 'n':
			handled = panels.open === null && follow('next');
			break;
		case 'p':
			handled = panels.open === null && follow('previous');
			break;
		default:
			handled = false;
	}
	if (handled) event.preventDefault();
}
