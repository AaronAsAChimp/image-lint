<script>
import GithubButton from 'vue-github-button';
import {defaults} from 'image-lint';

import packageJson from '../../../image-lint/package.json';

import 'vue-multiselect/dist/vue-multiselect.css';

export default {
	'components': {
		GithubButton,
	},
	data() {
		const options = Object.assign({}, defaults);

		options.color_space = options.color_space.split(',');

		return {
			'name': packageJson.name,
			'version': packageJson.version,
			'description': packageJson.description,
			'support': {},
			'available': {
				'color_space': ['G', 'RGB', 'CMYK', 'YCbCr', 'YCCK', 'LAB', 'HSV'],
			},
			'option': options,
			'files': [],
		};
	},
	'methods': {
		'clear': function() {
			this.files.length = 0;
		},
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
			<h2 class="lint-subtitle">
				{{ description }}
			</h2>

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
		<form class="image-lint-app">
			<div class="pane pane-options">
				<h3 class="lint-options-title">
					Options
				</h3>

				<label class="lint-option lint-option-check">
					<input v-model="option.mismatch" type="checkbox">
					Find mismatches between file type and file extension.
				</label>

				<label class="lint-option lint-option-check">
					<input v-model="option.duplicate" type="checkbox">
					Find files that have been copied.
				</label>

				<label class="lint-option lint-option-number">
					Set the maximum bytes per pixel before giving a warning.
					<input
						v-model="option.bytes_per_pixel"
						type="number"
						step="0.1"
						min="0"
					>
				</label>

				<label class="lint-option lint-option-number">
					Set the minimum byte savings before giving a warning.
					<input v-model="option.byte_savings" type="number" min="0">
				</label>

				<label class="lint-option lint-option-array">
					Set the allowed color spaces.

					<vue-multiselect v-model="option.color_space" :multiple="true" :options="available.color_space" />
				</label>
			</div>
			<div class="pane pane-dropzone">
				<iml-dropzone v-model="files" :class="{ empty: files.length == 0 }">
					<div v-if="files.length">
						<button type="button" @click="clear">
							Clear Results
						</button>
						<iml-image-collection :options="option" :files="files" />
					</div>
				</iml-dropzone>
			</div>
		</form>
	</div>
</template>

<style>

@import "../css/variables.css";

.image-lint-app {
	display: grid;
	grid-template-columns: 16em 1fr;
}

.pane {
	padding: 20px;
}

.pane-options {
	background: var(--color-layer-bg);
	max-width: 450px;
}

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
		"title   desc button"
		"version desc button";
	align-items: baseline;
}

.lint-title {
	display: inline-block;
	font-weight: 300;
	font-size: 36px;
	margin: 0;
	grid-area: title;
}

.lint-subtitle {
	display: inline-block;
	font-weight: 300;
	font-size: 18px;
	margin: 0 0 0 15px;
	grid-area: desc;
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

.lint-options-title {
	margin-top: 0;
}

.lint-option {
	display: block;
	margin: 1.1em 0;
	line-height: 1.3;
}

.lint-option-check {
	display:  grid;
	grid-template-columns: 1.4em auto;
	gap: 0.4em;
}

.lint-option-check [type=checkbox] {
	align-self: start;
	height: 1.4em;
}

.lint-option-number,
.lint-option-array {
	display: flex;
	flex-direction: column;
}

.lint-option-number [type=number],
.lint-option-array .multiselect {
	margin-top: 0.4em;
	font-size:  1em;
	padding:  0.2em;
}

</style>
