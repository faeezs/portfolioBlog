<!-- <rect x={10} y={10} width={100} height={100} fill="red" /> -->
<script lang="ts">
	import { getContext, createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import type { GenericObject, LayerCakeContext } from '$lib/utils';

	export let lineWidth = 2.5;
	export let hover = true;
	export let hovered: string | null = null;
	export let select = false;
	export let selected: string | null = null;
	export let highlighted: string[] = [];
	export let duration = 800;
	import { interpolateLab } from 'd3-interpolate';

	type Context = {
		data: Writable<dataTT[]>;
		config: Writable<GenericObject>;
		custom: Writable<{
			type: string;
			idKey: string;
			colorHover: string;
			colorHighlight: string;
			colorSelect: string;
			lineWidth: number;
			highlighted: string[];
			coords: any
		}>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		xGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		yGet: Writable<Function>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		zGet: Writable<Function>;
		zRange: Writable<Array<number | string>>;
	};

	type dataTT = {
		key: string;
		values: {
			code: string;
			name: string;
			parent: string;
			value: number;
			year: number;
			[key: string]: any; // Add index signature
		}[];
	};

	const { data, xGet, yGet, custom, zRange } = getContext<Context>('LayerCake');
	const dispatch = createEventDispatcher();

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut,
		interpolate: interpolateLab
	};

	// let coords = $custom.coords;
	let idKey = $custom.idKey;
	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';
	let colorHighlight = $custom.colorHighlight ? $custom.colorHighlight : '#206095';

	const fillColor = tweened(String($zRange[0]), tweenOptions);

	// console.log($data[0].values[0][String(idKey) as keyof object]);

	$: path = (values: GenericObject[]) => {
		return (
			'M' +
			values
				.map((d) => {
					return $xGet(d) + ',' + $yGet(d);
				})
				.join('L')
		);
	};

	function doHover(
		e:
			| (MouseEvent & {
					currentTarget: EventTarget & SVGPathElement;
			  })
			| (FocusEvent & {
					currentTarget: EventTarget & SVGPathElement;
			  }),
		d: GenericObject | null
	) {
		if (hover) {
			hovered = d ? String(d[idKey]) : null;
			dispatch('hover', {
				id: hovered,
				data: d,
				event: e
			});
		}
	}
</script>

<g class="line-group">
	{#each $data as group}
		<path
			class="path-line"
			d={path(group.values)}
			style={group.values[0][idKey] == hovered
				? 'stroke-width: 2.5; stroke: ' + colorHover
				: group.values[0][idKey] == hovered
				? 'stroke: ' + String($zRange[0])
				: 'stroke: var(--surface-4)'}
			on:mouseover={hover ? (e) => doHover(e, group.values[0]) : null}
			on:mouseleave={hover ? (e) => doHover(e, null) : null}
			on:focus={select ? (e) => doHover(e, group.values[0]) : null}
			on:blur={select ? (e) => doHover(e, null) : null}
		/>
	{/each}
</g>

<style>
	.path-line {
		fill: transparent;
		stroke-linejoin: round;
	}
</style>
