<script>
import {Linter, BufferArrayFinder, ImageIdentifierRegistry} from 'image-lint';

const finder = new BufferArrayFinder(ImageIdentifierRegistry.get_all_extensions(), ImageIdentifierRegistry.get_all_mimes());

export default {
	'props': {
		'options': {
			'type': Object,
			'required': true,
		},
		'files': {
			'type': Array,
			'required': true,
		},
	},
	data() {
		return {
			linter: null,
			error: null,
			results: null,
		};
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
		},
	},
	'watch': {
		files: {
			async handler(files, files_old) {
				const options = this.options;
				const linter = new Linter(finder);
				let results = null;

				try {
					results = await (new Promise((resolve, reject) => {
						const result_list = [];

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
			immediate: true,
		},
	},
	'methods': {
		reformat_log(log) {
			const log_parts = log.trim().split('\n');

			return log_parts.map((line) => {
				return line.trim();
			}).join('\n');
		},
	},
};
</script>

<template>
	<ul class="lint-results">
		<li
			v-for="result in results"
			:key="result.filename"
			class="lint-result"
			:class="{ 'has-error': has_error, 'has-results': has_results }"
		>
			<details open>
				<summary
					class="lint-result-summary"
					:class="{ 'lint-error': result && result.count.error, 'lint-warn': result && result.count.warn }"
				>
					{{ result.filename }}
					<span v-if="has_results"> -
						<span v-if="result.count.info">
							Info: {{ result.count.info }}<span v-if="result.count.warn || result.count.error">, </span>
						</span>
						<span v-if="result.count.warn">
							Warnings: {{ result.count.warn }}<span v-if="result.count.error">, </span>
						</span>
						<span v-if="result.count.error">Errors: {{ result.count.error }}</span>
					</span>
				</summary>
				<!-- eslint-disable vue/no-v-html -->
				<output
					v-if="has_results"
					class="lint-result-output"
					v-html="reformat_log(result.log)"
				/>
				<!-- eslint-enable -->
			</details>
		</li>
	</ul>
</template>

<style>
@import "../css/variables.css";

.lint-results {
	list-style: none;
	padding: 0;
}

.lint-result {
	margin: 15px 0px;
	background: var(--color-layer-bg);
	padding-bottom: 1px; /* Prevent margin-collapse */
	border-radius: 8px;
	overflow: hidden;
}

.lint-result .lint-result-summary {
	background: var(--color-status-unknown);
	padding: 10px 10px 10px 18px;
}

.lint-result.has-results .lint-result-summary {
	background: var(--color-status-good);
	padding: 10px 10px 10px 18px;
}

.lint-result .lint-result-summary.lint-warn {
	background: var(--color-status-warn);
}

.lint-result .lint-result-summary.lint-error {
	background: var(--color-status-failure);
}

.lint-result.has-error .lint-result-summary {
	background: var(--color-status-error);
}

.lint-result.has-error .upload-progress,
.lint-result.has-results .upload-progress {
	display: none;
}

.lint-result-output {
	font-family: monospace;
	white-space: pre-wrap;
	margin: 10px 10px 10px 18px;
	display: block;
}
</style>
