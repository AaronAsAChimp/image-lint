import {ImageIdentifier} from '../ident.js';

/**
 * An image identifier that can identify XML files.
 *
 * @abstract
 */
export class XMLIdentifier extends ImageIdentifier {
	/**
	 * Get the name of the root element of this type of XML file.
	 *
	 * @abstract
	 * @returns {string} The name of the root element
	 */
	get_root_element() {
		throw new Error('Not Implemented!');
	}

	/**
	 * @inheritDoc
	 */
	is_of_file_type(buffer) {
		// Only check the first part of the file.
		const small_buffer = buffer.slice(0, 512).toString().toLowerCase();

		return small_buffer.includes('<' + this.get_root_element());
	}

	/**
	 * @inheritDoc
	 */
	can_validate(buffer) {
		return true;
	}
}
