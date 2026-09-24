<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { shortHash } from '$lib/state/activity.svelte';

	/**
	 * Monochrome geometric avatar derived from a string (a mirrored 5×5 grid,
	 * GitHub-style). Same name → same pattern, drawn in the accent colour.
	 */
	interface Props {
		seed: string;
		class?: ClassValue;
	}

	let { seed, class: className = 'size-10' }: Props = $props();

	const cells = $derived.by(() => {
		// Spread the hash over 15 bits: 5 rows × 3 columns (mirrored to 5).
		let bits = parseInt(shortHash(seed.toLowerCase() || 'c3'), 36);
		const filled: { x: number; y: number }[] = [];
		for (let y = 0; y < 5; y++) {
			for (let x = 0; x < 3; x++) {
				if (bits & 1) {
					filled.push({ x, y });
					if (x < 2) filled.push({ x: 4 - x, y });
				}
				bits >>>= 1;
			}
		}
		// Never render an empty avatar.
		return filled.length ? filled : [{ x: 2, y: 2 }];
	});
</script>

<svg
	viewBox="-1 -1 7 7"
	class={['shrink-0 rounded-lg bg-accent-soft text-accent', className]}
	aria-hidden="true"
>
	{#each cells as cell (`${cell.x}-${cell.y}`)}
		<rect x={cell.x} y={cell.y} width="1" height="1" fill="currentColor" />
	{/each}
</svg>
