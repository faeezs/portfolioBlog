<script lang="ts">
	import { getContext } from 'svelte';

	const {
		data,
		x,
		y,
		r,
		xGet,
		yGet,
		rGet,
		xScale,
		yScale,
		yRange,
		rRange,
		xDomain,
		yDomain,
		custom,
		width
	} = getContext('LayerCake');

	let coords = $custom.coords;
	let type = $custom.type;
	let prevWidth = $width;

	$: setCoords($data, $custom, $x, $y, $r, $width);
	// $: console.log($x)

	function setCoords(data, custom, x, y, r, width) {
		let mode = custom.mode;
		let padding = custom.padding;
		let duration = custom.animation && width == prevWidth ? custom.duration : 0;

		prevWidth = width;

		let newcoords;
		
		// console.log($data)
		newcoords = [...data].map((d) =>{
				return {
					x: $xGet(d),
					y: $yGet(d)
				};}
			)
			
			// );

		coords.set(newcoords, { duration });
	}
</script>
