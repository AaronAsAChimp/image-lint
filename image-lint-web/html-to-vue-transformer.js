import {Transformer} from '@parcel/plugin';

/**
 * Convert plain HTML to a Vue component
 *
 * @param {String} html The html content
 * @return {Promise<String>} The module content
 */
export default new Transformer({
	async transform({asset}) {
		const html = asset.getCode();

		asset.type = 'vue';
		asset.setCode(`
<script></script>

<template>
	<div>
	${ html }
	</div>
</template>

<style>
</style>
`);

		return [asset];
	},
});
