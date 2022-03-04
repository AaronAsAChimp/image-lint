/* @flow */

const ImageIdentifier = require('../ident.js');
const XMLIdentifier = require('./xml-ident.js');

/**
 * An image identifier that identifies HTML files.
 */
class HTMLIdentifier extends XMLIdentifier {
	/**
	 * @inheritDoc
	 */
	get_root_element() {
		return 'html';
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.html',
			'.htm',
			'.xhtml',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'text/html',
			'application/xhtml+xml',
		];
	}
}

ImageIdentifier.register(HTMLIdentifier);
