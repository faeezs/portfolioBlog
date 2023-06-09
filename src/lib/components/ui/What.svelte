<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Contact from '$lib/components/ui/Contact.svelte';
</script>

<div class="container grid">
	<div class="what">
		<h3>What We Do?</h3>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. A deserunt neque tempore recusandae
			animi soluta quasi? Asperiores rem dolore eaque vel, porro, soluta unde debitis aliquam
			laboriosam. Repellat explicabo, maiores!
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis optio neque consectetur
			consequatur magni in nisi, natus beatae quidem quam odit commodi ducimus totam eum, alias,
			adipisci nesciunt voluptate. Voluptatum.
		</p>

		<Button class="secondary" id="a-button" size="medium">Call To Action >></Button>
	</div>
	<div class="contact">
	<Contact />
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: var(--size-7);
		margin-inline:var(--size-9);
		padding-top: var(--size-9);
		padding: var(--size-3) 0;
		/* background-color: var(--surface-4); */
		/* max-inline-size: 1440px; */
		margin: 0 auto;
	}
	.what {
		grid-column-start: 2;
		grid-column-end: 11;
	}

	.contact {
		margin-left: var(--size-5);
		/* grid-column-start: 3; */
		grid-column: span 4;
	}
	
	h3 {
		padding-bottom: var(--size-2);
		margin-bottom: var(--size-2);
		font-size: var(--size-7);
		font-weight: 500;
		border-bottom: 1px solid var(--text-2);
	}

	@media (min-width: 576px) {
	.what  {
		grid-column-start: 0;
		grid-column-end: 10;
	}
	.contact {
		grid-column: span 3;
	}
}
</style>
