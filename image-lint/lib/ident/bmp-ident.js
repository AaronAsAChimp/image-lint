/* @flow */

import {MagicNumberIdentifier} from './magic-number-ident.js';

/**
 * An image identifier that identifies BMP images.
 *
 * https://en.wikipedia.org/wiki/BMP_file_format
 */
export default class BMPIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('424D', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.bmp',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/bmp',
			'image/x-bmp',
		];
	}
}
