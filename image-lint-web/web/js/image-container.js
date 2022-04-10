import ImageLint from 'image-lint';

const finder = new ImageLint.BufferArrayFinder(ImageLint.ImageIdentifier.get_all_extensions(), ImageLint.ImageIdentifier.get_all_mimes());

export class ImageContainer {
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
