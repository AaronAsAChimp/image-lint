/* @flow */

import {ImageIdentifier} from '../ident.js';

/**
 * An image identifier that can identify XML files.
 */
export class XMLIdentifier extends ImageIdentifier {
	/**
	 * Get the name of the root element of this type of XML file.
	 */
	get_root_element()/*: string */ {
		throw new Error('Not Implemented!');
	}

	/**
	 * @inheritDoc
	 */
	is_of_file_type(buffer/*: Buffer */)/*: boolean */ {
		// Only check the first part of the file.
		const small_buffer = buffer.slice(0, 512).toString().toLowerCase();

		return small_buffer.includes('<' + this.get_root_element());
	}

	/**
	 * @inheritDoc
	 */
	can_validate(buffer/*: Buffer */)/*: boolean */ {
		return true;
	}
}
