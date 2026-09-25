import { allLessons, lessonPath, modulePath, modules } from '$lib/content/registry';
import { absoluteUrl } from '$lib/seo';

export const prerender = true;

/** Every public page. Empty while `url` in course.json is not set (a sitemap needs absolute URLs). */
export function GET() {
	const paths = ['/', ...modules.map(modulePath), ...allLessons.map(lessonPath)];
	const urls = paths
		.map(absoluteUrl)
		.filter((url) => url !== undefined)
		.map((url) => `\t<url><loc>${url}</loc></url>`)
		.join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
