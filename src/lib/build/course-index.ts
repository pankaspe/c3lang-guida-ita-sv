/**
 * Vite plugin exposing `virtual:course-index`: the module/lesson tree with
 * frontmatter, read from the file system at build time. Lesson components
 * themselves are loaded lazily by the registry, so adding lessons never
 * grows the initial bundle.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';

const VIRTUAL_ID = 'virtual:course-index';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const ORDERED_NAME = /^(\d+)-(.+)$/;

export interface IndexedLesson {
	file: string;
	slug: string;
	order: number;
	meta: Record<string, unknown>;
}

export interface IndexedModule {
	folder: string;
	slug: string;
	order: number;
	meta: Record<string, unknown>;
	lessons: IndexedLesson[];
}

function parseOrdered(name: string): { order: number; slug: string } {
	const match = name.match(ORDERED_NAME);
	if (!match) throw new Error(`Content path "${name}" must be prefixed with a number, e.g. "01-intro"`);
	return { order: Number(match[1]), slug: match[2] };
}

/** Tiny YAML subset: `key: value` lines, quoted strings, numbers, booleans. */
function parseFrontmatter(source: string): Record<string, unknown> {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};
	const data: Record<string, unknown> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const pair = line.match(/^([\w-]+):\s*(.*)$/);
		if (!pair) continue;
		const [, key, rawValue] = pair;
		let value: unknown = rawValue.trim();
		if (typeof value === 'string') {
			if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
			else if (/^-?\d+(\.\d+)?$/.test(value)) value = Number(value);
			else if (value === 'true' || value === 'false') value = value === 'true';
		}
		data[key] = value;
	}
	return data;
}

function scan(root: string): IndexedModule[] {
	const modules: IndexedModule[] = [];
	for (const folder of readdirSync(root)) {
		const folderPath = join(root, folder);
		if (!statSync(folderPath).isDirectory()) continue;
		const metaPath = join(folderPath, 'module.json');
		let meta: Record<string, unknown>;
		try {
			meta = JSON.parse(readFileSync(metaPath, 'utf8'));
		} catch {
			throw new Error(`Module folder "${folder}" needs a valid module.json`);
		}
		const { order, slug } = parseOrdered(folder);
		const lessons = readdirSync(folderPath)
			.filter((file) => file.endsWith('.svx'))
			.map((file): IndexedLesson => {
				const parsed = parseOrdered(file.replace(/\.svx$/, ''));
				const source = readFileSync(join(folderPath, file), 'utf8');
				return { file, slug: parsed.slug, order: parsed.order, meta: parseFrontmatter(source) };
			})
			.sort((a, b) => a.order - b.order);
		modules.push({ folder, slug, order, meta, lessons });
	}
	return modules.sort((a, b) => a.order - b.order);
}

export function courseIndex(contentDir = 'src/content/modules'): Plugin {
	const root = resolve(contentDir);
	return {
		name: 'course-index',
		resolveId(id) {
			return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
		},
		load(id) {
			if (id !== RESOLVED_ID) return;
			return `export default ${JSON.stringify(scan(root))};`;
		},
		configureServer(server) {
			// Content lives under src/, which Vite already watches; make it explicit anyway.
			server.watcher.add(root);
			// Frontmatter or file-set changes: rebuild the index on next request.
			const invalidate = (file: string) => {
				if (!file.startsWith(root)) return;
				const module = server.moduleGraph.getModuleById(RESOLVED_ID);
				if (module) server.moduleGraph.invalidateModule(module);
				server.ws.send({ type: 'full-reload' });
			};
			server.watcher.on('add', invalidate);
			server.watcher.on('unlink', invalidate);
			server.watcher.on('change', invalidate);
		}
	};
}
