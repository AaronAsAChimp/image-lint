import {Bitstream} from '../bitstream/bitstream.js';

const U32_MAX = 0xFFFFFFFF;

/** @type {0} */
const VAL = 0;
/** @type {1} */
const BITS = 1;
/** @type {2} */
const BITS_OFFSET = 2;

/**
 * @typedef {[0, number] | [1, number] | [2, number, number]} Distribution
 */

/** @typedef {[Distribution, Distribution, Distribution, Distribution]} Distribution32 */

/** @typedef {Set<number>} EnumTable */

/**
 * @typedef {object} CustomXY
 * @property {number} x The x component
 * @property {number} y The y component
 */

/**
 * Format a byte as a string.
 *
 * @param  {number} bits The byte as number.
 * @returns {string}     The formatted byte.
 */
// function dbg_byte(bits) {
// 	return ('00000000' + bits.toString(2)).slice(-8);
// }


/**
 * An error that is thrown when the stream can not be parsed.
 */
export class IllformedStreamError extends Error {

}

/**
 * The JXL bitstream.
 */
export class BitStream extends Bitstream {
	/**
	 * Read a 32bit unsigned integer from the stream.
	 *
	 * @param  {Distribution32} distributions The distributions.
	 * @returns {number}  The number read.
	 */
	read_u32(...distributions) {
		if (distributions.length > 4) {
			throw new Error('U32: A u32 takes only 4 distributions.');
		}

		const u = this.read_bits(2);
		const dist = distributions[u];

		// console.log('distribution', u.toString(2));

		if (dist[0] === VAL) {
			return dist[1];
		} else if (dist[0] === BITS) {
			return this.read_bits(dist[1]);
		} else if (dist[0] === BITS_OFFSET) {
			if (dist.length !== 3) {
				throw new Error('U32: incorrect number of parameters for BitsOffset distribution.');
			}
			return (dist[2] + this.read_bits(dist[1])) % U32_MAX;
		} else {
			throw new Error('U32: Unknown distribution.');
		}
	}

	/**
	 * Read a signed 32bit integer from the stream.
	 *
	 * @param  {Distribution32} distributions The distributions.
	 * @returns {number}   The number read.
	 */
	read_s32(...distributions) {
		const v = this.read_u32(...distributions);

		if (v % 2 === 0) {
			return v >> 1;
		} else if (v === U32_MAX) {
			return 0x80000000;
		} else {
			return -(v >> 1);
		}
	}

	/**
	 * Read a 16bit float from the stream.
	 *
	 * @returns {number}  The number read.
	 */
	read_f16() {
		const bits16 = this.read_bits(16);
		const sign = bits16 >> 15;
		const biased_exp = ( bits16 >> 10 ) & 0x1F;
		const mantissa = bits16 & 0x3FF;
		let value;

		if (biased_exp === 31) {
			throw new IllformedStreamError('F16: Invalid biased exponent.');
		}

		if ( biased_exp == 0 ) {
			value = mantissa / ( 1 << 24 );
		} else {
			const biased_exp32 = biased_exp + ( 127 - 15 );
			const mantissa32 = mantissa << ( 23 - 10 );
			const buffer = new ArrayBuffer(4);
			(new Uint32Array(buffer))[0] = ( sign << 31 ) | ( biased_exp32 << 23 ) | mantissa32;
			value = (new Float32Array(buffer))[0];
		}

		return value;
	}

	/**
	 * Read a custom X, Y from the stream.
	 *
	 * @returns {CustomXY} The value read.
	 */
	read_customxy() {
		return {
			x: this.read_s32(
				[BITS, 19],
				[BITS_OFFSET, 19, 524288],
				[BITS_OFFSET, 20, 1048576],
				[BITS_OFFSET, 21, 2097152],
			),
			y: this.read_s32(
				[BITS, 19],
				[BITS_OFFSET, 19, 524288],
				[BITS_OFFSET, 20, 1048576],
				[BITS_OFFSET, 21, 2097152],
			),
		};
	}

	/**
	 * Read an enumeration from the stream.
	 *
	 * @param  {EnumTable} enum_table The table of enum values.
	 * @returns {number}            The enum value read.
	 */
	read_enum(enum_table) {
		const value = this.read_u32(
			[VAL, 0],
			[VAL, 1],
			[BITS_OFFSET, 4, 2],
			[BITS_OFFSET, 6, 18],
		);

		if (value > 63) {
			throw new IllformedStreamError(`Enum: Invalid value: ${ value }`);
		} else if (!enum_table.has(value)) {
			throw new IllformedStreamError(`Enum: Unknown value: ${ value }`);
		}

		return value;
	}
}

export const U32 = {
	VAL,
	BITS,
	BITS_OFFSET,
};
