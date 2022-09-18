/* @flow */

import {ImageIdentifier} from '../ident.js';
const FIRST_BYTE = 0;
const ICO_MAGIC = 1;
const CUR_MAGIC = 2;
const MINIMUM_SIZE = 4; // 4 == size of FIRST_BYTE + size of *_MAGIC

/**
 * An image identifier that identifies ICO images.
 */
class IcoIdentifier extends ImageIdentifier {
	/**
	 * @inheritDoc
	 */
	can_validate(buffer) {
		return buffer.length > MINIMUM_SIZE;
	}

	/**
	 * @inheritDoc
	 */
	is_of_file_type(buffer) {
		// ico: 0000 0001
		// cur: 0000 0002
		const first_magic = buffer.readUInt16LE(0);
		const type_magic = buffer.readUInt16LE(2);

		return first_magic === FIRST_BYTE &&
			(type_magic === ICO_MAGIC || type_magic === CUR_MAGIC);
	}

	/**
	 * @inheritDoc
	 */
	get_extensions() {
		return [
			'.ico',
			'.cur',
		];
	}

	/**
	 * @inheritDoc
	 */
	get_mimes() {
		return [
			'image/x-icon',
		];
	}
}

ImageIdentifier.register(IcoIdentifier);
