<script lang="ts">
	import { LayerCake, Svg, Html, calcExtents } from 'layercake';
	import { scaleOrdinal, scaleLinear, scaleSymlog } from 'd3-scale';

	import AxisX from '$lib/components/charts/shared/AxisX.svelte';
	import AxisY from '$lib/components/charts/shared/AxisY.svelte';
	import Title from '$lib/components/charts/shared/Title.svelte';
	import Dot from './shared/Dot.svelte';
	import { commas } from '$lib/utils';
	import type { GenericObject } from '$lib/utils';

	export let data: GenericObject[];
	export let title: string | null = null;
	export let tilteColor: string | null = null;
	export let alt: string | null = null;
	export let xAxis = true;
	export let yAxis = true;
	export let xFormatTick = commas;
	export let yFormatTick = commas;
	export let yTicks = 4;
	export let snapTicks = true;
	// export let xFormatTick = (d: string) => d;
	export let color = null;
	// export let colors = color
	// 	? [color]
	// 	: [
	// 			'#206095',
	// 			'#A8BD3A',
	// 			'#003C57',
	// 			'#27A0CC',
	// 			'#118C7B',
	// 			'#F66068',
	// 			'#746CB1',
	// 			'#22D0B6',
	// 			'lightgrey'
	// 	];
	export let height = 200; // number of pixels or valid css height string
	export let xPrefix = '';
	export let xSuffix = '';
	export let yPrefix = '';
	export let ySuffix = '';
	export let xScale = 'linear';
	export let xKey = 'x';
	export let yKey: string | undefined = undefined;
	export let rKey: string | undefined = undefined;
	export let padding = { top: 10, bottom: 20, left: 35, right: 35 };
	export let chartType = 'beeswarm';

	let el: HTMLElement | null;

	// const expoler = false;
	const r = 6;
	// const colors = {
	// 	seq: [
	// 		'rgb(234, 236, 177)',
	// 		'rgb(169, 216, 145)',
	// 		'rgb(0, 167, 186)',
	// 		'rgb(0, 78, 166)',
	// 		'rgb(0, 13, 84)'
	// 	],
	// 	cat: [
	// 		'#206095',
	// 		'#A8BD3A',
	// 		'#003C57',
	// 		'#27A0CC',
	// 		'#118C7B',
	// 		'#F66068',
	// 		'#746CB1',
	// 		'#22D0B6',chartType

	const units = {
		density: 'sq.km',
		age_med: 'years'
	};

	const extents = calcExtents(data, {
		x: (d: { [key: string]: string | number }) => (xKey ? d[xKey] : undefined),
		y: (d: { [key: string]: string | number }) => (yKey ? d[yKey] : undefined),
		r: (d: { [key: string]: string | number }) => (rKey ? d[rKey] : undefined)
	});

	console.log('data:', data[0]);
	console.log('extents:', extents);
</script>

<div bind:this={el}>
	{#if title}
		<Title color={String(tilteColor)}>{title}</Title>
	{/if}
	{#if alt}
		<h5 class="visuallyhidden">{alt}</h5>
	{/if}
	<slot name="options" />
	{#if extents.y && extents.r}
		<div
			class="chart-container"
			style="height: {typeof height == 'number' ? `${height}px` : height ? height : '300px'}"
			aria-hidden="true"
		>
			<LayerCake
				{padding}
				x={xKey}
				y={yKey}
				z={undefined}
				r={rKey ? rKey : undefined}
				yDomain={[0, Number(extents.y[1])]}
				rDomain={[0, Number(extents.r[1])]}
				rRange={[0, 15]}
				zScale={scaleOrdinal()}
				yScale={scaleLinear()}
				{data}
				xScale={xScale === 'linear' ? scaleLinear() : scaleSymlog()}
				let:width
				custom={{ type: chartType }}
			>
				<Svg>
					{#if xAxis}
						<AxisX
							ticks={[10, 100, 1000, 10000]}
							formatTick={xFormatTick}
							prefix={xPrefix}
							suffix=" sq.km"
						/>
					{/if}
					{#if yAxis && yKey}
						<AxisY ticks={yTicks} formatTick={yFormatTick} prefix={yPrefix} suffix={ySuffix} />
					{/if}
					<Dot />
				</Svg>
			</LayerCake>
		</div>
	{/if}
</div>
