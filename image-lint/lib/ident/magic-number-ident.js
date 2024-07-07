import {ImageIdentifier} from '../ident.js';

/**
 * An image identifier that uses a magic number to identify the format.
 */
export class MagicNumberIdentifier extends ImageIdentifier {
	/**
	 * Get the magic number for this file type
	 *
	 * @abstract
	 * @returns {Buffer} The magic number for this file type
	 */
	get_magic() {
		throw new Error('Not Implemented');
	}

	/**
	 * @inheritDoc
	 */
	is_of_file_type(buffer) {
		const magic = this.get_magic();
		const buffer_magic = buffer.slice(0, magic.length);

		// console.log('Validating magic: ' + this.magic.toString('hex') + ' === ' + buffer_magic.toString('hex'));

		return Buffer.compare(magic, buffer_magic) === 0;
	}

	/**
	 * @inheritDoc
	 */
	can_validate(buffer) {
		const magic = this.get_magic();

		return buffer.length >= magic.length;
	}
}
