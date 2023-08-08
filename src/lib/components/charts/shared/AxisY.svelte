<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { ScaleLinear, ScaleBand } from 'd3-scale';
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { select } from 'd3-selection';

	export let ticks: Function | number = 4;
	export let tickMarks = false;
	export let gridlines = true;
	export let tickDashed = false;
	export let tickColor = 'var(--surface-4)';
	export let textColor = '#666';
	export let formatTick: Function = (d: number | string) => d;
	export let xTick = 0;
	export let yTick = 0;
	export let dxTick : number | undefined = undefined;
	export let dyTick: number | undefined = undefined;
	export let textAnchor = 'start';
	export let prefix = '';
	export let suffix = '';

	let ch = 12

	type Axis = ScaleLinear<number, number> | ScaleBand<number | string>;
	type Context = {
		padding: Writable<{
			top: number;
			bottom: number;
			left: number;
			right: number;
		}>;
		xRange: Writable<Array<number>>;
		yScale: Writable<Axis>;
	};
	const { padding, xRange, yScale } = getContext<Context>('LayerCake');

	// $: isBandwidth = typeof $yScale.bandwidth === 'function';

	// const isScaleBand = (axis: Axis) => axis instanceof scaleBand;
	let isBandwidth = false;
	let bw: number | undefined = undefined;
	if ('bandwidth' in $yScale) {
		isBandwidth = true;
		bw = $yScale.bandwidth();
		
		// dyTick = 12;
		// dxTick = -4;
	}

	$: tickVals = Array.isArray(ticks)
		? ticks
		: bw
		? $yScale.domain()
		: typeof ticks === 'function' && "ticks" in $yScale
		? ticks($yScale.ticks())
		: typeof ticks === 'number' &&"ticks" in $yScale
		? $yScale.ticks(ticks):
		0;
	// $: select('tick').attr('dy', Number(dyTick));
</script>

<g class="axis y-axis" transform="translate({-$padding.left}, 0)">
	{#each tickVals as tick, i}
		<g
			class="tick tick-{tick}"
			transform="translate({$xRange[0] + (bw ? $padding.left : 0)}, {$yScale(tick)})"
		>
			{#if gridlines !== false}
				<line
					class="gridline"
					x2="100%"
					y1={yTick + (bw ? bw / 2 : 0)}
					y2={yTick + (bw ? bw / 2 : 0)}
					class:dashed={tickDashed}
					style="stroke: {tickColor}"
				/>
			{/if}
			{#if tickMarks === true}
				<line
					class="tick-mark"
					x1="0"
					x2={bw ? -6 : 6}
					y1={yTick + (bw ? bw / 2 : 0)}
					y2={yTick + (bw ? bw / 2 : 0)}
					style="stroke: {tickColor}"
				/>
			{/if}
			<text
				x={xTick}
				y={yTick + (bw ? bw / 2 : 0)}
				dx={dxTick? dxTick: bw ? -4 : 12}
				dy={dyTick? dyTick: isBandwidth ? 12 : -4}
				style="text-anchor:{isBandwidth ? 'end' : textAnchor}; fill: {textColor}"
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
		
		.dashed {
			stroke-dasharray: 2;
		}
		
		.tick.tick-0 line {
			stroke-dasharray: 0;
		}
	</style>
