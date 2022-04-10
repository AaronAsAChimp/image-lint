import {reactive} from 'vue';
import Multiselect from 'vue-multiselect';
import GithubButton from 'vue-github-button';
import 'vue-multiselect/dist/vue-multiselect.css';

import {ImageContainer} from './image-container.js';
import '../css/app.css';

export default {
	components: {
		GithubButton
	},
	data() {
		return {
			'support': {},
			'available': {
				'color_space': ['G', 'RGB', 'CMYK', 'YCbCr', 'YCCK', 'LAB', 'HSV']
			},
			'option': {
				'mismatch': true,
				'duplicate': true,
				'bytes_per_pixel': 3,
				'byte_savings': 500,
				'color_space': ['G', 'RGB']
			},
			'new_files': [],
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
			<dropzone v-model="new_files" :class="{ empty: files.length == 0 }">
				<div v-if="files.length">
					<button type="button" v-on:click="clear_finished">Clear Results</button>
					<ul class="lint-results">
						<li v-for="image in files" class="lint-result" v-bind:class="{ 'has-error': image.has_error(), 'has-results': image.has_results() }">
							<details open>
								<summary class="lint-result-summary" v-bind:class="{ 'lint-error': image.results && image.results.count.error, 'lint-warn': image.results && image.results.count.warn }">
									{{ image.file.name }}
									<span v-if="image.has_results()"> - 
										<span v-if="image.results.count.info">Info: {{ image.results.count.info }}<span v-if="image.results.count.warn || image.results.count.error">,</span></span>
										<span v-if="image.results.count.warn">Warnings: {{ image.results.count.warn }}<span v-if="image.results.count.error">,</span></span>
										<span v-if="image.results.count.error">Errors: {{ image.results.count.error }}</span>
									</span>
								</summary>
								<output class="lint-result-output" v-if="image.has_results()" v-html="image.results.log"></output>
							</details>
						</li>
					</ul>
				</div>
			</dropzone>
		</div>
	</form>
</div>
`,
	'watch': {
		new_files: {
			deep: true,
			handler(files) {
				while (files.length) {
					let file = files.shift();

					// If the file doesn't have a type its probably a folder.
					if (file.type) {
						const container = reactive(new ImageContainer(file));

						this.files.push(container);

						container.check(this.option);
					}
				}
			}
		}
	},
	'methods': {
		'clear_finished': function () {
			this.files = this.files.filter((image) => {
				return !image.has_finished();
			});
		},
	}
}