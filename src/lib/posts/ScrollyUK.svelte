<script lang="ts">
	// import { LayerCake } from 'layercake';
	import { setContext, onMount, getContext } from 'svelte';
	import { readable, derived, writable } from 'svelte/store';
	import { browser } from '$app/environment';

	import { group, groups, max, rollup, merge } from 'd3-array';
	import { LayerCake, Svg, flatten, groupLonger } from 'layercake';
	import { scaleBand } from 'd3-scale';

	// import { width } from './ScrollyUK';
	// CORE IMPORTS

	import { getMotion, getData, colors } from '$lib/utils.js';
	import Header from '$lib/components/ui/PostHeader.svelte';
	import Divider from '$lib/components/ui/Divider.svelte';
	import BarChartONS from '$lib/components/charts/BarChartONS.svelte';
	import MyBarChart from '$lib/components/charts/MyBarChart.svelte';
	import MyLineChart from '$lib/components/charts/MyLineChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import ScatterChartONS from '$lib/components/charts/ScatterChartONS.svelte';

	// import { postData } from './data/stores.js';

	import type { dataType, timeseriesType } from './ScrollyUK';
	import { metadata } from './ScrollyUK';
	import type { Post } from '$lib/types.js';
	import Media from '$lib/components/ui/Media.svelte';
	import DotChart from '$lib/components/charts/DotChart.svelte';
	// import type { dataType } from '$lib/types.js';
	// import { head_selector } from 'svelte/internal';
	// setContext('head_sel', 'head_selector');

	// const st = getContext('head_sel')
	// console.log($postData);
	// console.log(getContext('head_sel'));
	// const data2 = getContext('head_sel');

	// console.log(metadata);


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
	// 		'#22D0B6',
	// 		'lightgrey'
	// 	]
	// };

	const testData = [
		{ value: 2, year: 1979 },
		{ value: 3, year: 1980 },
		{ value: 5, year: 1981 },
		{ value: 5, year: 1982 },
		{ value: 18, year: 1983 }
	];

	const expoler = false;

	const xKey = 'value';
	const yKey = 'year';

	testData.forEach((d) => {
		d[xKey] = +d[xKey];
	});

	export let meta: Post;

	export let data: dataType;

	let width = 800;
	let colWidth = 400;

	// CONFIG FOR SCROLLER COMPONENTS
	// Config
	const threshold = 0.65;
	// State
	let animation = true;
	if (browser) {
		animation = getMotion();
	}
	let id = {}; // Object to hold visible section IDs of Scroller components
	let idPrev = {}; // Object to keep track of previous IDs, to compare for changes
	onMount(() => {
		idPrev = { ...id };
	});

	// Constants
	const datasets = ['region', 'district'];
	const topojson = './data/geo_lad2021.json';
	const mapstyle = 'https://bothness.github.io/ons-basemaps/data/style-omt.json';
	const mapbounds = {
		uk: [
			[-9, 49],
			[2, 61]
		]
	};

	const groupedDistrict = group(data.district.timeseries, (d) => d.name);

	interface TestData {
		name: string;
		test: number;
		score: number;
	}

	const dataT: TestData[] = [
		{ name: 'Alice', test: 1, score: 90 },
		{ name: 'Alice', test: 2, score: 100 },
		{ name: 'Alice', test: 3, score: 90 },
		{ name: 'Alice', test: 4, score: 100 },
		{ name: 'Bob', test: 1, score: 902 },
		{ name: 'Bob', test: 2, score: 90 },
		{ name: 'Bob', test: 3, score: 67 },
		{ name: 'Bob', test: 4, score: 100 },
		{ name: 'Carol', test: 1, score: 80 },
		{ name: 'Carol', test: 2, score: 80 },
		{ name: 'Carol', test: 3, score: 89 },
		{ name: 'Carol', test: 4, score: 85 }
	];

	interface Datum {
		code: string;
		name: string;
		parent: string;
		value: number;
		year: number;
	}

	const dataTT = dataT.reduce((acc: { name: string; values: TestData[] }[], curr: TestData) => {
		const index = acc.findIndex((item) => item.name === curr.name);
		if (index !== -1) {
			acc[index].values.push(curr);
		} else {
			acc.push({ name: curr.name, values: [curr] });
		}
		return acc;
	}, []);

	// console.log(dataTT); // Output the grouped dataTT array
	// console.log(data.district.timeseries)

	interface DataType {
		code: string;
		name: string;
		parent: string;
		value: number;
		year: number;
		[key: string]: any; // Add index signature
	}

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
	<!-- <MyBarChart
		width={colWidth}
		data={[...data.region.indicators].sort((a, b) => b.pop - a.pop)}
		values="pop"
		categories="name"
		title="Population by region/nation, 2020"
		height={350}
	/>
	<BarChartONS
			data={[...data.region.indicators].sort((a, b) => b.pop - a.pop)}
			xKey="pop"
			yKey="name"
			snapTicks={false}
			xFormatTick={(d) => d / 1e6}
			xSuffix="m"
			height={350}
			padding={{ top: 0, bottom: 15, left: 140, right: 0 }}
			area={false}
			title="Population by region/nation, 2020"
		/> -->
	<!-- <p> -->
	<!-- </p> -->
	<!-- <div class="chart-container">
			<LayerCake
			padding={{ top: 0, bottom: 20, left: 35 }}
			x={xKey}
			y={yKey}
			yScale={scaleBand().paddingInner([0.05])}
			xDomain={[0, null]}
			data={testData}
			>
			<Svg>
				<BarChart />
			</Svg>
		</LayerCake>
	</div> -->
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

