<script>
import GithubButton from 'vue-github-button';
import packageJson from '../../../image-lint/package.json';

export default {
	'components': {
		GithubButton,
	},
	data() {
		return {
			'name': packageJson.name,
			'version': packageJson.version,
			'description': packageJson.description,
		};
	},
};
</script>

<template>
	<div>
		<header class="lint-header">
			<h1 class="lint-title">
				{{ name }}
			</h1>
			<span class="lint-version">v{{ version }}</span>

			<nav class="lint-nav">
				<router-link to="/">
					Home
				</router-link>
				<router-link to="/getting-started">
					Getting Started
				</router-link>
				<router-link to="/docs">
					Docs
				</router-link>
			</nav>

			<github-button
				class="github-button"
				href="https://github.com/aaronasachimp/image-lint"
				data-size="large"
				data-show-count="true"
				aria-label="Star aaronasachimp/image-lint on GitHub"
			>
				Star
			</github-button>
		</header>
		<router-view />
	</div>
</template>

<style>
@import "../css/variables.css";

.lint-header {
	background: var(--color-status-good);
	color: var(--color-status-good-contrast);
	padding: 20px;
}

.lint-header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-rows: auto 1fr;
	grid-template-areas:
		"title   nav button"
		"version nav button";
	align-items: baseline;
}

.lint-title {
	display: inline-block;
	font-weight: 300;
	font-size: 36px;
	margin: 0;
	grid-area: title;
}

.lint-nav {
	display: inline-block;
	font-weight: 300;
	font-size: 18px;
	margin: 0 0 0 15px;
	grid-area: nav;
}

.lint-nav a {
	color: inherit;
	text-decoration: none;
	padding: 0.6em 0.8rem;
	border-radius: 0.2em;
	transition: background 0.4s;
}

.lint-nav a:hover {
	background: var(--color-bg-contrast-layer);
}

.lint-nav a:visited {
	color: inherit;
}

.lint-version {
	font-size: 0.8em;
	grid-area: version;
	justify-self: end;
}

.github-button {
	grid-area: button;
	align-self: center;
}
</style>
