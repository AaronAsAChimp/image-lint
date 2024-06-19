<script>
export default {
	'props': {
		'modelValue': {
			type: Array,
			required: true,
		},
	},
	'emits': ['update:modelValue'],
	'methods': {
		'files': function* (dt) {
			if (dt.items) {
				for (const i of dt.items) {
					if (i.kind === 'file') {
						yield i.getAsFile();
					}
				}
			} else {
				yield* dt.files;
			}
		},
		'drop': function(e) {
			e.preventDefault();
			this.$refs.dropzone.classList.remove('active');

			const files = Array.from(this.files(e.dataTransfer));

			this.$emit('update:modelValue', files);
		},
		'dragenter': function() {
			this.$refs.dropzone.classList.add('active');
		},
		'dragleave': function() {
			this.$refs.dropzone.classList.remove('active');
		},
		'dragover': function(e) {
			e.preventDefault();
		},
	},
};
</script>

<template>
	<div
		ref="dropzone"
		class="drop-target"
		@drop="drop"
		@dragover="dragover"
		@dragenter="dragenter"
		@dragleave="dragleave"
	>
		<slot>Drop files here</slot>
	</div>
</template>

<style>
@import "../css/variables.css";

.drop-target {
	height: 100%;
	display: flex;
	justify-content: center;
}

.drop-target.empty {
	align-items: center;
}

.drop-target.active {
	border: 2px dashed var(--color-status-good);
}
</style>
