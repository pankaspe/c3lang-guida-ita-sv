/**
 * Scroll fade-in for content blocks. Pair with `.anim-fade` for what is on
 * screen when the page opens: this attachment only handles the blocks that
 * are *below the fold* at mount, so prerendered content that is already
 * visible never disappears and flickers back in on hydration.
 */

/** Whether animations are off (setting "Nessuna", or "Sistema" + OS reduced motion). */
function motionReduced(): boolean {
	const motion = document.documentElement.dataset.motion;
	return motion === 'reduced' || (motion !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/** Matches the `[data-reveal]` transition in app.css, plus a margin. */
const FADE_MS = 700;

/**
 * Attachment: blocks matching `selector` (relative to the node) fade in as
 * they scroll into view, once.
 *
 * <div {@attach reveal('.lesson-section > *')}>
 */
export function reveal(selector: string) {
	return (node: HTMLElement) => {
		if (motionReduced() || !('IntersectionObserver' in window)) return;

		const fold = window.innerHeight;
		const blocks = [...node.querySelectorAll<HTMLElement>(selector)].filter(
			(block) => block.getBoundingClientRect().top > fold
		);
		const timers = new Set<ReturnType<typeof setTimeout>>();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const block = entry.target as HTMLElement;
					observer.unobserve(block);
					block.dataset.reveal = 'in';
					// Drop the attribute afterwards, so the block's own transitions (hover...) apply again.
					const timer = setTimeout(() => {
						timers.delete(timer);
						delete block.dataset.reveal;
					}, FADE_MS);
					timers.add(timer);
				}
			},
			{ rootMargin: '0px 0px -6% 0px' }
		);

		for (const block of blocks) {
			block.dataset.reveal = 'hidden';
			observer.observe(block);
		}

		return () => {
			observer.disconnect();
			for (const timer of timers) clearTimeout(timer);
			for (const block of blocks) delete block.dataset.reveal;
		};
	};
}
