import {Transformer} from '@parcel/plugin';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeToc from 'rehype-toc';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from 'rehype-shiki';
import rehypeStringify from 'rehype-stringify';

/**
 * A transformer to convert markdown into vue components.
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
				.use(remarkGfm)
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
