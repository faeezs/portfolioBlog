<script lang="ts">
	import Footer from '$lib/components/ui/Footer.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';

	import 'open-props/style';
	import 'open-props/normalize';
	import 'open-props/buttons';
	// import 'open-props/media';

	import '../app.css';
</script>

<Navbar />
<div class="app">
	<slot />
</div>
<Footer />

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
