<script>
	import Seo from '$lib/components/Seo.svelte';

	export let data;
	const { post } = data;
</script>

<!-- <div class="container">
	<h1>{post.title}</h1>
	<p>{post.body}</p>
</div> -->
<svelte:component this={post}>
</svelte:component>

<Seo title="{post.title} | Business Frontpage" description={post.body} type="BlogPosting" />
