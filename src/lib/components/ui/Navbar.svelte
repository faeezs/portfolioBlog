<script lang="ts">
	import * as config from '$lib/config';
	import Toggle from '$lib/components/ui/ThemeToggle.svelte';
	import { page } from '$app/stores';

	let showMenu = false;

	function toggleNavbar() {
		showMenu = !showMenu;
	}

	const navs = [
		{
			title: 'About',
			href: '/about'
		},
		{
			title: 'Services',
			href: '/services'
		},
		{
			title: 'Contact',
			href: '/contact'
		},
		{
			title: 'Blog',
			href: '/blog'
		}
	];

	$: url = $page.url.href;
	$: routeId = $page.url.pathname;
</script>

<nav>
	<!-- Title -->
	<div class="navigate">
		<a href="/" class="title" class:active={routeId === '/'}>
			<b>{config.title}</b>
		</a>

		<!-- Navigation -->
		<ul class="links {showMenu ? '' : 'hidden'}" on:click="{()=> showMenu = false}" on:keypress="{()=> showMenu = false}">
			{#each navs as { title, href }}
				<li>
					<a {href} class:active={url.includes(href)} {title}>{title}</a>
				</li>
			{/each}
			<li>
				<a href="/rss.xml" target="_blank">RSS</a>
			</li>
		</ul>

		<!-- Theme -->
	</div>
	<div class="toggle"><Toggle /></div>
	<div class="menu-icon" on:click="{()=> showMenu = !showMenu}" on:keypress="{()=> showMenu = !showMenu}">
		<div class="bar" />
		<div class="bar" />
		<div class="bar" />
	</div>
</nav>

<style>
	nav {
		position: sticky;
		padding-block: var(--size-3);
		padding-inline: var(--size-7);
		top: 0;
		justify-content: space-between;
		display: flex;
		background-color: var(--surface-2);
		color: var(--text-1);
		box-shadow: var(--shadow-2);
	}

	.title {
		display: flex;
		align-items: center;
	}

	.navigate {
		display: flex;
		gap: var(--size-7);
		align-items: normal;
		flex-grow: 1;
		justify-content: space-between;
		flex-direction: column;
	}

	.links {
		margin-block: var(--size-1);
		gap: var(--size-7);
		flex-grow: 0;
	}

	.hidden {
		display: none;
	}

	a {
		color: var(--text-1);
		text-decoration: none;
	}

	.menu-icon {
		/* display: none; */
		margin-inline-start: var(--size-3);
	}

	.bar {
		width: 20px;
		height: 3px;
		background-color: var(--text-2);
		margin: 4px auto;
	}

	@media (min-width: 768px) {
		nav {
			position: sticky;
			display: flex;
			justify-content: space-between;
			top: 0;
			z-index: var(--layer-1);
		}

		.navigate {
			flex-direction: row;
			padding-right: var(--size-3);
		}

		.links {
			display: flex;
			gap: var(--size-7);
			margin-block: 0;
		}
		.menu-icon{
			display: none;
		}
	}
	.active {
		color: var(--accent);
	}
</style>
