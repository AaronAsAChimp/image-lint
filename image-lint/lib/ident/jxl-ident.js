/* @flow */

import {MagicNumberIdentifier} from './magic-number-ident.js';
import {JXLInfoProvider} from '../image/jxl-info.js';

/**
 * An image identifier that identifies GIF images.
 */
export default class JXLIdentifier extends MagicNumberIdentifier {
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
