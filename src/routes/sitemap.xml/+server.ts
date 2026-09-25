import { allLessons, lessonPath, modulePath, modules } from '$lib/content/registry';
import { existsSync } from 'node:fs';
import { absoluteUrl, lessonOgImage, moduleOgImage } from '$lib/seo';

export const prerender = true;

/** Every public page. Empty while `url` in course.json is not set (a sitemap needs absolute URLs). */
export function GET() {
	// Preview images are generated offline and committed: flag the ones a new lesson still lacks.
	const images = [
		...modules.map((module) => moduleOgImage(module.slug)),
		...allLessons.map((lesson) => lessonOgImage(lesson.moduleSlug, lesson.slug))
	];
	const missing = images.filter((image) => !existsSync(`static${image}`));
	if (missing.length) console.warn(`Missing preview images (run python3 scripts/og-images.py): ${missing.join(', ')}`);

	const paths = ['/', ...modules.map(modulePath), ...allLessons.map(lessonPath), '/privacy'];
	const urls = paths
		.map(absoluteUrl)
		.filter((url) => url !== undefined)
		.map((url) => `\t<url><loc>${url}</loc></url>`)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
