
/**
 * Convert plain HTML to a Vue component
 *
 * @param {String} html The html content
 * @return {Promise<String>} The module content
 */
export default function loader(html) {
	// eslint-disable-next-line no-invalid-this
	const options = this.getOptions();
	const classAttr = options.className ? ` class="${ options.className}"` : '';
	const styleSheet = options.styleSheet ? `@import "${ options.styleSheet }";` : '';

	return `
<script></script>

<template>
	<div${ classAttr }>
	${ html }
	</div>
</template>

<style>
${styleSheet}
</style>
`;
}
