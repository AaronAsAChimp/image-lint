/* @flow */
'use strict';

const ImageIdentifier = require('../ident.js');
const RIFF_TAG = 0x52494646;
const MINIMUM_SIZE = 12; // 12 == size of RIFF_TAG + skipped bytes + size of this.type_tag

/**
 * An image identifier that identifies RIFF based files.
 */
class RIFFInfoProvider extends ImageIdentifier {
	/**
	 * Get the type tag of this type of file.
	 */
	get_type_tag()/*: number */ {
		throw new Error('Not Implemented!');
	}

	/**
	 * @inheritDoc
	 */
	can_validate(buffer/*: Buffer */)/*: boolean */ {
		return buffer.length > MINIMUM_SIZE;
	}

	/**
	 * @inheritDoc
	 */
	is_of_file_type(buffer/*: Buffer */)/*: boolean */ {
		const riff_magic = buffer.readUInt32BE(0);
		const type_magic = buffer.readUInt32BE(8);

		return riff_magic === RIFF_TAG && type_magic === this.get_type_tag();
	}
}

module.exports = RIFFInfoProvider;
