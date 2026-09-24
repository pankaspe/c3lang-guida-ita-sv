/**
 * Context provided by the lesson page to the components inside a lesson
 * (Quiz, Exercise, Callout), so they can key their activity records by lesson.
 */
import { createContext } from 'svelte';

export interface LessonContext {
	/** `<moduleSlug>/<lessonSlug>` */
	readonly lessonId: string;
}

export const [getLessonContext, setLessonContext] = createContext<LessonContext>();

/** Lesson id if rendered inside a lesson, otherwise null (e.g. previews). */
export function currentLessonId(): string | null {
	try {
		return getLessonContext().lessonId;
	} catch {
		return null;
	}
}
