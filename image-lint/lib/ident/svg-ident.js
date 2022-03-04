/* @flow */

const ImageIdentifier = require('../ident.js');
const XMLIdentifier = require('./xml-ident.js');

/**
 * An image identifier that identifies SVG images.
 */
class SVGIdentifier extends XMLIdentifier {
	/**
	 * @inheritDoc
	 */
	get_root_element() {
		return 'svg';
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.svg',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/svg+xml',
		];
	}
}

ImageIdentifier.register(SVGIdentifier);
