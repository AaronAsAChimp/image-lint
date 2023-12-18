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
export default async function loader(md) {
	const html = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeShiki)
		.use(rehypeSlug)
		.use(rehypeToc)
		.use(rehypeStringify)
		.process(md);

	// console.log('export default `' + html + '`');

	return html.toString();
}
