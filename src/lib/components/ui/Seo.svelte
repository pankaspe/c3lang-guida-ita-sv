<!--
	Per-page <head> tags: title, description, canonical, Open Graph and Twitter
	card. Pages that only make sense for the local learner (profile, settings)
	pass `noindex` so search engines skip them.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { course } from '$lib/content/course';
	import { absoluteUrl } from '$lib/seo';

	let {
		title,
		description,
		type = 'website',
		noindex = false
	}: { title: string; description: string; type?: 'website' | 'article'; noindex?: boolean } = $props();

	const canonical = $derived(absoluteUrl(page.url.pathname));
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
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
