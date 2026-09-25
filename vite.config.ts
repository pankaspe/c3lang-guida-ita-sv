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
import { rehypeLessonSections } from './src/lib/markdown/rehype-lesson-sections.ts';
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
			// 404.html is served by static hosts (Cloudflare Pages) with a real 404 status
			// for unknown URLs, instead of the homepage with 200.
			adapter: adapter({ fallback: '404.html', strict: true }),

			preprocess: [
				mdsvex({
					extensions: ['.svx'],
					layout: lessonLayout,
					layoutPropForwarding: 'runes',
					smartypants: { dashes: 'oldschool' },
					highlight: { highlighter: highlight },
					remarkPlugins: [remarkHeadings],
					rehypePlugins: [rehypeSlug, rehypeLessonSections, rehypeLessonComponents]
				}),
				// mdsvex still emits the Svelte 4 `<script context="module">` for frontmatter
				// metadata; rewrite it to the Svelte 5 `module` attribute to silence the warning.
				{
					name: 'mdsvex-script-module',
					markup: ({ content, filename }) =>
						filename?.endsWith('.svx')
							? { code: content.replace(/<script context="module"/g, '<script module') }
							: undefined
				}
			],
			extensions: ['.svelte', '.svx']
		})
	]
});
