/**
 * Learning activity log, persisted in localStorage: study time and actions
 * per day (for streaks and the heatmap), first-attempt quiz results,
 * solved exercises, opened "nerd details", and the last reading position.
 * Everything here feeds the profile page.
 */
const STORAGE_KEY = 'c3-course:activity:v1';

export interface DayStats {
	/** Seconds of active reading. */
	seconds: number;
	/** Quizzes answered, exercises solved, lessons completed, callouts opened. */
	actions: number;
}

export interface LastPosition {
	lessonId: string;
	section: string;
	sectionTitle: string;
	at: string;
}

interface StoredActivity {
	since: string;
	days: Record<string, DayStats>;
	quizzes: Record<string, boolean>;
	exercises: Record<string, string>;
	nerd: string[];
	last: LastPosition | null;
}

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(date = new Date()): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

/** Small stable hash, used to key quizzes by their question text. */
export function shortHash(text: string): string {
	let hash = 5381;
	for (let index = 0; index < text.length; index++) hash = ((hash << 5) + hash + text.charCodeAt(index)) | 0;
	return (hash >>> 0).toString(36);
}

class Activity {
	since = $state<string | null>(null);
	days = $state<Record<string, DayStats>>({});
	quizzes = $state<Record<string, boolean>>({});
	exercises = $state<Record<string, string>>({});
	nerd = $state<string[]>([]);
	last = $state<LastPosition | null>(null);
	loaded = $state(false);

	load(): void {
		if (this.loaded) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const stored = JSON.parse(raw) as Partial<StoredActivity>;
				this.since = stored.since ?? null;
				this.days = stored.days ?? {};
				this.quizzes = stored.quizzes ?? {};
				this.exercises = stored.exercises ?? {};
				this.nerd = stored.nerd ?? [];
				this.last = stored.last ?? null;
			}
		} catch {
			// Start fresh.
		}
		this.loaded = true;
	}

	// --- Recording -----------------------------------------------------------------

	/** Only the first answer to each quiz counts. */
	recordQuiz(key: string, correct: boolean): void {
		if (key in this.quizzes) return;
		this.quizzes[key] = correct;
		this.touch();
	}

	recordExercise(key: string): void {
		if (key in this.exercises) return;
		this.exercises[key] = dayKey();
		this.touch();
	}

	recordNerd(key: string): void {
		if (this.nerd.includes(key)) return;
		this.nerd.push(key);
		this.touch();
	}

	recordLessonCompleted(): void {
		this.touch();
	}

	addReadingTime(seconds: number): void {
		this.today().seconds += seconds;
		this.persist();
	}

	setLast(position: Omit<LastPosition, 'at'>): void {
		this.last = { ...position, at: new Date().toISOString() };
		this.persist();
	}

	isExerciseSolved(key: string): boolean {
		return key in this.exercises;
	}

	// --- Stats ------------------------------------------------------------------------

	get totalSeconds(): number {
		return Object.values(this.days).reduce((sum, day) => sum + day.seconds, 0);
	}

	get quizStats(): { answered: number; correct: number } {
		const results = Object.values(this.quizzes);
		return { answered: results.length, correct: results.filter(Boolean).length };
	}

	get exercisesSolved(): number {
		return Object.keys(this.exercises).length;
	}

	/** Consecutive active days ending today (or yesterday, so the streak survives until tonight). */
	get currentStreak(): number {
		const date = new Date();
		if (!this.isActive(dayKey(date))) date.setDate(date.getDate() - 1);
		let streak = 0;
		while (this.isActive(dayKey(date))) {
			streak++;
			date.setDate(date.getDate() - 1);
		}
		return streak;
	}

	get bestStreak(): number {
		const active = Object.keys(this.days).filter((key) => this.isActive(key)).sort();
		let best = 0;
		let run = 0;
		let previous: Date | null = null;
		for (const key of active) {
			const date = new Date(`${key}T12:00:00`);
			const consecutive = previous && Math.round((date.getTime() - previous.getTime()) / 86_400_000) === 1;
			run = consecutive ? run + 1 : 1;
			best = Math.max(best, run);
			previous = date;
		}
		return best;
	}

	isActive(key: string): boolean {
		const day = this.days[key];
		return !!day && (day.actions > 0 || day.seconds >= 60);
	}

	// --- Internals ----------------------------------------------------------------

	private today(): DayStats {
		const key = dayKey();
		this.since ??= key;
		return (this.days[key] ??= { seconds: 0, actions: 0 });
	}

	private touch(): void {
		this.today().actions++;
		this.persist();
	}

	private persist(): void {
		try {
			const payload: StoredActivity = {
				since: this.since ?? dayKey(),
				days: this.days,
				quizzes: this.quizzes,
				exercises: this.exercises,
				nerd: this.nerd,
				last: this.last
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch {
			// Storage unavailable: activity lives only for this session.
		}
	}
}

export const activity = new Activity();
