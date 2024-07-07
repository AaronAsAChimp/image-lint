import fs from 'fs';

export default (options = {}) => (tree) => {
	// Accept options and set defaults
	// options.foo = options.foo || {};
	//

	const package_json = JSON.parse(fs.readFileSync('../image-lint/package.json'));

	/**
	 * Process a node replacing slots with content from package.json
	 *
	 * @param  {import('posthtml').Node} node The node to process
	 * @returns {import('posthtml').Node} The processed node
	 */
	function process_node(node) {
		if (node.tag === 'package-json-metadata') {
			return {
				tag: false,
				content: `
<title>${ package_json.name } - ${ package_json.version }</title>
<meta name="description" content="${ package_json.description }">
`,
			};
		}
		// console.error(node);

		return node;
	}

	return tree.walk(process_node);
};
