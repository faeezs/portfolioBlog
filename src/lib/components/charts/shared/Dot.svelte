<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
	
	import type { GenericObject} from '$lib/utils';

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
		}>;
		height: Writable<number>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		xGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		yGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		rGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		r: Writable<Function>;
		zRange: Writable<Array<number | string>>;
	};
	
	const { data, xGet, height, rGet, r, yGet, custom } = getContext<Context>('LayerCake');

	let radFunction: Function;
	if (typeof $r === 'function') {
		radFunction = (d:GenericObject) => $rGet(d);
	} else if (typeof radius === 'number') {
		radFunction = (d:number) => radius;
	}
	else{
		radFunction = (d:undefined) => 5;
	}

	// $: console.log($rKey)

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

</script>

<g class="bee-group">
	{#each $data as node}
		<circle fill={'blue'} {stroke} stroke-width={strokeWidth} cx={$custom.type === 'beeswarm' ? node.x: $xGet(node)} cy={$custom.type === 'beeswarm' ? node.y: $yGet(node)} r={radFunction(node)} />
	{/each}
</g>
