/* @flow */

const ImageIdentifier = require('../ident.js');
const MagicNumberIdentifier = require('./magic-number-ident.js');
const TIFF_TAG = 0x49492A00;

/**
 * An image identifier that identifies TIFF images.
 */
class TIFFIdentifier extends MagicNumberIdentifier {
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

ImageIdentifier.register(TIFFIdentifier);
