/**
 * Rehype plugin: mdsvex only namespaces layout components on hast `element`
 * nodes, but component tags written in markdown survive as `raw` HTML nodes.
 * This rewrites `<Callout ...>` / `</Callout>` inside raw nodes to
 * `<Components.Callout ...>` so they resolve to the layout's exports.
 */
import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import type { Raw } from 'mdast-util-to-hast';
import { LESSON_COMPONENTS } from './components.ts';

const TAG_PATTERN = new RegExp(`<(/?)(${LESSON_COMPONENTS.join('|')})(?=[\\s>/])`, 'g');

export function rehypeLessonComponents() {
	return (tree: Root) => {
		visit(tree, (node) => {
			if (node.type !== 'raw') return;
			const raw = node as Raw;
			raw.value = raw.value.replace(TAG_PATTERN, '<$1Components.$2');
		});
	};
}
