const WORD_SIZE = 8;
const QUAD_WORD_SIZE = WORD_SIZE * 4;


/**
 * A bitstream.
 */
export class Bitstream {
	/** @type {Buffer} */
	buffer;

	/** @type {number} */
	offset;

	/** @type {number} */
	sub_bit;

	/** @type {number} */
	current_byte;

	/**
	 * Construct a new  Bitstream.
	 *
	 * @param  {Buffer} buffer The buffer that contains the image.
	 * @param  {number} offset The offset from beginning of the buffer.
	 */
	constructor(buffer, offset = 0) {
		this.buffer = buffer;
		this.offset = offset;
		this.sub_bit = 0;
		this.current_byte = buffer.readUInt8(offset);
	}

	/**
	 * Read a certain number of bits from a byte.
	 *
	 * @param {number} byte  The byte to read from.
	 * @param {number} offset  Which bit to start reading from.
	 * @param {number} bits  The number of bits to read.
	 *
	 * @returns {number} The bits that were read.
	 */
	read_from_byte(byte, offset, bits) {
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

	/**
	 * Read a certain number of bits from the stream.
	 *
	 * @param  {number} bits  The number of bits to read.
	 * @returns {number}      The bits read as a number.
	 */
	read_bits(bits) {
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
			bits -= start_bits;
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

	/**
	 * Read a boolean from the stream.
	 *
	 * @returns {boolean}  The boolean read.
	 */
	read_boolean() {
		return !!this.read_bits(1);
	}

	/**
	 * Get the number of bits read from the stream.
	 *
	 * @returns {number}  The number of bits read.
	 */
	get_bits_read() {
		return (this.offset * 8) + this.sub_bit;
	}
}

