/**
 * Absolute URLs for SEO (canonical, Open Graph, sitemap). They need the public
 * address of the site, `url` in course.json; while it is empty (e.g. before the
 * first deploy picks a domain) everything that requires it is simply left out.
 */
import { course } from '$lib/content/course';

export const siteUrl = (course.url ?? '').replace(/\/+$/, '');

/** `path` as an absolute URL, or undefined when the site URL is not configured. */
export function absoluteUrl(path: string): string | undefined {
	return siteUrl ? siteUrl + path : undefined;
}
