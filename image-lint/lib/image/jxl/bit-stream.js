/* @flow */

const U32_MAX = 0xFFFFFFFF;

const VAL = 0;
const BITS = 1;
const BITS_OFFSET = 2;

const WORD_SIZE = 8;
const QUAD_WORD_SIZE = WORD_SIZE * 4;

/*::
type Distribution =
	[0, number] |
	[1, number] |
	[2, number, number];

type Distribution32 = [
	Distribution,
	Distribution,
	Distribution,
	Distribution
];

export type CustomXY = {
	x: number,
	y: number
};

type EnumTable = Set<number>;
*/

function dbg_byte(bits) {
	return ('00000000' + bits.toString(2)).slice(-8);
}

export class IllformedStreamError extends Error {

}

/**
 * The JXL bitstream.
 */
export class BitStream {
	/*::
	buffer: Buffer;
	offset: number;
	sub_bit: number;
	current_byte: number;
	*/
	constructor(buffer/*: Buffer */, offset/*: number */ = 0) {
		this.buffer = buffer;
		this.offset = offset;
		this.sub_bit = 0;
		this.current_byte = buffer.readUInt8(offset);
	}

	read_from_byte(byte/*: number */, offset/*: number */, bits/*: number */)/*: number */ {
		let value = byte;

		// This builds the mask with the correct number of '1'. For example:
		//
		// | Bits | Mask     |
		// | ---- | -------- |
		// |    1 | 00000001 |
		// |    2 | 00000011 |
		// |  ... |    ...   |
		// |    8 | 11111111 |
		let mask = (1 << bits) - 1;

		// console.log('mask: ', mask.toString(2));
		// console.log('mask sub_bit:', this.sub_bit, '- mask bits: ', bits);

		// This positions the mask in the correct spot...
		//
		// | sub_bit | Bits | Mask     |
		// | ------- | ---- | -------- |
		// |       1 |    2 | 00000011 |
		// |       2 |    2 | 00000110 |
		// |   ...   |  ... |    ...   |
		// |       8 |    2 | 10000000 | (and one from the next byte).
		mask = (mask << offset) >>> 0;

		// console.log('mask:', mask.toString(2), '- value:', value.toString(2));
		// console.log('value: ', (value & mask).toString(2));

		value = (value & mask) >>> offset;

		return value;
	}

	read_bits(bits/*: number */)/*: number */ {
		if (bits > QUAD_WORD_SIZE) {
			throw new Error(`Can not read more than ${ QUAD_WORD_SIZE } bits at a time. Attempting to read ${ bits }`);
		}

		if (bits === 0) {
			return 0;
		}

		let leftovers = 0;
		let shift = 0;
		const start_bits = WORD_SIZE - this.sub_bit;

		// console.log('start_bits', start_bits);

		// Read whats leftover from the previous byte. So from here on its whole
		// bytes only.
		if (this.sub_bit > 0 && bits > start_bits) {
			// console.log('bits needed from previous byte', start_bits);
			bits -= start_bits
			leftovers = this.read_from_byte(this.current_byte, this.sub_bit, start_bits);
			shift = start_bits;

			this.offset += 1;
			this.current_byte = this.buffer.readUInt8(this.offset);
			this.sub_bit = 0;
		}

		const bytes = Math.floor(bits / WORD_SIZE);
		let value = leftovers;

		// Read whole bytes
		if (bytes > 0) {
			for (let byte = 0; byte < bytes; byte++) {
				let read = this.read_from_byte(this.current_byte, 0, WORD_SIZE);

				// console.log(`byte ${byte}: `, dbg_byte(read));

				if (shift) {
					read = read << shift;
				}

				// console.log('value: ', value.toString(2));

				this.offset += 1;
				this.current_byte = this.buffer.readUInt8(this.offset);

				shift += WORD_SIZE;

				value = value | read;
			}

			this.sub_bit = 0;
		}

		// There may still be a couple of bits left to read.
		bits = bits - (bytes * WORD_SIZE);

		if (bits > 0) {
			let read = this.read_from_byte(this.current_byte, this.sub_bit, bits);

			// console.log(`byte last: `, dbg_byte(read));

			if (shift) {
				read = read << shift;
			}

			value = value | read;

			this.sub_bit += bits;
		}

		return value;
	}

	read_boolean()/*: boolean */ {
		return !!this.read_bits(1);
	}

	read_u32(...distributions/*: Distribution32 */)/*: number */ {
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
			throw new Error('U32: Unknown distribution.')
		}
	}

	read_s32(...distributions/*: Distribution32 */)/*: number */ {
		let v = this.read_u32(...distributions);

		if (v % 2 === 0) {
			return v >> 1;
		} else if (v === U32_MAX) {
			return 0x80000000;
		} else {
			return -(v >> 1);
		}
	}

	read_f16()/*: number */ {
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

	read_customxy()/*: CustomXY */ {
		return {
			x: this.read_s32(
				[BITS, 19],
				[BITS_OFFSET, 19, 524288],
				[BITS_OFFSET, 20, 1048576],
				[BITS_OFFSET, 21, 2097152]
			),
			y: this.read_s32(
				[BITS, 19],
				[BITS_OFFSET, 19, 524288],
				[BITS_OFFSET, 20, 1048576],
				[BITS_OFFSET, 21, 2097152]
			)
		};
	}

	read_enum(enum_table/*: EnumTable */)/*: number */ {
		const value = this.read_u32(
			[VAL, 0],
			[VAL, 1],
			[BITS_OFFSET, 4, 2],
			[BITS_OFFSET, 6, 18]
		);

		if (value > 63) {
			throw new IllformedStreamError(`Enum: Invalid value: ${ value }`);
		} else if (!enum_table.has(value)) {
			throw new IllformedStreamError(`Enum: Unknown value: ${ value }`);
		}

		return value;
	}

	get_bits_read()/*: number */ {
		return (this.offset * 8) + this.sub_bit;
	}
}

export const U32 = {
	VAL,
	BITS,
	BITS_OFFSET,
};