<!-- <div bind:clientWidth={width} class="line-container">
	{#if data.district.timeseries}
		<MyLineChart
			data={groupedDistrict}
			fullData={data}
			xKey="year"
			{width}
			height={550}
			yKey="value"
			title="Mid-year population by district, 2001 to 2020"
		/>
	{/if}
</div> -->

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
		The chart below will respond to the captions as you scroll down. The "Scroller" component is
		set to "splitscreen" mode, which means the captions will be on the left side on larger screens. On smaller screen the visualizaions will become the background with the text components scrolling on top.
	</p>
	<p>
		The chart is hoverable as well with a tooltip indicating the district's name.
	</p>
</section>

<div bind:clientHeight={colWidth} class="dot-container">
	<DotChart
		data={data.district.indicators.map((d) => ({
		...d,
		parent_name: metadata.region.lookup[d.parent].name
	}))}
		colors={explore ? ['lightgrey'] : colors.cat}
		xScale = 'log'
		height = {550}
		xKey = "area"
		yKey = {undefined}
		rKey = 'pop'
		chartType = "beeswarm"

	/>
</div>

<!-- <ScatterChartONS
	height="calc(100vh - 150px)"
	data={data.district.indicators.map((d) => ({
		...d,
		parent_name: metadata.region.lookup[d.parent].name
	}))}
	colors={explore ? ['lightgrey'] : colors.cat}
	xKey="area"
	yKey={null}
	zKey={null}
	rKey={null}
	idKey="code"
	labelKey="name"
	r={[3, 10]}
	xScale="log"
	xTicks={[10, 100, 1000, 10000]}
	xFormatTick={(d) => d.toLocaleString()}
	xSuffix=" sq.km"
	yFormatTick={(d) => d.toLocaleString()}
	legend={explore}
	labels
	select={explore}
	selected={null}
	colorSelect="#206095"
	colorHighlight="#999"
	overlayFill
	{animation}
/> -->

<Divider />

<style>
	.flow > :where(:not(:first-child)) {
		margin-top: 2em;
	}
	section {
		margin-block-start: var(--size-7);
		width: min(75%, 70ch);
		/* width: 100%-2rem; */
		/* width: 600px; */
		/* width: min(70ch, calc(20% + 100px)); */
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
		/* width:800px; */
		height: auto;
		/* height: 370px; */
		margin-inline: auto;
		/* padding-inline: var(--size-3); */
		/* border: saddlebrown solid; */
	}

	.dot-container {
		width: 75%;
		/* width:800px; */
		height: auto;
		/* height: 370px; */
		margin-inline: auto 0;
		/* padding-inline: var(--size-3); */
		/* border: saddlebrown solid; */
	}

	.caption {
		color: var(--text-2);
		background-color: var(--surface-1);
		font-weight: var(--font-weight-1);
	}

	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	/* .chart-container {
		width: 100%;
		height: 250px;
	} */
</style>
