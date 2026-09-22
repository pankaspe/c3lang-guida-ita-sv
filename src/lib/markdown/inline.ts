/**
 * Minimal inline-markdown renderer for text passed through component props
 * (quiz questions, options...). Supports `code`, **bold** and *italic* only.
 * Everything is HTML-escaped first, so the output is safe for {@html}.
 */
function escapeHtml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

export function renderInline(text: string): string {
	return escapeHtml(text)
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Normalises program output so that trailing spaces/newlines don't matter. */
export function normaliseOutput(text: string): string {
	return text
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')
		.trim();
}
