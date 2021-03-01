/* @flow */
'use strict';

const InfoProvider = require('../image-info.js');
const RIFF_TAG = 0x52494646;
const MINIMUM_SIZE = 12; // 12 == size of RIFF_TAG + skipped bytes + size of this.type_tag

class RIFFInfoProvider extends InfoProvider {
	/*::
	type_tag: number;
	*/
	can_validate (buffer/*: Buffer */)/*: boolean */ {
		return buffer.length > MINIMUM_SIZE;
	}

	validate_magic (buffer/*: Buffer */)/*: boolean */ {
		var riff_magic = buffer.readUInt32BE(0),
			type_magic = buffer.readUInt32BE(8);

		return riff_magic === RIFF_TAG && type_magic === this.type_tag;
	}
}

module.exports = RIFFInfoProvider;
