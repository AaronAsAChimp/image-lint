import {U32} from './bit-stream.js';

const XSIZE_SEPARATE = 0; // xsize coded separately
const XSIZE_IS_YSIZE = 1; // xsize = ysize
const XSIZE_RATIO_12X10 = 2; // xsize = floor( ysize × 12 / 10)
const XSIZE_RATIO_4X3 = 3; // xsize = floor( ysize × 4 / 3)
const XSIZE_RATIO_3X2 = 4; // xsize = floor( ysize × 3 / 2)
const XSIZE_RATIO_16X9 = 5; // xsize = floor( ysize × 16 / 9)
const XSIZE_RATIO_5X4 = 6; // xsize = floor( ysize × 5 / 4)
const XSIZE_RATIO_2X1 = 7; // xsize = floor( ysize × 2 / 1)

/**
 * The JXL size header
 */
export class SizeHeader {
	/**
	 * Construct a new SizeHeader
	 *
	 * @param  {import('./bit-stream.js').BitStream} stream The bit stream to read the SizeHeader from.
	 */
	constructor(stream) {
		let ysize;
		let xsize;

		/** @type {boolean} */
		this.small = stream.read_boolean();

		if (this.small) {
			ysize = (stream.read_bits(5) + 1) * 8;
		} else {
			ysize = stream.read_u32(
				[U32.BITS, 9],
				[U32.BITS, 13],
				[U32.BITS, 18],
				[U32.BITS, 30],
			) + 1;
		}

		/** @type {number} */
		this.ratio = stream.read_bits(3);

		if (this.ratio === XSIZE_SEPARATE) {
			if (this.small) {
				xsize = (stream.read_bits(5) + 1) * 8;
			} else {
				xsize = stream.read_u32(
					[U32.BITS, 9],
					[U32.BITS, 13],
					[U32.BITS, 18],
					[U32.BITS, 30],
				) + 1;
			}
		} else if (this.ratio === XSIZE_IS_YSIZE) {
			xsize = ysize;
		} else if (this.ratio === XSIZE_RATIO_12X10) {
			xsize = Math.floor(ysize * 12 / 10);
		} else if (this.ratio === XSIZE_RATIO_4X3) {
			xsize = Math.floor(ysize * 4 / 3);
		} else if (this.ratio === XSIZE_RATIO_3X2) {
			xsize = Math.floor(ysize * 3 / 2);
		} else if (this.ratio === XSIZE_RATIO_16X9) {
			xsize = Math.floor(ysize * 16 / 9);
		} else if (this.ratio === XSIZE_RATIO_5X4) {
			xsize = Math.floor(ysize * 5 / 4);
		} else if (this.ratio === XSIZE_RATIO_2X1) {
			xsize = Math.floor(ysize * 2 / 1);
		} else {
			throw new Error('SizeHeader: unknown aspect ratio.');
		}

		/** @type {number} */
		this.ysize = ysize;

		/** @type {number} */
		this.xsize = xsize;
	}

	/**
	 * Get whether or not this is a small image.
	 *
	 * @returns {boolean} True if small, false otherwise.
	 */
	get_small() {
		return this.small;
	}

	/**
	 * Get the y-size of the image.
	 *
	 * @returns {number} The y-size.
	 */
	get_ysize() {
		return this.ysize;
	}

	/**
	 * Get the x-size of the image.
	 *
	 * @returns {number} The x-size.
	 */
	get_xsize() {
		return this.xsize;
	}

	/**
	 * Get the aspect ratio.
	 *
	 * @returns {number} The ratio.
	 */
	get_ratio() {
		return this.ratio;
	}
}


export const Ratio = {
	XSIZE_SEPARATE,
	XSIZE_IS_YSIZE,
	XSIZE_RATIO_12X10,
	XSIZE_RATIO_4X3,
	XSIZE_RATIO_3X2,
	XSIZE_RATIO_16X9,
	XSIZE_RATIO_5X4,
	XSIZE_RATIO_2X1,
};
