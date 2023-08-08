<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	import What from '$lib/components/ui/What.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { LayoutList, Newspaper } from 'lucide-svelte';

	export let data;
	const { posts } = data;
</script>

<What />
<div class="containers">
	<div class="posts">
		{#each posts as { id, title, image, description, published }}
			<div class="card">
				<div class="card-top">
					<div class="icon">
						<!-- <LayoutList size={104} color="var(--text-1)" strokeWidth={2.25} /> -->
						<Newspaper size="10ch" color="var(--text-2)" strokeWidth={1.25} />
					</div>
				</div>
				<div class="card-bottom">
					<h2>{title}</h2>

					<!-- <img src={image} alt={title} /> -->
					<p>Published at {formatDate(published)}</p>
					<p>{description.substring(0, 160)}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<Seo title="Business Frontpage" description="This is homepage" type="WebSite" />

<style>
	.posts {
			padding: var(--size-fluid-3) var(--size-fluid-4);

	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--surface-4);
		width: fit-content;
		margin: auto;
		padding: var(--size-3);
		border-radius: var(--radius-round);
		margin-block: var(--size-3);
	}
	.card {
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-1);
		/* padding: var(--size-7); */
		margin-block-end: var(--size-5);
		border-radius: var(--radius-3);
		height: var(--size-content-3);
		&:hover {
			box-shadow: var(--shadow-3);
		}
	}

	.card-top {
		border-radius: var(--radius-3) var(--radius-3) 0 0;
		background-color: var(--brand);
	}

	.card-bottom {
		padding: var(--size-7);
		display: flex;
		flex-direction: column;
		gap: var(--size-3);
		border-radius: 0 0 var(--radius-3) var(--radius-3);
		background-color: var(--surface-4);
		height: 100%;
	}

	h2 {
		font-size: clamp(1.5rem, 2vw, 2rem);
	}

	@media (min-width: 768px) {
		.posts {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 2em;
			/* padding: var(--size-fluid-3) var(--size-fluid-3); */
		}
		.card {
			height: 100%;
			/* width: 200px; */
		}
	}
</style>
