/**
 * mdsvex highlighter. Runs at build time and emits a `<Components.CodeBlock>`
 * wrapper (exported by LessonLayout.svelte) around Prism-highlighted HTML,
 * so every fence gets a copy button and a title tab for free.
 *
 * Fence syntax supported in lessons:
 *   ```c3 title="hello.c3"
 *   ```output          -> rendered as terminal output, no highlighting
 *   ```sh / ```bash    -> shell commands
 */
import { Prism } from './prism-c3.ts';

const LANG_ALIASES: Record<string, string> = {
	sh: 'bash',
	shell: 'bash',
	console: 'output',
	text: 'output',
	txt: 'output'
};

function escapeHtml(source: string): string {
	return source
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;');
}

/** Svelte would parse `{` and `}` as expressions: neutralise them. */
function escapeSvelte(html: string): string {
	return html.replaceAll('{', '&#123;').replaceAll('}', '&#125;').replaceAll('`', '&#96;');
}

function parseMeta(meta: string | null | undefined): { title?: string } {
	if (!meta) return {};
	const title = meta.match(/title="([^"]*)"/)?.[1];
	return { title };
}

export function highlight(code: string, lang: string | null | undefined, meta?: string | null): string {
	const resolved = LANG_ALIASES[lang ?? ''] ?? lang ?? 'output';
	const grammar = Prism.languages[resolved];
	const body = grammar ? Prism.highlight(code, grammar, resolved) : escapeHtml(code);
	const { title } = parseMeta(meta);
	const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';

	return (
		`<Components.CodeBlock lang="${resolved}"${titleAttr}>` +
		`<pre class="language-${resolved}"><code>${escapeSvelte(body)}</code></pre>` +
		`</Components.CodeBlock>`
	);
}
