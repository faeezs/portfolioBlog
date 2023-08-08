<script>
	import { ChevronDown } from "lucide-svelte";

	export let color = 'black';
	export let animation = true;
	export let center = true;

	const colors = ['black', 'white'];

	color = colors.includes(color) ? color : 'black';
</script>

{#if center}
	<slot /><br />
    <div class="arrow" class:bounce={animation} aria-hidden="true"> <ChevronDown size={65} strokeWidth={2.25} /></div>
	
{:else}
	<div class="arrow left" class:bounce={animation} aria-hidden="true"> <ChevronDown size={65} strokeWidth={2.25} /></div>
    <slot />
{/if}

<style>
	.left {
		margin-right: 10px;
	}
	.bounce {
		-webkit-animation-duration: 2s;
		animation-duration: 2s;
		-webkit-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
		-webkit-animation-name: bounce;
		animation-name: bounce;
		-webkit-animation-timing-function: ease;
		animation-timing-function: ease;
	}
	@-webkit-keyframes bounce {
		0% {
			-webkit-transform: translateY(10px);
			transform: translateY(10px);
		}
		30% {
			-webkit-transform: translateY(-10px);
			transform: translateY(-10px);
		}
		50% {
			-webkit-transform: translateY(10px);
			transform: translateY(10px);
		}
		100% {
			-webkit-transform: translateY(10px);
			transform: translateY(10px);
		}
	}
	@keyframes bounce {
		0% {
			-webkit-transform: translateY(10px);
			transform: translateY(10px);
		}
		30% {
			-webkit-transform: translateY(-10px);
			transform: translateY(-10px);
		}
		50% {
			-webkit-transform: translateY(10px);
			transform: translateY(10px);
		}
		100% {
			-webkit-transform: translateY(10px);
			transform: translateY(10px);
		}
	}
</style>
