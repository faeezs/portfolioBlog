<script lang="ts">
	import { min, max, group, extent } from 'd3-array';
	import { scaleLinear, scaleBand } from 'd3-scale';
	import { line } from 'd3-shape';
	import { select, selectAll } from 'd3-selection';
	import { axisLeft, axisBottom, type Axis } from 'd3-axis';

	import Title from './shared/Title.svelte';

	// export let data2;
	// export let data;
	export let fullData;
	export let xKey: string;
	export let yKey: string;
	// export let zKey;
	export let title: string | null = null;
	export let alt: string | null = null;
	export let padding = { top: 30, bottom: 15, left: 50, right: 120 };

	// const distinct = (d, i, arr) => arr.indexOf(d) ==  i;

	// function getTotals(data, keys) {
	// 	let arr = [];
	// 	keys.forEach(key => {
	// 		let vals = data.filter(d => d[xKey] == key).map(d => d[yKey]);
	// 		let sum = vals.reduce((acc, curr) => acc + curr);
	// 		arr.push(sum);
	// 	});
	// 	return arr;
	// }

	const data2 = fullData.district.timeseries;

	// console.log(fullData);
	// console.log(data);
	// console.log(fullData.district.indicators.find(o => o.name === 'Hartlepool')['parent']);

	// const chartData: {
	// 	label: string;
	// 	xData: number[];
	// 	yData: number[];
	// }[] = Array.from(data, ([name, group]) => ({
	// 	label: name,
	// 	xData: Array.from(group, (d) => d[xKey]),
	// 	yData: Array.from(group, (d) => d[yKey])
	// }));

	interface DataItem {
		name: string; //each line
		year: number; //x-axis
		value: number; //y-axis
	}

	// const maxVals: {
	// 	name: string;
	// 	maxPop: number | undefined;
	// }[] = Array.from(data, ([name, group]) => ({
	// 	name,
	// 	maxPop: max(group, (d) => Number(d.value))
	// }));
	// const maxVal = max(maxVals, (d) => d.maxPop);

	// const uniqueYears = new Set<number>();
	// data.forEach((group) => {
	// 	group.forEach((item) => {
	// 		uniqueYears.add(item[xKey as keyof typeof item]);
	// 	});
	// });

	const uniqueNames = data2.reduce((names: string[], item) => {
		if (!names.includes(item.name)) {
			names.push(item.name);
		}
		return names;
	}, []);

	const uniqueYears = data2.reduce((years: number[], item) => {
		if (!years.includes(item.year)) {
			years.push(item.year);
		}
		return years;
	}, []);

	// console.log(uniqueYears2);

	export let height: number = 300; // number of pixels or valid css height string
	export let width = 1050;

	let el: HTMLElement | null;

	// $: xScale = scaleLinear()
	// 	.domain([Math.min(...uniqueYears), Math.max(...uniqueYears)])
	// 	.range([0, width]);

	// $: yScale = scaleLinear()
	// 	.domain([0, maxVal ? maxVal : 0])
	// 	.range([height, 0]);

	const yVals = data2.map((item) => item.value);
	// console.log(max(yVals));

	$: xScale = scaleLinear()
		.range([0, width - padding.left - padding.right])
		.domain(extent(data2, (d) => d.year));
	$: yScale = scaleLinear()
		.range([height - padding.top - padding.bottom, 0])
		.domain([0, max(yVals)]);
	$: lineGenerator = line()
		.x((d) => xScale(d.year))
		.y((d) => yScale(d.value));

	let leftAxis: any;
	let bottomAxis: any;
	let gridlinesVertical: any;
	let gridlinesHorizontal: any;

	$: select(leftAxis)
		// .call(axisLeft(yScale).tickSize(0).ticks(5).tickFormat((d) => String(d/1000000)).tickPadding(20))
		.call(
			axisLeft(yScale)
				.tickSize(0)
				.ticks(5)
				.tickFormat(function(d:number, i: number, n)  {
					return n[i + 1] ? String(d / 1000000) : String(d / 1000000) + 'm';
				})
				.tickPadding(20)
		)
		.call((g: any) => g.select('.domain').remove())
		.selectAll('text')
		.style('text-anchor', 'end')
		.style('dominant-baseline', 'ideographic')
		.attr('dy', '-0.35em');
	// .call((g: any) => g.select('.axis-left .tick:last-child').data('Miles of cars'));
	$: select(bottomAxis)
		.call(axisBottom(xScale).tickSize(0).ticks(4, ''))
		.call((g: any) => g.select('.domain').remove())
		.call((g: any) => g.select('.axis-bottom .tick:first-child').style('text-anchor', 'start'))
		.call((g: any) => g.select('.axis-bottom .tick:last-child').style('text-anchor', 'end'));
	$: select(gridlinesVertical)
		.call(
			axisBottom(xScale)
				.tickSize(-height + padding.bottom)
				.tickFormat(() => '')
				.ticks(5)
		)
		.call((g: any) => g.select('.domain').remove());
	$: select(gridlinesHorizontal)
		.call(
			axisLeft(yScale)
				.tickSize(-width)
				.tickFormat(() => '')
				.ticks(6)
		)
		.call((g: any) => g.select('.domain').remove());

	// $: console.log(bottomAxis.ticks());

	// $: console.log(lineGenerator(data2));
	// console.log(data2.filter((item) => item.name === 'Hartlepool'));

	// let chartLines: any;
	// $: select(chartLines).call()

	// const svg = select('.chart').append('svg').attr('width', width).attr('height', height);

	// $: console.log(yScale.domain());

	// const groups = Array.from(data2.keys());
	// console.log(lineGenerator(data2));

	// $: lineGenerator = line(
	// 	(d) => xScale(d.xData),
	// 	(d) => yScale(d.yData)
	// );

	// $: line_gen = line()
	// .x((d) => xScale(d.xData))
	// .y((d) => yScale(d.yData))(chartData[0]);

	// $: console.log(xScale(2019));
	// $: console.log(lineGenerator);

	// 	let path = line()
	//   .x(d => xScale(d.xData))
	//   .y(d => yScale(d[city]))
	//   .curve(curveStep);

	// const lineGenerator = line<DataItem>().x((d) =>
	// 	xScale(d.year + xScale.bandwidth() / 2).y((d) => yScale(d.value))
	// );

	// console.log(lineGenerator(data.get('Hartlepool')));
	// console.log(data.get('Hartlepool'));

	// type datumStruct = { code:string, name:string, value:number, year:number}

	// const Hart = data[0]
	// const HartYear = Hart.get('year');

	// let xVal: number[] = [];
	// Hart.map((d) => {
	//     xVal.push(d['year'])
	// })
	// console.log(xVal);
	// console.log(data2);
	// console.log(Hart[1]);
	// console.log(Array.from(data, ([key, values])))
	let hoveredData: number | null;
	let hoveredDistrict: string | null = null;
	let hoveredParent: string | null = null;

	// console.log(fullData.district.indicators.find(o => o.name === 'Hartlepool')['parent']);

	const getDistrict = (obj: object, district: string) => {
		return obj.filter((item) => item.name === district);
	};
	const getDistrictValue = (obj: object, district: string, value: string) => {
		return obj.find((o) => o.name === district)[value];
	};
	const getDistrictParent = (district: string) => {
		return fullData.district.indicators.find((o) => o.name === district)['parent'];
	};

	// console.log(getDistrictValue(fullData.district.indicators, 'Hartlepool', 'parent'));
	// console.log(getRegion(data2, 'Hartlepool'));
	// console.log(data2.filter((item) => item.name === 'Hartlepool'));
	// $: console.log(hoveredParent)
