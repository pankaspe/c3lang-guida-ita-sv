<!--
	Per-page <head> tags: title, description, canonical, Open Graph and Twitter
	card with the preview image. Pages that only make sense for the local learner (profile, settings)
	pass `noindex` so search engines skip them.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { course } from '$lib/content/course';
	import { absoluteUrl, DEFAULT_OG_IMAGE } from '$lib/seo';

	let {
		title,
		description,
		image = DEFAULT_OG_IMAGE,
		type = 'website',
		noindex = false
	}: {
		title: string;
		description: string;
		/** Site path of a 1200x630 preview (see scripts/og-images.py). */
		image?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
	} = $props();

	const canonical = $derived(absoluteUrl(page.url.pathname));
	const imageUrl = $derived(absoluteUrl(image));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
	{#if canonical}
		<link rel="canonical" href={canonical} />
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={course.title} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content={title} />
		<meta name="twitter:image" content={imageUrl} />
	{/if}
	<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
