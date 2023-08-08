<script lang="ts">
	export let weight = 'bold'
	export let color = 'black'
	export let fontSize = '1.2em'
</script>

<div class="title" style="font-size: {fontSize}; font-weight: {weight}; color: {color};"><slot/></div>