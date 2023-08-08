<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';

// import FirstPage from "$lib/posts/FirstPost.svelte";
    import { formatDate } from '$lib/utils'

    export let data

    const {posts} = data
	
</script>

<section>
    <h2>Blog Posts</h2>
    <ul class="posts">
        {#each posts as post}
        <li class="post">
            <a href="../blog/{post.slug}" class="title">{post.title}</a>
            <p class="date">{formatDate(post.published)}</p>
            <p class="description">{post.description}</p>
        </li>
		{/each}
	</ul>
</section>

<Seo title="Blog | Business Frontpage" description="This is about page" type="WebPage" />
<style>
    section {
        padding: var(--size-fluid-3) var(--size-fluid-4);
    }
	.posts {
		display: grid;
		gap: 2rem;
	}

	.post {
		max-inline-size: 800px;
	}

	.post:not(:last-child) {
		border-bottom: 1px solid var(--border);
		padding-bottom: var(--size-7);
	}

	.title {
		font-size: var(--font-size-fluid-3);
		text-transform: capitalize;
	}

	.date {
		color: var(--text-2);
	}

	.description {
		margin-top: var(--size-3);
	}
</style>
