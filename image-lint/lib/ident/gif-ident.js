/* @flow */

import {MagicNumberIdentifier} from './magic-number-ident.js';
import {GIFInfoProvider} from '../image/gif-info.js';

/**
 * An image identifier that identifies GIF images.
 */
export default class GIFIdentifier extends MagicNumberIdentifier {
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
