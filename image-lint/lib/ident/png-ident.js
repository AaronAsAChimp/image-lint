/* @flow */

const ImageIdentifier = require('../ident.js');
const MagicNumberIdentifier = require('./magic-number-ident.js');
const PNGInfoProvider = require('../image/png-info.js');

/**
 * An image identifier that identifies PNG images.
 */
class PNGIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('89504e470d0a1a0a', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.png',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/png',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return PNGInfoProvider;
	}
}

ImageIdentifier.register(PNGIdentifier);
