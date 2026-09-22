/**
 * Learner progress, persisted in localStorage (this is a static site with
 * no backend). Loaded lazily from the root layout after hydration so the
 * server-rendered HTML never depends on browser state.
 */
import { SvelteSet } from 'svelte/reactivity';

const STORAGE_KEY = 'c3-course:progress:v1';

interface StoredProgress {
	completedLessons: string[];
}

class Progress {
	completed = new SvelteSet<string>();
	loaded = $state(false);

	load(): void {
		if (this.loaded) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as StoredProgress;
				for (const id of parsed.completedLessons ?? []) this.completed.add(id);
			}
		} catch {
			// Private mode or blocked storage: start fresh, in memory only.
		}
		this.loaded = true;
	}

	isCompleted(lessonId: string): boolean {
		return this.completed.has(lessonId);
	}

	toggle(lessonId: string): void {
		if (this.completed.has(lessonId)) this.completed.delete(lessonId);
		else this.completed.add(lessonId);
		this.persist();
	}

	countCompleted(lessonIds: string[]): number {
		return lessonIds.filter((id) => this.completed.has(id)).length;
	}

	reset(): void {
		this.completed.clear();
		this.persist();
	}

	private persist(): void {
		try {
			const payload: StoredProgress = { completedLessons: [...this.completed] };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch {
			// Storage unavailable: progress lives only for this session.
		}
	}
}

export const progress = new Progress();
