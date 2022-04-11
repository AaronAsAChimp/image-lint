import '../css/image-collection.css';
import ImageLint from 'image-lint';

const finder = new ImageLint.BufferArrayFinder(ImageLint.ImageIdentifier.get_all_extensions(), ImageLint.ImageIdentifier.get_all_mimes());

export default {
	'props': ['options', 'files'],
	data() {
		return {
			linter: null,
			error: null,
			results: null
		};
	},
	'template': `
<ul class="lint-results">
	<li v-for="result in results" class="lint-result" v-bind:class="{ 'has-error': has_error, 'has-results': has_results }">
		<details open>
			<summary class="lint-result-summary" v-bind:class="{ 'lint-error': result && result.count.error, 'lint-warn': result && result.count.warn }">
				{{ result.filename }}
				<span v-if="has_results"> - 
					<span v-if="result.count.info">Info: {{ result.count.info }}<span v-if="result.count.warn || result.count.error">, </span></span>
					<span v-if="result.count.warn">Warnings: {{ result.count.warn }}<span v-if="result.count.error">, </span></span>
					<span v-if="result.count.error">Errors: {{ result.count.error }}</span>
				</span>
			</summary>
			<output class="lint-result-output" v-if="has_results" v-html="reformat_log(result.log)"></output>
		</details>
	</li>
</ul>`,
	'watch': {
		files: {
			async handler(files, files_old) {
				let options = this.options,
					results = null,
					linter = new ImageLint.Linter(finder);

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

				this.results = results;
			},
			immediate: true
		}
	},
	'computed': {
		has_finished() {
			return this.results !== null || this.error !== null;
		},
		has_error() {
			return this.error !== null;
		},
		has_results() {
			return this.results !== null;
		}
	},
	'methods': {
		reformat_log(log) {
			let log_parts = log.trim().split('\n');

			return log_parts.map((line) => {
				return line.trim();
			}).join('\n');
		}
	}
};