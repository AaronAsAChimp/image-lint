<script>
import {defaults} from 'image-lint';

import 'vue-multiselect/dist/vue-multiselect.css';

export default {
	'components': {
	},
	data() {
		const options = Object.assign({}, defaults);

		options.color_space = options.color_space.split(',');

		return {
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
