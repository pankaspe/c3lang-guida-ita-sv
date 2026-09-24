/**
 * Rehype plugin: wraps every h2 and the content that follows it (up to the
 * next h2) in `<section class="lesson-section" data-section="<h2 id>">`.
 * Content before the first h2 becomes an "intro" section. These sections are
 * the units the reading "spotlight" highlights, and what "resume where you
 * left off" points to. Must run after rehype-slug (it reads the h2 ids).
 *
 * Lesson components are raw HTML nodes at the root (`<Callout>` … `</Callout>`
 * are separate siblings), so an h2 must never appear inside a component, or
 * its opening and closing tags would end up in different sections.
 */
import type { Element, ElementContent, Root, RootContent } from 'hast';

function isH2(node: RootContent): node is Element {
	return node.type === 'element' && node.tagName === 'h2';
}

function section(id: string, children: RootContent[]): Element {
	return {
		type: 'element',
		tagName: 'section',
		properties: { className: ['lesson-section'], dataSection: id },
		children: children as ElementContent[]
	};
}

export function rehypeLessonSections() {
	return (tree: Root) => {
		const result: RootContent[] = [];
		let current: RootContent[] = [];
		let currentId = 'intro';

		const flush = () => {
			const hasContent = current.some((node) => !(node.type === 'text' && node.value.trim() === ''));
			if (hasContent) result.push(section(currentId, current));
			else result.push(...current);
			current = [];
		};

		for (const node of tree.children) {
			if (isH2(node)) {
				flush();
				currentId = String(node.properties?.id ?? `section-${result.length}`);
			}
			current.push(node);
		}
		flush();
		tree.children = result;
	};
}
