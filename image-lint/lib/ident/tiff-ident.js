/* @flow */

import {MagicNumberIdentifier} from './magic-number-ident.js';

/**
 * An image identifier that identifies TIFF images.
 */
export default class TIFFIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from([0x49, 0x49, 0x2A, 0x00]);
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.tif',
			'.tiff',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/tiff',
			'image/tiff-fx',
		];
	}
}
