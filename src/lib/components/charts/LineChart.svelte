<script lang="ts">
	import { LayerCake, Svg, ScaledSvg, Html, calcExtents } from 'layercake';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { scaleBand, scaleOrdinal, scaleLinear, scaleSymlog, scaleTime } from 'd3-scale';
	import { min, max, group, extent } from 'd3-array';
	import { format, precisionFixed } from 'd3-format';
	import { timeParse, timeFormat } from 'd3-time-format';
	import Line from '$lib/components/charts/shared/Line.svelte';
	import AxisX from '$lib/components/charts/shared/AxisX.svelte';
	import AxisY from '$lib/components/charts/shared/AxisY.svelte';
	import Title from '$lib/components/charts/shared/Title.svelte';
	import Labels from '$lib/components/charts/shared/GroupLabels.svelte';
	import SetCoords from './shared/SetCoords.svelte';
	import { commas} from '$lib/utils';

	export let flatData: {
		[key: string]: number | string;
	}[];
	export let data: {
		name: string;
		values: {
			code: string;
			name: string;
			parent: string;
			value: number;
			year: number;
			[key: string]: any; // Add index signature
		}[];
	};
	export let height = 200; // number of pixels or valid css height string
	export let ssr = false;
	export let ssrWidth = 300; // for SSR only. Must be a number
	export let ssrHeight: number | undefined = typeof height == 'number' ? height : 200; // for SSR only. Number, or calculated from 'height'
	export let animation = true;
	export let duration = 800;
	export let xKey = 'x';
	export let yKey = 'y';
	export let zKey: string | number | Function | any[] | undefined = undefined;
	export let idKey = zKey;
	export let labelKey = idKey;
	export let xScale;
	export let yScale = 'linear';
	export let yFormatTick = commas;
	export let xFormatTick = (d: string) => d;
	export let yMax = null;
	export let yMin = 0;
	export let xAxis = true;
	export let yAxis = true;
	export let xTicks = 4;
	export let yTicks = 4;
	export let zDomain = null;
	export let title: string | null = null;
	export let tilteColor: string | null = null;
	export let alt: string | null = null;
	export let footer = null;
	export let legend = false;
	export let labels = false;
	export let snapTicks = true;
	export let line = true;
	export let area = true;
	export let areaOpacity = 1;
	export let padding = { top: 0, bottom: 20, left: 35, right: 0 };
	export let color: string | null = null;
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
	export let lineWidth = 2.5;
	export let interactive = true;
	export let xPrefix = '';
	export let xSuffix = '';
	export let yPrefix = '';
	export let ySuffix = '';
	export let hover = true;
	export let hovered: string | null = null;
	export let colorHover = 'orange';
	export let select = false;
	export let selected: string | null = null;
	export let colorSelect = '#206095';
	export let highlighted: string[] = [];
	export let colorHighlight = '#206095';
	export let output = null;

	let el: HTMLElement | null;

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut
	};
	const coords = tweened(undefined, tweenOptions);

	// const yValMax = max(data.map((item) => item.value));

	// console.log(yValMax);
	const extents = calcExtents(flatData, {
		x: (d: { [key: string]: string | number }) => d[xKey],
		y: (d: { [key: string]: string | number }) => d[yKey]
	});

	// $: console.log(xKey);
	// $: console.log('flatData', flatData);
	// $: console.log('wide data', data);
	// $: console.log('group data', data);
	// $: console.log('coords', extents);
</script>

<div bind:this={el}>
	{#if title}
		<Title color={String(tilteColor)}>{title}</Title>
	{/if}
	{#if alt}
		<h5 class="visuallyhidden">{alt}</h5>
	{/if}
	<slot name="options" />
	{#if extents.y && extents.y.length > 1}
		<div
			class="chart-container"
			style="height: {typeof height == 'number' ? `${height}px` : height ? height : '300px'}"
			aria-hidden="true"
		>
			<LayerCake
				{padding}
				{ssr}
				height={ssr ? ssrHeight : height}
				width={ssr ? ssrWidth : undefined}
				x={xKey}
				y={yKey}
				z={zKey}
				yDomain={[0, Number(extents.y[1])]}
				xScale={scaleLinear()}
				yScale={scaleLinear()}
				zScale={scaleOrdinal()}
				zRange={colors}
				{data}
				{flatData}
				custom={{
					type: 'line',
					idKey,
					labelKey,
					coords,
					colorSelect,
					colorHover,
					colorHighlight,
					animation,
					duration
				}}
			>
				<SetCoords />
				{#if labels}
					<Html>
						<Labels {hovered} />
					</Html>
				{/if}
				<Svg pointerEvents={interactive}>
					{#if xAxis}
						<AxisX
							ticks={xTicks}
							formatTick={xFormatTick}
							{snapTicks}
							prefix={xPrefix}
							suffix={xSuffix}
						/>
					{/if}
					{#if yAxis}
						<AxisY ticks={yTicks} formatTick={yFormatTick} prefix={yPrefix} suffix={ySuffix} />
					{/if}
					<!-- {#if area}
						<Area {mode} opacity={areaOpacity} />
					{/if} -->
					{#if line}
						<Line bind:selected bind:hovered {lineWidth} {select} {hover} {highlighted} />
					{/if}
					<slot name="svg" />
				</Svg>
				<slot name="front" />
			</LayerCake>
		</div>
	{/if}
</div>
