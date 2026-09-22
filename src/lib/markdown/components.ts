/**
 * Components usable inside lessons without an import. Keep in sync with the
 * exports of LessonLayout.svelte: the rehype plugin rewrites these tag names
 * to `Components.<Name>` (the namespace mdsvex injects for layout exports).
 */
export const LESSON_COMPONENTS = ['CodeBlock', 'Callout', 'Quiz', 'Exercise', 'Solution'] as const;
