<script lang="ts">
	import type { ScaleLinear, ScaleBand} from 'd3-scale';
	import { scaleBand, scaleLinear} from 'd3-scale';
	import type { Writable } from 'svelte/store';
	// import type {typeScaleBand} from 'd3-axis';
	import { getContext } from 'svelte';

	export let gridlines = true;
	export let tickDashed = false;
	export let tickMarks = false;
	export let tickColor = 'var(--surface-4)';
	export let textColor = '#666';
	export let formatTick: Function = (d: number | string) => d ;
	export let snapTicks = false;
	export let ticks: Function | number | undefined | number[] = undefined;
	export let xTick: number | undefined = undefined;
	export let yTick = 16;
	export let dxTick = 0;
	export let dyTick = 0;
	export let prefix = '';
	export let suffix = '';

	// type Axis = typeof scaleBand | typeof scaleLinear;
	type Axis = ScaleLinear<number, number> | ScaleBand<number | string>;
	type Context = {
		width: Writable<number>;
		height: Writable<number>;
		xScale: Writable<Axis>;
		yRange: Writable<Array<number>>;
	};
	const { width, height, xScale, yRange } = getContext<Context>('LayerCake');

	// $: isBandwidth = typeof $xScale.bandwidth === 'function';

	// Define the axis as a union type of scaleband and scalelinear

	// Check if the axis is scaleband
	const isScaleBand = (axis: Axis) => axis instanceof scaleBand;
	let isBandwidth = false;
	let bw: number | undefined = undefined;
	if ("bandwidth" in $xScale) {
		isBandwidth = true;
		bw = $xScale.bandwidth();
	}

	type AxisType = ScaleBand<string> | ScaleLinear<number, number>;

	const axis: AxisType = Math.random() > 0.5 ? scaleBand<string>() : scaleLinear<number, number>();

	
		if ("bandwidth" in axis) {
		// bw = axis.bandwidth();
	}

	// if (typeof $xScale === ScaleBand<number | string>>) {
	// }
	// if ($xScale instanceof scaleBand) {
	//     console.log($xScale.bandwidth());
	// 	isBandwidth = true;
	// }
	// if ($xScale.bandwidth) {
	// }
	// try {
	// 	$xScale.bandwidth?
	// }
	// $: console.log(typeof $xScale);

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $xScale.domain()
		: typeof ticks === 'function' && "ticks" in $xScale
		? ticks($xScale.ticks())
		: typeof ticks === 'number' &&"ticks" in $xScale
		? $xScale.ticks(ticks):
		0;

	function textAnchor(i:number) {
		if (snapTicks === true) {
			if (i === 0) {
				return 'start';
			}
			if (i === tickVals.length - 1) {
				return 'end';
			}
		}
		return 'middle';
	}
</script>

<g class="axis x-axis" class:snapTicks>
	{#each tickVals as tick, i}
		<g class="tick tick-{tick}" transform="translate({$xScale(tick)},{Math.max(...$yRange)})">
			{#if gridlines !== false}
				<line
					class="gridline"
					class:dashed={tickDashed}
					y1={$height * -1}
					y2="0"
					x1="0"
					x2="0"
					style="stroke: {tickColor}"
				/>
			{/if}
			{#if tickMarks === true}
				<line
					class="tick-mark"
					y1={0}
					y2={6}
					x1={xTick? xTick: bw ? bw / 2 : 0}
					x2={xTick? xTick: bw ? bw / 2 : 0}
					style="stroke: {tickColor}"
				/>
			{/if}
			<text
				x={xTick? xTick: bw ? bw / 2 : 0}
				y={yTick}
				dx={dxTick}
				dy={dyTick}
				text-anchor={textAnchor(i)}
				style="fill: {textColor}"
			>
				{i == tickVals.length - 1 ? prefix + formatTick(tick) + suffix : formatTick(tick)}
			</text>
		</g>
	{/each}
</g>

<style>
	.tick {
		font-size: 0.8em;
	}

	.tick .tick-mark,
	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.dashed {
		stroke-dasharray: 2;
	}
	/* This looks slightly better */
	.axis.snapTicks .tick:last-child text {
		transform: translateX(3px);
	}
	.axis.snapTicks .tick.tick-0 text {
		transform: translateX(-3px);
	}
</style>
