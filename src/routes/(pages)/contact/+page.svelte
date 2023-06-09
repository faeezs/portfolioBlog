<script>
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	export let form;
	$: console.log(form);
</script>

<form method="POST">
	<h2>Contact Us</h2>
	{#if form?.success}
		<p class="success">{form.message || ''}</p>
	{:else}
		<!-- Grid -->
		<div class="form-group">
			<!-- Markup example 1: input is inside label -->
			<label for="name"> Name</label>
			<input type="text" id="name" name="name" placeholder="Name" required />
		</div>

		<!-- Markup example 2: input is after label -->
		<div class="form-group">
			<label for="email">Email address</label>
			<input type="email" id="email" name="email" placeholder="Email address" required />
		</div>

		<div class="form-group">
			<label for="message">Message</label>
			<textarea
				class="form-control"
				id="message"
				name="message"
				placeholder="Please enter your message here..."
				rows="5"
			/>
		</div>
		<small>We'll never share your email with anyone else.</small>

		<!-- Button -->
		<!-- <button type="submit" class="surface-4">Submit</button> -->
		<Button class="secondary" id="a-button" size="medium">Submit >></Button>
	{/if}
</form>

<Seo title="Contact | Business Frontpage" description="This is the contact page" type="WebSite" />

<style>
	form {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		/* justify-items: center; */
		/* align-items: center; */
		/* width: calc(100% - 2em); */
		/* width: min(60vw,calc(100% - 2em)); */
		/* max-inline-size: var(--size-content-3); */
		padding: 2em;
	}

	.form-group {
		display: grid;
		margin-bottom: 1.5em;
	}

	input,
	textarea {
		background: var(--surface-2);
		color: var(--text-1);
	}

	form {
            width: var(--size-fluid-10)
        }


    /* @media (min-width: 576px)  {
        form {
            width: var(--size-fluid-10)
        }
    } */
</style>
