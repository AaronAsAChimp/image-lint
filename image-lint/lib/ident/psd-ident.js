/* @flow */

import {ImageIdentifier} from '../ident.js';
import {MagicNumberIdentifier} from './magic-number-ident.js';

/**
 * An image identifier that identifies PSD images.
 */
class PSDIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('38425053', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.psd',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/photoshop',
			'image/x-photoshop',
			'image/psd',
		];
	}
}

ImageIdentifier.register(PSDIdentifier);
