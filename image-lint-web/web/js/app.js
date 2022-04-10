import {reactive} from 'vue';
import GithubButton from 'vue-github-button';
import ImageLint from 'image-lint';

import 'vue-multiselect/dist/vue-multiselect.css';

import '../css/app.css';

export default {
	components: {
		GithubButton
	},
	data() {
		const options = Object.assign({}, ImageLint.defaults);

		options.color_space = options.color_space.split(',');

		return {
			'support': {},
			'available': {
				'color_space': ['G', 'RGB', 'CMYK', 'YCbCr', 'YCCK', 'LAB', 'HSV']
			},
			'option':  options,
			'files': []
		};
	},
	'template': `
<div>
	<header class="lint-header">
		<h1 class="lint-title">image-lint</h1>
		<h2 class="lint-subtitle">Find broken or poorly compressed images.</h2>

		<github-button href="https://github.com/aaronasachimp/image-lint" data-size="large" data-show-count="true" aria-label="Star aaronasachimp/image-lint on GitHub">Star</github-button>
	</header>
	<form class="image-lint-app">
		<div class="pane pane-options">
			<h3 class="lint-options-title">Options</h3>

			<label class="lint-option lint-option-check">
				<input type="checkbox" v-model="option.mismatch" />
				Find mismatches between file type and file extension.
			</label>

			<label class="lint-option lint-option-check">
				<input type="checkbox" v-model="option.duplicate" />
				Find files that have been copied.
			</label>
			
			<label class="lint-option lint-option-number">
				Set the maximum bytes per pixel before giving a warning.
				<input type="number" v-model="option.bytes_per_pixel" step="0.1" min="0" />
			</label>

			<label class="lint-option lint-option-number">
				Set the minimum byte savings before giving a warning.
				<input type="number" v-model="option.byte_savings" min="0" />
			</label>

			<label class="lint-option lint-option-array">
				Set the allowed color spaces.

				<vue-multiselect v-model="option.color_space" :multiple="true" :options="available.color_space" />
			</label>
		</div>
		<div class="pane pane-dropzone">
			<dropzone v-model="files" :class="{ empty: files.length == 0 }">
				<div v-if="files.length">
					<button type="button" v-on:click="clear">Clear Results</button>
					<image-collection :options="option" :files="files"></image-collection>
				</div>
			</dropzone>
		</div>
	</form>
</div>
`,
	'methods': {
		'clear': function () {
			this.files.length = 0;
		},
	}
}