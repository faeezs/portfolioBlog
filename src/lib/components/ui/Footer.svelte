<script lang="ts">
	import * as config from '$lib/config';
</script>

<footer>
    <p>{config.title} &copy {new Date().getFullYear()}</p>
</footer>

<style>
    footer {
        padding-block: var(--size-2);
        border-top: 1px solid var(--border);
        background-color: var(--surface-2);
		/* color: var(--text-1); */
        /* width:100dvb */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    p {
        color: var(--text-1);
        margin: auto;
    }
</style>