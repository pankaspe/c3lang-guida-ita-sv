/**
 * The language cheat sheet ("prontuario") from `src/content/cheatsheet.json`:
 * every keyword and piece of syntax the lessons have introduced so far, grouped
 * by topic. It grows with the course: each new lesson adds its entries.
 */
import raw from '../../content/cheatsheet.json';

export interface CheatEntry {
	/** The keyword or syntax, shown in monospace (e.g. "if · else if · else"). */
	term: string;
	/** Optional short example, highlighted as `lang` (default "c3"). */
	code?: string;
	lang?: 'c3' | 'bash';
	/** One or two sentences, inline markdown (`code`, **bold**, *italic*). */
	text: string;
	/** Id of the lesson that introduces it (`<moduleSlug>/<lessonSlug>`). */
	lesson: string;
}

export interface CheatSection {
	id: string;
	title: string;
	/** Icon name from `Icon.svelte`. */
	icon: string;
	entries: CheatEntry[];
}

export const cheatsheet = raw as { sections: CheatSection[] };
