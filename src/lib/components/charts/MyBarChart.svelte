<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { readable, derived, writable } from 'svelte/store';
	import type { Readable } from 'svelte/store';

	import { scaleLinear, scaleBand } from 'd3-scale';
	import { path, type Path } from 'd3-path';
	import { axisLeft, axisBottom, type Axis } from 'd3-axis';
	import { select } from 'd3-selection';

	import { groupData, commas } from './ts/utils';
	import Title from './shared/Title.svelte';
	import Table from './shared/Table.svelte';
	import type { ScaleBand, ScaleLinear } from 'd3-scale';
	import type { Domain } from 'domain';
	import { axisRight } from 'd3-axis';

	export let data: {
		[key: string]: number | string;
	}[];
	// export let barHeight = 40; // height of individual bar (overridden if height is set)
	export let height: number = 300; // number of pixels or valid css height string
	export let width = 1050;
	export let values = 'x';
	export let categories = 'y';
	// export let mode = 'default'; // options: 'default', 'comparison', 'marker', 'stacked', 'grouped'
	// export let xMax: number | null = null;
	// export let xMin: number | null = null;
	// export let zKey: null | string = null;
	// export let zDomain: string | null = null;
	export let title: string | null = null;
	// export let animation = true;
	// export let duration = 800;
	export let alt: string | null = null;
	export let padding = { top: 0, bottom: 15, left: 140, right: 0 };
	// export let xTicks = 4;
	export let orientation = 'vertical';

	let el: HTMLElement | null;

	let catVar: string[] = [];
	data.map((d: { [key: string]: string | number }) => {
		catVar.push(d[categories as keyof object] as string);
	});
	let valVar: number[] = [];
	data.map((d) => {
		valVar.push(d[values as keyof object] as number);
	});

	$: catScale = scaleBand()
		.domain(catVar)
		.range([
			0,
			orientation === 'horizontal'
				? width - padding.left - padding.right
				: height - padding.top - padding.bottom
		])
		.paddingOuter(0)
		.paddingInner(0.25);

	$: valScale = scaleLinear()
		.domain([0, Math.max(...valVar) + 2])
		.range([
			0,
			orientation === 'horizontal'
				? height - padding.top - padding.bottom
				: width - padding.left - padding.right
		]);

	let startY = height - padding.bottom - padding.top;
	$: paths = <Array<string>>[];
	// let paths2 = <Array<String>>[];
	$: valVar.map((d: number, i: number) => {
		if (i === 0) {
			paths = [];
		}
		let localBand = catScale(catScale.domain()[i]);
		if (localBand !== undefined && orientation === 'horizontal') {
			let height = valScale(d);
			let combined = `M${localBand},${startY},  ${localBand + catScale.bandwidth()},${startY},  ${
				localBand + catScale.bandwidth()
			},${startY - height}, ${localBand},${startY - height}Z`;

			paths.push(combined);
		} else if (localBand !== undefined && orientation !== 'horizontal') {
			let combined = `M${0},${localBand},  ${valScale(d)},${localBand},  ${valScale(d)},${
				localBand + catScale.bandwidth()
			}, ${0},${localBand + catScale.bandwidth()}Z`;

			paths.push(combined);
		}
	});
	let leftAxis: any;
	let bottomAxis: any;
	let gridlinesVertical: any;

	// $: console.log(paths);

	$: select(leftAxis)
		.call(axisLeft(catScale).tickSize(0).ticks(5))
		.call((g: any) => g.select('.domain').remove());
	$: select(bottomAxis)
		.call(axisBottom(valScale).tickSize(0).ticks(4, 's'))
		.call((g: any) => g.select('.domain').remove())
		.call((g: any) => g.select('.axis .tick:first-child').remove());
	$: select(gridlinesVertical)
		.call(
			axisBottom(valScale)
				.tickSize(-height + padding.top + padding.bottom)
				.tickFormat(() => '')
				.ticks(5)
		)
		.call((g: any) => g.select('.domain').remove());

	let hoveredData: number | null;
	// $: console.log(hoveredData);
</script>

<div bind:this={el}>
	{#if title}
		<Title color="var(--text-1)">{title}</Title>
	{/if}
	{#if alt}
		<h5 class="visuallyhidden">{alt}</h5>
	{/if}
	<slot name="options" />
	<div
		class="chart-container"
		style="height: {typeof height == 'number'
			? `${height}px`
			: height
			? height
			: // : yDomain
			  // ? `${padding.top + padding.bottom + barHeight * yDomain.length}px`
			  '300px'}"
		aria-hidden="true"
		on:mouseleave={() => (hoveredData = null)}
	>
		<svg {width} {height}>
			<g
				class=" axis gridVert"
				transform="translate({padding.left}, {height - padding.bottom})"
				bind:this={gridlinesVertical}
			/>
			<g
				class="axis"
				transform="translate({padding.left}, {height - padding.bottom})"
				bind:this={bottomAxis}
			/>
			<g class="axis" transform="translate({padding.left}, {padding.top})" bind:this={leftAxis} />

			{#if paths}
				<g class="bars" transform="translate({padding.left} {padding.top})">
					{#each paths as path, i}
						<path
							fill={hoveredData!==null && hoveredData === i ? 'red':"rgb(32, 96, 149)"}
							stroke-width="3"
							stroke-linecap="round"
							d={path}
							on:mouseover={() => {
								hoveredData = i;
							}}
							on:focus={() => {
								hoveredData = i;
							}}
						/>
					{/each}
				</g>
			{/if}
		</svg>
	</div>
</div>

<style>
	.chart-container {
		width: 100%;
	}
	/* .visuallyhidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	} */

	.axis {
		/* font-size: clamp(0.5rem, 1.5vw, 0.87rem); */
		font-size: 0.85rem;
		/* font-weight: var(--font-weight-1); */
		color: var(--text-2);
	}
	.gridVert {
		color: var(--surface-4);
	}
</style>
