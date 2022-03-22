const ImageLint = require('../../../image-lint/lib/api.js');

const Multiselect = VueMultiselect.default;

Vue.component('vue-multiselect', Multiselect);
Vue.component('dropzone', {
	'props': {
		'value': Array
	},
	'template': '<div class="drop-target" v-bind:class="{ empty: !has_contents() }" ref="dropzone" v-on:drop="drop" v-on:dragover="dragover" v-on:dragenter="dragenter" v-on:dragleave="dragleave"><slot>Drop files here</slot></div>',
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
		has_contents() {
			return !!this.$slots.default;
		},
		'drop': function (e) {
			e.preventDefault();
			this.$refs.dropzone.classList.remove('active');

			for (let file of this.files(e.dataTransfer)) {
				this.value.push(file);
			}

			this.$emit('input', this.value);
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

Vue.component('progress-bar', {
	'props': {
		'value': Number
	},
	'template': '<div class="progress-container"><div class="progress-bar" v-bind:style="{ width: this.progress() }"></div></div>',
	'methods': {
		progress: function () {
			return (this.value * 100) + '%';
		}
	}
})

const finder = new ImageLint.BufferArrayFinder(ImageLint.ImageIdentifier.get_all_extensions(), ImageLint.ImageIdentifier.get_all_mimes());

class ImageContainer {
	constructor(file) {
		this.file = file;
		this.xhr = null
		this.progress = 0;
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

	_progress(e) {
		this.progress = e.loaded / e.total;
	}
}

var app = new Vue({
	'el': '.image-lint-app',
	'data': {
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
	},
	'methods': {
		'clear_finished': function () {
			this.files = this.files.filter((image) => {
				return !image.has_finished();
			});
		},
		'add_files': function (files) {
			while (files.length) {
				let file = files.shift();

				// If the file doesn't have a type its probably a folder.
				if (file.type) {
					const container = new ImageContainer(file);

					this.files.push(container);

					container.check(this.option);
				}
			}
		}
	}
});
