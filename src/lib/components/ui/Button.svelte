<script>
	export let size = 'medium';
</script>

<button class:small={size === 'small'} class:medium={size === 'medium'} {...$$restProps}>
	<slot />
</button>

<style>
	button {
		border: none;
		border-radius: 0.25em;
		background-color: var(--accent);
		color: var(--surface-1);
		font-size: 1em;
		cursor: pointer;
		--_ink-shadow: 0 1px 0 var(--brand);
	}
	.medium {
		padding: 0.5em 1.5em;
	}
	.small {
		padding: 0.25em 0.5em;
	}
</style>
