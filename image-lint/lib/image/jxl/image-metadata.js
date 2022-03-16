/* @flow */

/*::
import type {BitStream} from './bit-stream';
*/

const {U32} = require('./bit-stream');
const {ColorEncoding} = require('./color-encoding');

/*::
import type {ImageMetadata2} from './image-metadata2.js';
*/

/**
 * The JXL image metadata header.
 */
class ImageMetadata {
	/*::
	have_icc: boolean;
	bits_per_sample: number;
	color_encoding: ColorEncoding | null;
	alpha_bits: number;
	target_nits: number;
	m2: ImageMetadata2 | null;
	*/
	constructor(stream/*: BitStream */) {
		const all_default = stream.read_boolean();

		if (!all_default) {
			this.have_icc = stream.read_boolean();
			this.bits_per_sample = stream.read_u32(
				[U32.VAL, 8],
				[U32.VAL, 16],
				[U32.VAL, 32],
				[U32.BITS, 5]
			);
			this.color_encoding = new ColorEncoding(stream);
			this.alpha_bits = stream.read_u32(
				[U32.VAL, 0],
				[U32.VAL, 8],
				[U32.VAL, 16],
				[U32.BITS, 4]
			);
			this.target_nits = stream.read_u32(
				[U32.VAL, 5],
				[U32.VAL, 20],
				[U32.VAL, 80],
				[U32.BITS_OFFSET, 10, 1]
			);
			this.m2 = null;
		} else {
			this.have_icc = false;
			this.bits_per_sample = 8;
			this.color_encoding = new ColorEncoding();
			this.alpha_bits = 0;
			this.target_nits = 5 * 50;
			this.m2 = null;
		}
	}
}

module.exports = {
	ImageMetadata,
};
