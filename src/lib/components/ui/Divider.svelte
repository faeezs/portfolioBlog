<script>
	export let hr = true;
</script>

<section>
	<div class="col-medium">
		{#if hr}
			<hr />
		{:else}
			<hr style="border: none;" />
		{/if}
	</div>
</section>

<style>
	hr {
		width: 75px;
		border: none;
		border-top: 2px solid;
		margin: 40px auto -10px auto;
	}
</style>
