<script>
	import Seo from '$lib/components/Seo.svelte';
	// import { postData } from '$lib/posts/data/stores';
	import {setContext} from 'svelte';

	export let data;
	$: post = data.post;
	$: meta = data.meta;
	$: postdata = data.postdata;

	// postData.set(postdata)

	const result = [
		{ trait_type: 'Neck Gear', value: '1' },
		{ trait_type: 'Alpha Score', value: '6' },
		{ trait_type: 'Generation', value: 'Gen 0' }
	];

	// console.log(meta);

	// setContext('head_sel', postdata);


	// console.log(meta.find(r => r.primary_key == "scrolly-uk"))
</script>

<!-- <div class="container">
	<h1>{post.title}</h1>
	<p>{post.body}</p>
</div> -->
<svelte:component this={post} {meta} data={postdata}/>
<!-- <h1>{post.title}</h1> -->

{#if meta}
	<Seo
		title="{meta.title} | Business Frontpage"
		description={meta.description}
		type="BlogPosting"
	/>
{/if}
