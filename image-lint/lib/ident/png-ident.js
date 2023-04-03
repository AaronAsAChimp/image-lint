/* @flow */

import {ImageIdentifier} from '../ident.js';
import {MagicNumberIdentifier} from './magic-number-ident.js';
import {PNGInfoProvider} from '../image/png-info.js';
import {PNGImageLinter} from '../linter/png-linter.js';

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

	/**
	 * @inheritDoc
	 */
	get_linter(buffer) {
		return new PNGImageLinter(buffer);
	}
}

ImageIdentifier.register(PNGIdentifier);
