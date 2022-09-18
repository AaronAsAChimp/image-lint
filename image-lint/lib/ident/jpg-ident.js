/* @flow */

import {ImageIdentifier} from '../ident.js';
import {MagicNumberIdentifier} from './magic-number-ident.js';
import {JPGInfoProvider} from '../image/jpg-info.js';

/**
 * An image identifier that identifies JPEG images.
 */
class JPGIdentifier extends MagicNumberIdentifier {
	/**
	 * @inheritDoc
	 */
	get_magic() {
		return Buffer.from('ffd8ff', 'hex');
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.jpg',
			'.jpeg',
			'.jpe',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/jpeg',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_info_provider() {
		return JPGInfoProvider;
	}
}

ImageIdentifier.register(JPGIdentifier);
