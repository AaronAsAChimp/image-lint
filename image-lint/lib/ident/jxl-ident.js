/* @flow */

const ImageIdentifier = require('../ident.js');
const MagicNumberIdentifier = require('./magic-number-ident.js');
const JXLInfoProvider = require('../image/jxl-info.js');

/**
 * An image identifier that identifies GIF images.
 */
class JXLIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('ff0a', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.jxl',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/jxl',
		];
	}
	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return JXLInfoProvider;
	}
}

ImageIdentifier.register(JXLIdentifier);
