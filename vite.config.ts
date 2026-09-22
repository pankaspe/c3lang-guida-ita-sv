import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import rehypeSlug from 'rehype-slug';
import { highlight } from './src/lib/markdown/highlighter.ts';
import { remarkHeadings } from './src/lib/markdown/remark-headings.ts';
import { rehypeLessonComponents } from './src/lib/markdown/rehype-lesson-components.ts';
import { courseIndex } from './src/lib/build/course-index.ts';

const lessonLayout = fileURLToPath(new URL('./src/lib/markdown/LessonLayout.svelte', import.meta.url));

export default defineConfig({
	plugins: [
		courseIndex(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Fully static site: every module and lesson is prerendered at build time.
			adapter: adapter({ fallback: undefined, strict: true }),

			preprocess: [
				mdsvex({
					extensions: ['.svx'],
					layout: lessonLayout,
					layoutPropForwarding: 'runes',
					smartypants: { dashes: 'oldschool' },
					highlight: { highlighter: highlight },
					remarkPlugins: [remarkHeadings],
					rehypePlugins: [rehypeSlug, rehypeLessonComponents]
				})
			],
			extensions: ['.svelte', '.svx']
		})
	]
});
