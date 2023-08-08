<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { ScaleLinear, ScaleBand } from 'd3-scale';
	import { max } from 'd3-array';

	export let hovered: string | null = null;

	type Values = {
		code: string;
		name: string;
		parent: string;
		value: number;
		year: number;
		[key: string]: any; // Add index signature
	};

	type DataTT = {
		name: string;
		values: Values[];
	};

	type Context = {
		data: Writable<DataTT[]>;
		x: Writable<Function>;
		xKey: Writable<String>;
		y: Writable<Function>;
		xScale: Writable<ScaleLinear<number, number>>;
		xGet: Writable<Function>;
		yScale: Writable<ScaleLinear<number, number>>;
		yGet: Writable<Function>;
		xRange: Writable<Array<number>>;
		yRange: Writable<Array<number>>;
	};

	const { data, x, y, xScale, yScale, xRange, yRange, xKey } = getContext<Context>('LayerCake');

	/* --------------------------------------------
	 * Put the label on the last value
	 */
	$: left = (values: Values[]) => $xScale($x(values.slice(-1)[0])) /  Math.max(...$xRange);
	$: top = (values: Values[]) => $yScale($y(values.slice(-1)[0])) / Math.max(...$yRange);
</script>

{#each $data as group}
	<div
		class="label"
		style="
      top:{top(group.values) * 100}%;
      left:{left(group.values) * 100}%;
    "
	>
		{#if hovered === group.values[0].code}
			{group.name}
		{/if}
	</div>
{/each}

<style>
	.label {
		position: absolute;
		transform: translate(0%, -100%) translateX(2px) translateY(5px);
		font-size: 1rem;
		z-index: 10;
	}
</style>
