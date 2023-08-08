<script lang="ts">
    import Header from '$lib/components/ui/PostHeader.svelte';
	import type  { Post } from '$lib/types.js';
    export let meta: Post;
    export let data;

    console.log(data);
</script>

<Header
	bgfixed={true}
	center={false}
	short={true}
	animated={true}
	heading={meta.title}
	intro={meta.description}
/>

<!-- {postdata} -->

<!-- <h1>{meta.title}</h1>
<p>{meta.description}</p> -->
<!-- <p>{data[0].area}</p> -->