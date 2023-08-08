<script lang="ts">
	import { LayerCake, Svg, ScaledSvg, Html, calcExtents } from 'layercake';
	import { scaleBand } from 'd3-scale';
	import Bar from '$lib/components/charts/shared/Bar.svelte';
	import AxisX from '$lib/components/charts/shared/AxisX.svelte';
	import AxisY from '$lib/components/charts/shared/AxisY.svelte';
	import Title from '$lib/components/charts/shared/Title.svelte';
	import { groupData, commas } from './ts/utils';

	export let height: number | string | null = null; // number of pixels or valid css height string
	export let title: string | null = null;
	export let alt: string | null = null;
	export let tilteColor: string | null = null;
	export let xKey: string;
	export let yKey: string;
	export let idKey = yKey;
	export let xTicks = 4;
	export let xFormatTick = commas;
	export let snapTicks = false;
	export let xPrefix = '';
	export let xSuffix = '';
	export let yPrefix = '';
	export let ySuffix = '';
	export let textColor = '#666';
	export let tickColor = '#ccc';
	export let tickDashed = false;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let data: {
		[key: string]: number | string;
	}[];
	// export let data;
	export let color = null;
	export let colors = color
		? [color]
		: [
				'#206095',
				'#A8BD3A',
				'#003C57',
				'#27A0CC',
				'#118C7B',
				'#F66068',
				'#746CB1',
				'#22D0B6',
				'lightgrey'
		  ];

	let el; // Chart DOM element
	let highlighted: string[]; // Chart highlight

	const extents = calcExtents(data, {
		x: (d: { [key: string]: string | number }) => d[xKey],
		y: (d: { [key: string]: string | number }) => d[yKey]
	});

	// function clickOutside(node) {
	// 	const handleClick = (event) => {
	// 		if (node && !node.contains(event.target) && !event.defaultPrevented) {
	// 			node.dispatchEvent(new CustomEvent('click_outside', node));
	// 		}
	// 	};

	// 	document.addEventListener('click', handleClick, true);

	// 	return {
	// 		destroy() {
	// 			document.removeEventListener('click', handleClick, true);
	// 		}
	// 	};
	// }

	// function handleClickOutside(event) {
	// 	// alert('Click outside!');
	// 	console.log(highlighted);
	// 	highlighted = [];
	// }

	// if (extents.x) {
	// 	console.log(extents.x.length);
	// }
</script>

<p>Bar Chart</p>

<div bind:this={el}>
	{#if title}
		<Title color={String(tilteColor)}>{title}</Title>
	{/if}
	{#if alt}
		<h5 class="visuallyhidden">{alt}</h5>
	{/if}
	<slot name="options" />
	{#if extents.x && extents.x.length > 1}
		<div
			class="chart-container"
			style="height: {typeof height == 'number' ? `${height}px` : height ? height : '300px'}"
			aria-hidden="true"
		>
			<LayerCake
				{padding}
				x={xKey}
				y={yKey}
				yScale={scaleBand().paddingInner(0.2)}
				xDomain={[0, Number(extents.x[1])]}
				zRange={colors}
				{data}
				custom={{
					type: 'bar',
					idKey,
					highlighted
				}}
			>
				<Svg>
					<AxisX
						ticks={xTicks}
						formatTick={xFormatTick}
						{snapTicks}
						prefix={xPrefix}
						suffix={xSuffix}
						{textColor}
						{tickColor}
						{tickDashed}
					/>
					<AxisY
						gridlines={false}
						prefix={yPrefix}
						suffix={ySuffix}
						{textColor}
						{tickColor}
						{tickDashed}
					/>
					<Bar />
					<slot name="svg" />
				</Svg>
			</LayerCake>
		</div>
	{/if}
</div>

<style>
	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	.chart-container {
		width: 100%;
	}
	.visuallyhidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
