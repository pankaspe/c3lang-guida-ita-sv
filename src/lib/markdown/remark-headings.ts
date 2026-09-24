/**
 * Remark plugin: collects h2/h3 headings into the frontmatter so the lesson
 * page can render an "in this lesson" table of contents without parsing DOM.
 * Ids are generated the same way rehype-slug does (github-slugger).
 */
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

export interface LessonHeading {
	depth: 2 | 3;
	text: string;
	id: string;
}

export function remarkHeadings() {
	return (tree: Root, file: VFile) => {
		const slugger = new GithubSlugger();
		const headings: LessonHeading[] = [];

		visit(tree, 'heading', (node) => {
			if (node.depth !== 2 && node.depth !== 3) return;
			// mdsvex escapes `{` / `}` as numeric entities before remark runs: keep
			// the raw text for the id (it must match rehype-slug), decode it for display.
			const raw = toString(node);
			const text = raw.replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
			headings.push({ depth: node.depth, text, id: slugger.slug(raw) });
		});

		const data = file.data as { fm?: Record<string, unknown> };
		data.fm = { ...(data.fm ?? {}), headings };
	};
}
