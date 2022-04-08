import ImageLint from 'image-lint';
import {createApp, reactive} from 'vue';
import Multiselect from 'vue-multiselect';
import GithubButton from 'vue-github-button';

import 'vue-multiselect/dist/vue-multiselect.css';
import '../css/site.css';


const body = document.body;
const rootEl = document.createElement('div');
const appEl = document.createElement('image-lint-app');

rootEl.appendChild(appEl);
body.appendChild(rootEl);

const app = createApp({});


app.component('vue-multiselect', Multiselect);
app.component('dropzone', {
	'props': {
		'modelValue': Array
	},
	'template': '<div class="drop-target" ref="dropzone" @drop="drop" @dragover="dragover" @dragenter="dragenter" @dragleave="dragleave"><slot>Drop files here</slot></div>',
	'methods': {
		'files': function* (dt) {
			let files = [];

			if (dt.items) {
				for (let i of dt.items) {
					yield i.getAsFile();
				}
			} else {
				yield* dt.files;
			}
		},
		'drop': function (e) {
			e.preventDefault();
			this.$refs.dropzone.classList.remove('active');

			const files = Array.from(this.files(e.dataTransfer));

			this.$emit('update:modelValue', files);
		},
		'dragenter': function () {
			this.$refs.dropzone.classList.add('active');
		},
		'dragleave': function () {
			this.$refs.dropzone.classList.remove('active');
		},
		'dragover': function (e) {
			e.preventDefault();
		}
	}
});

const finder = new ImageLint.BufferArrayFinder(ImageLint.ImageIdentifier.get_all_extensions(), ImageLint.ImageIdentifier.get_all_mimes());

class ImageContainer {
	constructor(file) {
		this.file = file;
		this.xhr = null
		this.results = null;
		this.error = null;
	}

	async check(options) {
		let files = [this.file],
			results = null,
			linter = new ImageLint.Linter(finder);

		options.mismatch = options.mismatch === 'true';
		options.duplicate = options.duplicate === 'true';

		try {
			results = await (new Promise((resolve, reject) => {
				let result_list = [];

				linter.lint(files, options)
					.on('file.completed', (logger) => {
						result_list.push(logger);
					})
					.on('linter.completed', () => {
						resolve(result_list);
					});
			}));
		} catch (e) {
			this.error = e;
			return;
		}

		this.results = results[0];

		this.results.log = this._reformat_log(this.results.log);
	}

	has_finished() {
		return this.results !== null || this.error !== null;
	}

	has_error() {
		return this.error !== null;
	}

	has_results() {
		return this.results !== null;
	}

	_form(options) {
		let form = new FormData()

		form.append('file', this.file);

		for (let name in options) {
			let value = options[name];

			if (Array.isArray(value)) {
				value = value.join(',');
			}
			
			form.append(name, value);
		}

		return form;
	}

	_reformat_log(log) {
		let log_parts = log.trim().split('\n');

		return log_parts.map((line) => {
			return line.trim();
		}).join('\n');
	}
}

app.component('image-lint-app', {
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
})

app.mount(rootEl);
