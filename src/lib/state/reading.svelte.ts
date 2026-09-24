import { untrack } from 'svelte';

/**
 * What the learner is reading right now: lesson, active section and how far
 * through the lesson they are. Written by the `readingTracker` attachment on
 * the lesson page, read by the header progress bar, the table of contents
 * and the activity log ("resume where you left off").
 */
class ReadingState {
	lessonId = $state<string | null>(null);
	/** `data-section` of the active `.lesson-section` (its h2 id, or "intro"). */
	section = $state<string | null>(null);
	/** Title of the active section, for "resume" links. */
	sectionTitle = $state('');
	/** 0…1, how much of the lesson has been read. */
	progress = $state(0);
}

export const reading = new ReadingState();

/** Where the "reading line" sits, as a fraction of the viewport height. */
const READING_LINE = 0.38;

/**
 * Attachment for the element that contains the lesson sections. Tracks the
 * section crossing the reading line, marks it with `data-active` (the CSS
 * spotlight dims the others) and updates `reading`.
 */
export function readingTracker(lessonId: string, onSection?: (id: string, title: string) => void) {
	// The body runs untracked: it reads and writes `reading`, and must not make
	// the attachment re-run when those values change.
	return (node: HTMLElement) => untrack(() => {
		const sections = [...node.querySelectorAll<HTMLElement>('.lesson-section')];
		let frame = 0;

		reading.lessonId = lessonId;
		reading.section = null;

		const update = () => {
			frame = 0;
			const line = window.innerHeight * READING_LINE;
			const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

			let active = sections[0];
			if (atBottom) active = sections[sections.length - 1];
			else for (const section of sections) {
				if (section.getBoundingClientRect().top > line) break;
				active = section;
			}

			const rect = node.getBoundingClientRect();
			reading.progress = atBottom ? 1 : Math.min(1, Math.max(0, (line - rect.top) / rect.height));

			const id = active?.dataset.section ?? null;
			if (active && id !== reading.section) {
				for (const section of sections) section.toggleAttribute('data-active', section === active);
				reading.section = id;
				reading.sectionTitle = active.querySelector('h2')?.textContent?.trim() ?? '';
				if (id) onSection?.(id, reading.sectionTitle);
			}
		};

		const schedule = () => {
			frame ||= requestAnimationFrame(update);
		};

		update();
		node.dataset.spotlight = '';
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			delete node.dataset.spotlight;
			reading.lessonId = null;
			reading.section = null;
			reading.progress = 0;
		};
	});
}
