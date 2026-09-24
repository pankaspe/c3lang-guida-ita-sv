<script lang="ts">
	import { activity, dayKey } from '$lib/state/activity.svelte';

	/**
	 * GitHub-style activity calendar: one column per week (Monday first), one
	 * cell per day, shaded by how much the learner studied.
	 */
	interface Props {
		weeks?: number;
	}

	let { weeks = 18 }: Props = $props();

	const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
	const DAY_LABELS = ['lun', '', 'mer', '', 'ven', '', ''];

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
					if (week > 0 || cursor.getDate() <= 7) month = MONTHS[cursor.getMonth()];
					previousMonth = cursor.getMonth();
				}
				cells.push({
					key,
					date: new Date(cursor),
					level: level(stats.seconds, stats.actions),
					future: cursor > today,
					label: `${cursor.getDate()} ${MONTHS[cursor.getMonth()]}: ${minutes} min, ${stats.actions} ${stats.actions === 1 ? 'azione' : 'azioni'}`
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
			{#each DAY_LABELS as label, index (index)}
				<span class="leading-[0.85rem]">{label}</span>
			{/each}
		</div>
		<div class="flex gap-[3px]" role="img" aria-label="Calendario dell'attività delle ultime {weeks} settimane">
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
		meno
		{#each shades as shade (shade)}
			<span class={['size-[0.7rem] rounded-[2px]', shade]}></span>
		{/each}
		più
	</div>
</div>
