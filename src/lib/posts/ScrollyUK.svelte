<script lang="ts">
	import { browser } from '$app/environment';

	// CORE IMPORTS	
	import Scroller from '@sveltejs/svelte-scroller';
	import { getMotion, colors } from '$lib/utils.js';
	import Header from '$lib/components/ui/PostHeader.svelte';
	import Divider from '$lib/components/ui/Divider.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';

	import type { dataType, timeseriesType } from './ScrollyUK';
	import { metadata } from './ScrollyUK';
	import type { Post } from '$lib/types.js';
	import DotChart from '$lib/components/charts/DotChart.svelte';

	export let meta: Post;

	export let data: dataType;

	let width = 800;
	let colWidth = 400;

	let animation = true;
	if (browser) {
		animation = getMotion();
	}

	// CONFIG FOR SCROLLER COMPONENTS
	// Config
	// const threshold = 0.65;

	const dataG = data.district.timeseries.reduce(
		(acc: { name: string; values: timeseriesType[] }[], curr: timeseriesType) => {
			const index = acc.findIndex((item) => item.name === curr.name);
			if (index !== -1) {
				acc[index].values.push(curr);
			} else {
				acc.push({ name: curr.name, values: [curr] });
			}
			return acc;
		},
		[]
	);

	const explore = false;

	let count:number;
	let index:number;
	let offset:number;
	let progress:number;
	let top = 0.2;
	let threshold = 0.5;
	let bottom = 0.9;

	const scrollVals = {
		chartType: ['beeswarm','beeswarm','scatter','scatter','scatter'],
		rKey: [undefined,'pop','pop','pop','pop'],
		yKey: [undefined,undefined,'density','density','density'],
		explore: [false,false,false,'density','density'],
	}
</script>

<Header
	bgfixed={true}
	center={false}
	short={true}
	animated={true}
	heading={meta.title}
	intro={meta.description}
/>

<section class="flow">
	<h2>Static visualizations</h2>
	<p>
		Often graphs are static with no interactions. These types of visualizations are best suited for
		print as it doesn't utilise the power of presenting them in modern web browsers.
	</p>
	<p>
		Including these types of visualizations on a website or in a presentation would be to maintain
		consistency with graphics used in a static report such as a pdf.
	</p>
	<blockquote class="text-indent">
		"The greatest value of a picture is when it forces us to notice what we never expected to
		see."&mdash;John Tukey
	</blockquote>
</section>

<Divider />

<section class="flow">
	<h2>Embedded charts or media</h2>

	<p>
		We use a bar chart to quickly rank the regions of the United Kingdom according to population.
		This gives us a snapshot of the population distribution for mid-2020.
	</p>
</section>

<div bind:clientWidth={colWidth} class="bar-container">
	<BarChart
		xKey="pop"
		yKey="name"
		data={[...data.region.indicators].sort((a, b) => b.pop - a.pop)}
		xFormatTick={(d) => String(d / 1e6)}
		snapTicks={false}
		xSuffix="m"
		height={350}
		padding={{ top: 5, bottom: 15, left: 140, right: 0 }}
		title="Population by region/nation, 2020"
	/>
	<div class="caption">{@html 'Source: ONS mid-year population estimates.'}</div>
</div>

<Divider />

<section class="flow">
	<h2>This is a full-width chart demo</h2>
	<p>
		Below is an example of a media grid where the column with is set to "full". This allows for full
		width images and charts.
	</p>
	<p>
		We will repeat the above graphs but do it at a district level. The problem with this idea is
		that there are too many districts to repeat the graph for each in order to highlight the
		specific district.
	</p>

	<p>
		To overcome this obstacle we will use our first form of interaction, hovering. We plot all the
		districts on one graph and when hovering over a particular district it gets highlighted and the
		district's name is shown.
	</p>
</section>

<div bind:clientWidth={width} class="line-container">
	<LineChart
		data={dataG}
		flatData={data.district.timeseries}
		xKey="year"
		yKey="value"
		zKey="code"
		color="lightgrey"
		lineWidth={1}
		xTicks={4}
		snapTicks={true}
		yFormatTick={(d) => String(d / 1e6)}
		ySuffix="m"
		height={550}
		padding={{ top: 30, bottom: 15, left: 50, right: 120 }}
		area={false}
		labels={true}
		title="Mid-year population by district, 2001 to 2020"
	/>
</div>

<Divider />

<section class="flow">
	<h2>This is a dynamic chart section</h2>

	<p>
		The chart below will respond to the captions as you scroll down. The "Scroller" component is set
		to "splitscreen" mode, which means the captions will be on the left side on larger screens. On
		smaller screen the visualizaions will become the background with the text components scrolling
		on top.
	</p>
	<p>The chart is hoverable as well with a tooltip indicating the district's name.</p>
</section>


<Scroller {top} {threshold} {bottom} bind:count bind:index bind:offset bind:progress>
	<div bind:clientHeight={colWidth} class="dot-container" slot="background">
		<DotChart
			data={data.district.indicators.map((d) => ({
				...d,
				parent_name: metadata.region.lookup[d.parent].name
			}))}
			colors={scrollVals.explore[index] ? 'lightgrey' : colors.cat}
			xScale="log"
			height={550}
			xKey="area"
			yKey={scrollVals.yKey[index]}
			rKey={scrollVals.rKey[index]}
			chartType={scrollVals.chartType[index]}
		/>
		<p>{index }</p>
	</div>
	<div slot="foreground">
		<section class='test'>section 1</section>
		<section class='test'>section 2</section>
		<section class='test'>section 3</section>
		<section class='test'>section 4</section>
		<section class='test'>section 5</section>
	</div>
</Scroller>

<Divider />

<style>
	.flow > :where(:not(:first-child)) {
		margin-top: 2em;
	}
	section {
		margin-block-start: var(--size-7);
		width: min(75%, 70ch);
		margin-inline: auto;
		padding-inline: var(--size-3);
	}
	.text-indent {
		text-indent: 2em;
		margin-inline-start: 0.5em;
		max-inline-size: 30ch;
		font-size: var(--font-size-fluid-1);
		font-weight: 600;
	}
	p {
		max-width: 65ch;
	}

	.bar-container {
		width: min(75%, 70ch);
		height: auto;
		margin-inline: auto;
	}

	.dot-container {
		width: 75%;
		height: auto;
		margin-inline: auto 0;
	}

	.caption {
		color: var(--text-2);
		background-color: var(--surface-1);
		font-weight: var(--font-weight-1);
	}

	[slot='foreground'] {
		pointer-events: none;
	}

	[slot='foreground'] section {
		pointer-events: all;
	}

	.test {
		height: 80vh;
		background-color: rgba(0,0,0,0.5);
		color: white;
		padding: 1em;
		margin: 0 0 2em 0;
	}
</style>
