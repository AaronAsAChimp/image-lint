import {U32} from './bit-stream.js';
import {ColorEncoding} from './color-encoding.js';

/**
 * The JXL image metadata header.
 */
export class ImageMetadata {
	/** @type {boolean} */
	have_icc;

	/** @type {number} */
	bits_per_sample;

	/** @type {ColorEncoding | null} */
	color_encoding;

	/** @type {number} */
	alpha_bits;

	/** @type {number} */
	target_nits;

	/** @type {import('./image-metadata2.js').ImageMetadata2 | null} */
	m2;

	/**
	 * Construct a new ImageMetadata.
	 *
	 * @param  {import('./bit-stream.js').BitStream} stream The bit stream to read the ImageMetadata from.
	 */
	constructor(stream) {
		const all_default = stream.read_boolean();

		if (!all_default) {
			this.have_icc = stream.read_boolean();
			this.bits_per_sample = stream.read_u32(
				[U32.VAL, 8],
				[U32.VAL, 16],
				[U32.VAL, 32],
				[U32.BITS, 5],
			);
			this.color_encoding = new ColorEncoding(stream);
			this.alpha_bits = stream.read_u32(
				[U32.VAL, 0],
				[U32.VAL, 8],
				[U32.VAL, 16],
				[U32.BITS, 4],
			);
			this.target_nits = stream.read_u32(
				[U32.VAL, 5],
				[U32.VAL, 20],
				[U32.VAL, 80],
				[U32.BITS_OFFSET, 10, 1],
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
