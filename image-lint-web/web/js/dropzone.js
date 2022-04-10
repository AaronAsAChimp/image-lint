import '../css/dropzone.css';

export default {
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
};