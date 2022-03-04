/* @flow */

const ImageIdentifier = require('../ident.js');
const MagicNumberIdentifier = require('./magic-number-ident.js');
const GIFInfoProvider = require('../image/gif-info.js');

/**
 * An image identifier that identifies GIF images.
 */
class GIFIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('GIF');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.gif',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/gif',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return GIFInfoProvider;
	}
}

ImageIdentifier.register(GIFIdentifier);
