<script lang="ts">
	import Arrow from '$lib/components/ui/ScrollArrow.svelte';
	import Toggle from '$lib/components/ui/AnimationToggle.svelte';
	import { browser } from '$app/environment';
	import { getMotion } from '$lib/utils';

	export let bgimage = null;
	export let bgfixed = false;
	export let center = true;
	export let short = false;
	export let heading = '';
	export let intro = '';
	export let animated = false;

	let animation = true;
	if (browser) {
		animation = getMotion();
	}

	let style = '';

	if (bgimage) {
		style += `background-image: url(${bgimage});`;
	} else {
		style += 'background-image: none;';
	}

	if (bgfixed) {
		style += ' background-attachment: fixed;';
	}
</script>

<header {style} class:short>
	<div style="position: relative; max-width:85ch; margin:auto" class:short class:height-full={!short}>
		<div class:center>
			<h1>{heading}</h1>
			<p class="intro">{intro}</p>
			{#if animated}
				<div class="animations">
					<p>The following uses transition animations, if this upsets you toggle them off</p>
					<p>
						<Toggle
							label="Animation {animation ? 'on' : 'off'}"
							mono={true}
							bind:checked={animation}
						/>
					</p>
					<div>
						<Arrow color="white" {animation}>Scroll to begin</Arrow>
					</div>
				</div>
			{/if}
			<slot />
		</div>
	</div>
</header>

<style>
	header {
		background-color: var(--brand);
		color: var(--text-1);
		padding: var(--size-4) var(--size-4);
	}
	h1 {
		font-size: var(--font-size-fluid-3);
		/* max-inline-size: none; */
		letter-spacing: var(--font-letterspacing-3);
		padding-block-end: var(--size-4);
	}
	.intro {
		font-size: clamp(1rem, 3vw, 2rem);
		padding-block-end: var(--size-13);
	}
	.short {
		min-height: 80vh;
	}
	.animations {
		position: absolute;
		bottom: 0;
	}
	.animations > * {
		font-size: var(--font-size-fluid-0);
	}
	@media (min-width: 768px) {
		header {
			padding-inline: var(--size-9);
		}
	}
</style>
