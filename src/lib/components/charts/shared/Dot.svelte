<script lang="ts">
	// import { colors } from './../../../posts/utils/ScrollyUK.ts';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	// import { scaleSqrt } from 'd3-scale';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import type { GenericObject } from '$lib/utils';

	/** @type {Number} [r=4] - The circle radius size in pixels. */
	export let radius: number | null = null;

	/** @type {Number} [strokeWidth=1] - The circle's stroke width in pixels. */
	export let strokeWidth: number = 1;

	/** @type {String} [stroke='#fff'] - The circle's stroke color. */
	export let stroke: string = '#fff';

	/** @type {Number} [xStrength=0.95] - The value passed into the `.strength` method on `forceX`. See [the documentation](https://github.com/d3/d3-force#x_strength). */
	export let xStrength = 0.95;

	/** @type {Number} [yStrength=0.075] - The value passed into the `.strength` method on `forceY`. See [the documentation](https://github.com/d3/d3-force#y_strength). */
	export let yStrength = 0.075;

	type Context = {
		data: Writable<GenericObject[]>;
		custom: Writable<{
			type: string;
			colors: string[] | string;
		}>;
		height: Writable<number>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		xGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		yGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		zGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		rGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		r: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		y: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		z: Writable<Function>;	
		zRange: Writable<Array<number | string>>;
	};

	const { data, xGet, height, rGet, r, yGet, custom, y, zGet, z } = getContext<Context>('LayerCake');

	// const tweenOptions = {
	// 	delay: 0,
	// 	duration: 1000,
	// 	easing: cubicOut
	// };

	$: radFunction = (d: GenericObject) => {
		if (typeof $r === 'function') {
			return $rGet(d);
		} else if (typeof radius === 'number') {
			return radius;
		} else {
			return 5;
		}
	};

	// $: tweenedX = tweened(
	// 	$data.map((d) => $xGet(d)),
	// 	tweenOptions
	// );

	// $: console.log(radKeyFunction($data[0]));

	$: simulation = forceSimulation($data)
		.force(
			'x',
			forceX()
				.x((d) => $xGet(d))
				.strength(xStrength)
		)
		.force(
			'y',
			forceY()
				.y($height / 2)
				.strength(yStrength)
		)
		.force(
			'collide',
			forceCollide((d) => radFunction(d) + 0.5)
		)
		.stop();

	$: {
		for (
			let i = 0,
				n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
			i < n;
			++i
		) {
			simulation.tick();
		}
	}

	// const initialVals: { x: number[]; y: number[]; r: number[]; colors: string[] } = {
	// 	x: [],
	// 	y: [],
	// 	r: [],
	// 	colors: []
	// };

	// if ($custom.type == 'beeswarm') {
	// 	initialVals.y = $data.map((d) => +d['y']);
	// } else {
	// 	initialVals.y = $data.map((d) => $yGet(d));
	// }

	// initialVals.r = $data.map((d) => {
	// 	if (typeof $r === 'function') {
	// 		return $rGet(d);
	// 	} else if (typeof radius === 'number') {
	// 		return radius;
	// 	} else {
	// 		return 5;
	// 	}
	// });

	// initialVals.colors = $data.map((d) => {
	// 	if (typeof $custom.colors === 'string') {
	// 		return $custom.colors
	// 	} else {
	// 		return $custom.colors[4]
	// 	}
	// })

	// const tweenedY = tweened(initialVals.y, tweenOptions);
	// const tweenedR = tweened(initialVals.r, tweenOptions);
	// const tweenedColors = tweened(initialVals.colors, tweenOptions);

	// $: {
	// 	if ($custom.type == 'beeswarm') {
	// 		tweenedY.set($data.map((d) => +d['y']));
	// 	} else {
	// 		tweenedY.set($data.map((d) => $yGet(d)));
	// 	}
	// }

	// $: tweenedR.set($data.map((d) => radFunction(d)));

	$: console.log('$data', $data[0]);
	$: console.log('zGet', $z($data[0]));
</script>

<!-- {#if Math.max(...$tweenedY)} -->
	<g class="bee-group">
		{#each $data as node, i}
			<circle
				fill={typeof $custom.colors === 'string' ? String($custom.colors) : String(node.density_color)}
				{stroke}
				stroke-width={strokeWidth}
				cx={$custom.type === 'beeswarm' ? node.x : $xGet(node)}
				cy={$custom.type === 'beeswarm' ? node.y : $yGet(node)}
				r={radFunction(node)}
			/>
		{/each}
	</g>
<!-- {/if} -->

<style>
	circle {
		transition: all 1000ms ease;
		/* fill: var(--brand) */
	}
</style>
