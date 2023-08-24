<script lang="ts">
	import { getContext, createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { ScaleLinear, ScaleBand } from 'd3-scale';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { interpolateLab } from 'd3-interpolate';
	import type { GenericObject } from '$lib/utils';

	// export let fill = '#00bbff';
	export let hover = true;
	export let hovered: string | null = null;
	export let select = true;
	export let selected: string | null = null;
	export let overlayFill = true;
	export let highlighted: string[] = [];
	export let duration = 800;

	type Context = {
		data: Writable<GenericObject[]>;
		config: Writable<GenericObject>;
		custom: Writable<{
			type: string;
			idKey: string;
			colorHover: string;
			colorHighlight: string;
			colorSelect: string;
			lineWidth: number;
			highlighted: string[];
		}>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		xGet: Writable<Function>;
		xScale: Writable<ScaleLinear<number, number>>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		yGet: Writable<Function>;
		yScale: Writable<ScaleBand<number | string>>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		zGet: Writable<Function>;
		zRange: Writable<Array<number | string>>;
	};

	const { data, config, xGet, yGet, zGet, xScale, zRange, yScale, custom } =
		getContext<Context>('LayerCake');

	const dispatch = createEventDispatcher();

	const tweenOptions = {
		duration: duration,
		easing: cubicInOut,
		interpolate: interpolateLab
	};

	// $: highlighted = [];

	let idKey = $custom.idKey;

	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
	let colorSelect = $custom.colorSelect ? $custom.colorSelect : 'red';
	let colorHighlight = $custom.colorHighlight ? $custom.colorHighlight : 'green';
	// let highlighted: string[] = $custom.highlighted?$custom.highlighted : [];
	let lineWidth = $custom.lineWidth ? $custom.lineWidth : 2;

	const fillColor = tweened(String($zRange[0]), tweenOptions);

	// console.log($fillColor);

	function doHover(
		e:
			| MouseEvent
			| (FocusEvent & {
					currentTarget: EventTarget & SVGRectElement;
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

	function doSelect(
		e:
			| MouseEvent
			| (FocusEvent & {
					currentTarget: EventTarget & SVGRectElement;
			  }),
		d: GenericObject | null
	) {
		if (select) {
			selected = d ? String(d[idKey]) : null;
			// fillColor.set(d ? colorSelect : String($zRange[0]));
			dispatch('select', {
				id: selected,
				data: d,
				event: e
			});
		}
	}
	function clickOutside(node: HTMLElement | SVGGElement): { destroy: () => void } {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				node.dispatchEvent(new CustomEvent('click_outside', { bubbles: true }));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	function handleClickOutside(event: MouseEvent) {
		selected = null;
	}

	// $: console.log(colorSelect);

	const catInd = 1;


</script>

<g class="bar-group">
	{#each $data as d, i}
		{#if d[idKey]}
			<rect
				class="group-rect"
				data-id={i}
				x={$xScale.range()[0]}
				y={$yGet(d)}
				style="--lineWidth:{lineWidth}; --colorHover:{colorHover}; --colorSelect:{colorSelect}; --colorBar: {`var(--cat-${catInd})`};"
				height={$yScale.bandwidth()}
				width={Math.abs($xGet(d))}
				on:focus={(e) => doSelect(e, d)}
			/>
		{/if}
	{/each}
</g>

<style>
	rect {
		transition: fill 800ms ease, opacity 800ms ease, filter 800ms ease;
		cursor: pointer;
		fill: var(--colorBar);
		stroke-width: 0;
	}
	/* rect:focus {
		outline: none;
		fill: var(--accent);
		stroke-width: var(--lineWidth) ;
		stroke: var(--colorSelect);
	} */
	rect:hover, rect:focus {
		/* fill: var(--surface-4); */
		outline: none;
		filter: saturate(5);
		/* stroke-width: var(--lineWidth);
		stroke: var(--brand); */
	}
</style>
