<script lang="ts">
	import { activity, dayKey } from '$lib/state/activity.svelte';
	import { i18n, t } from '$lib/i18n/index.svelte';

	/**
	 * GitHub-style activity calendar: one column per week (Monday first), one
	 * cell per day, shaded by how much the learner studied.
	 */
	interface Props {
		weeks?: number;
	}

	let { weeks = 18 }: Props = $props();

	/** Short month names, January first, in the UI language. */
	const months = $derived(
		Array.from({ length: 12 }, (_, month) => i18n.date(new Date(2024, month, 1), { month: 'short' }))
	);
	/** Monday, Wednesday and Friday labels (2024-01-01 was a Monday). */
	const dayLabels = $derived(
		Array.from({ length: 7 }, (_, day) =>
			day % 2 === 0 && day < 6 ? i18n.date(new Date(2024, 0, 1 + day), { weekday: 'short' }) : ''
		)
	);

	interface Cell {
		key: string;
		date: Date;
		level: number;
		label: string;
		future: boolean;
	}

	function level(seconds: number, actions: number): number {
		const score = actions * 2 + seconds / 300;
		if (score <= 0) return 0;
		if (score < 3) return 1;
		if (score < 6) return 2;
		if (score < 10) return 3;
		return 4;
	}

	const columns = $derived.by(() => {
		const today = new Date();
		today.setHours(12, 0, 0, 0);
		// Monday of the current week, then go back (weeks - 1) weeks.
		const start = new Date(today);
		start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (weeks - 1) * 7);

		const result: { month: string; cells: Cell[] }[] = [];
		const cursor = new Date(start);
		let previousMonth = -1;
		for (let week = 0; week < weeks; week++) {
			const cells: Cell[] = [];
			let month = '';
			for (let weekday = 0; weekday < 7; weekday++) {
				const key = dayKey(cursor);
				const stats = activity.days[key] ?? { seconds: 0, actions: 0 };
				const minutes = Math.round(stats.seconds / 60);
				// Label a column with its month when the month changes; skip a partial
				// first column so labels never collide.
				if (weekday === 0 && cursor.getMonth() !== previousMonth) {
					if (week > 0 || cursor.getDate() <= 7) month = months[cursor.getMonth()];
					previousMonth = cursor.getMonth();
				}
				cells.push({
					key,
					date: new Date(cursor),
					level: level(stats.seconds, stats.actions),
					future: cursor > today,
					label: t('heatmap.cell', {
						date: i18n.date(cursor, { day: 'numeric', month: 'short' }),
						minutes,
						actions: t('heatmap.actions', { count: stats.actions })
					})
				});
				cursor.setDate(cursor.getDate() + 1);
			}
			result.push({ month, cells });
		}
		return result;
	});

	const shades = [
		'bg-surface-2',
		'bg-accent/25',
		'bg-accent/50',
		'bg-accent/75',
		'bg-accent'
	];
</script>

<div class="overflow-x-auto pb-1">
	<div class="inline-flex gap-2 font-mono text-[10px] text-muted">
		<div class="grid grid-rows-[1rem_repeat(7,0.85rem)] gap-[3px] pr-1" aria-hidden="true">
			<span></span>
			{#each dayLabels as label, index (index)}
				<span class="leading-[0.85rem]">{label}</span>
			{/each}
		</div>
		<div class="flex gap-[3px]" role="img" aria-label={t('heatmap.aria', { weeks })}>
			{#each columns as column (column.cells[0].key)}
				<div class="grid grid-rows-[1rem_repeat(7,0.85rem)] gap-[3px]">
					<span class="leading-4 whitespace-nowrap">{column.month}</span>
					{#each column.cells as cell (cell.key)}
						<span
							class={['size-[0.85rem] rounded-[3px]', cell.future ? 'bg-transparent' : shades[cell.level]]}
							title={cell.future ? undefined : cell.label}
						></span>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="mt-2 flex items-center justify-end gap-1 font-mono text-[10px] text-muted" aria-hidden="true">
		{t('heatmap.less')}
		{#each shades as shade (shade)}
			<span class={['size-[0.7rem] rounded-[2px]', shade]}></span>
		{/each}
		{t('heatmap.more')}
	</div>
</div>
