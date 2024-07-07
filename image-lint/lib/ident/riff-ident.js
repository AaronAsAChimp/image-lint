import {ImageIdentifier} from '../ident.js';
const RIFF_TAG = 0x52494646;
const MINIMUM_SIZE = 12; // 12 == size of RIFF_TAG + skipped bytes + size of this.type_tag

/**
 * An image identifier that identifies RIFF based files.
 *
 * @abstract
 */
export class RIFFIdentifier extends ImageIdentifier {
	/**
	 * Get the type tag of this type of file.
	 *
	 * @abstract
	 * @returns {number} The type tag of the file
	 */
	get_type_tag() {
		throw new Error('Not Implemented!');
	}

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
		const riff_magic = buffer.readUInt32BE(0);
		const type_magic = buffer.readUInt32BE(8);

		return riff_magic === RIFF_TAG && type_magic === this.get_type_tag();
	}
}
