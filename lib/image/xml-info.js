/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');

class XMLInfoProvider extends InfoProvider {

	/*::
	root_element: string;
	*/

	can_validate (buffer/*: Buffer */)/*: boolean */ {
		return true;
	}

	validate_magic (buffer/*: Buffer */)/*: boolean */ {
		// Only check the first part of the file.
		let small_buffer = buffer.slice(0, 512).toString().toLowerCase();

		return small_buffer.includes('<' + this.root_element);
	}
}

module.exports = XMLInfoProvider;
