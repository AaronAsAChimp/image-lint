import {XMLIdentifier} from './xml-ident.js';

/**
 * An image identifier that identifies SVG images.
 */
export default class SVGIdentifier extends XMLIdentifier {
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
