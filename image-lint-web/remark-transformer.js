import {Transformer} from '@parcel/plugin';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeToc from 'rehype-toc';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from 'rehype-shiki';
import rehypeStringify from 'rehype-stringify';

/**
 * Load markdown and convert it to HTML
 *
 * @param {String} md The markdown content
 * @return {Promise<String>} The module content
 */
export default new Transformer({
	async transform({config, options, asset}) {
		// console.log(options);
		// const classAttr = options.className ? ` class="${ options.className}"` : '';
		// const styleSheet = options.styleSheet ? `@import "${ options.styleSheet }";` : '';

		const md = await asset.getCode();
		const html = await unified()
			.use(remarkParse)
			.use(remarkRehype)
			.use(rehypeShiki)
			.use(rehypeSlug)
			.use(rehypeToc)
			.use(rehypeStringify)
			.process(md);

		// console.log(`md: ${ md }`);
		// console.log(`html: ${ html }`);

		asset.type = 'vue';
		asset.setCode(`
<script></script>

<template>
	<div class="docs-page">
	${ html.toString() }
	</div>
</template>

<style>
@import "../css/docs.css";
</style>
`);

		// console.log('export default `' + html + '`');

		return [asset];
	},
});