</script>

<!-- {#each chartData as daum, i}
	<ul>
		<li>{daum.label}</li>
	</ul>
{/each} -->

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
		style="height: {typeof height == 'number' ? `${height}px` : height ? height : '300px'}"
		aria-hidden="true"
		on:mouseleave={() => {
			hoveredDistrict = null;
			hoveredParent = null;
		}}
	>
		<svg {width} {height}>
			<g
				class=" axis gridVert"
				transform="translate({padding.left}, {height - padding.bottom})"
				bind:this={gridlinesVertical}
			/>
			<g
				class=" axis gridHori"
				transform="translate({0}, {padding.top})"
				bind:this={gridlinesHorizontal}
			/>
			<g
				class="axis-bottom"
				transform="translate({padding.left}, {height - padding.bottom})"
				bind:this={bottomAxis}
			/>
			<g
				class="axis-left"
				bind:this={leftAxis}
				transform="translate({padding.left}, {padding.top})"
			/>
			<g transform="translate({padding.left} {padding.top})">
				{#each uniqueNames as district, i}
					<!-- {console.log(data2.filter((item) => item.name === district)[0]['code'])} -->
					<path
						d={lineGenerator(getDistrict(data2, district))}
						style={hoveredData !== null && hoveredDistrict === district
							? 'stroke: red; stroke-width: 2;'
							: hoveredParent !== null && hoveredParent === getDistrictParent(district)
							? 'stroke:pink; stroke-width: 2;'
							: 'stroke: var(--surface-4)'}
						on:mouseover={() => {
							// hoveredData = district;
							// hoveredData = getRegion(data2, district)
							hoveredDistrict = district;
							// hoveredParent = getDistrictValue(fullData.district.indicators, district, 'parent')
							hoveredParent = getDistrictParent(district);
						}}
						on:focus={() => {
							// hoveredData = district;
							// hoveredData = getRegion(data2, district)
							hoveredDistrict = district;
							// hoveredParent = getDistrictValue(fullData.district.indicators, district, 'parent')
							hoveredParent = getDistrictParent(district);
						}}
					/>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	/* svg {
		background-color: red;
	} */
	path {
		fill: transparent;
		/* stroke: var(--surface-4); */
		/* stroke-width: 1.5; */
		stroke-linejoin: round;
	}
	.gridVert,
	.gridHori {
		color: var(--surface-4);
		stroke-width: 2;
	}
</style>
