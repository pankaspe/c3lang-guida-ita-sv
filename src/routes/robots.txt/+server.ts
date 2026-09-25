import { absoluteUrl } from '$lib/seo';

export const prerender = true;

/** Allow everything; point crawlers to the sitemap once the site URL is known. */
export function GET() {
	const sitemap = absoluteUrl('/sitemap.xml');
	const body = `User-agent: *\nDisallow:\n${sitemap ? `\nSitemap: ${sitemap}\n` : ''}`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
