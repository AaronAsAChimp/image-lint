import crc from 'crc';

export const SECTION_HEADER_WIDTH = 4;
export const SECTION_LENGTH_WIDTH = 4;
export const CRC_WIDTH = 4;

export const CHUNK_TYPE_IEND = 0x49454E44;

export const FIRST_CHUNK_OFFSET = 8;
export const IHDR_OFFSET = FIRST_CHUNK_OFFSET + SECTION_LENGTH_WIDTH;

/**
 * A PNG chunk.
 */
export class PNGChunk {
	/**
	 * Construct a new PNG chunk.
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, offset) {
		/** @type {number} */
		this.offset = offset;

		/** @type {number} */
		this.length = buffer.readUInt32BE(offset);

		/** @type {number} */
		this.header = buffer.readUInt32BE(offset + SECTION_LENGTH_WIDTH);

		/** @type {Buffer} */
		this.data = buffer.subarray(
			offset + SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH,
			offset + SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + this.length,
		);

		/** @type {number} */
		this.crc32 = buffer.readUInt32BE(offset + SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + this.length);
	}

	/**
	 * Verify the CRC in the chunk.
	 *
	 * @returns {boolean} True if its a valid chunk.
	 */
	verify() {
		const header = Buffer.alloc(4);
		let check = null;

		header.writeUInt32BE(this.header, 0);

		check = crc.crc32(header);
		check = crc.crc32(this.data, check);

		return check === this.crc32;
	}

	/**
	 * Get the total length of the chunk. This is different from the length
	 * property that is only the data length.
	 *
	 * @returns {number} The length of the chunks.
	 */
	get_total_length() {
		return SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + this.length + CRC_WIDTH;
	}

	/**
	 * Describe this chunk.
	 *
	 * @returns {string} The description of this chunk.
	 */
	describe() {
		const name = Buffer.from(this.header.toString(16), 'hex');

		return `${ name } (offset ${ this.offset }, length ${ this.length }, crc32 0x${ this.crc32.toString(16) } ${ this.verify() ? '\u2713' : '\u2717' })`;
	}

	/**
	 * Parse all of the chunks from the provided buffer.
	 *
	 * @param  {Buffer} buffer The image buffer.
	 * @param  {number} offset The offset of where to start parsing.
	 * @returns {PNGChunk[]}   The chunks contained in the buffer.
	 */
	static get_chunks(buffer, offset) {
		let current_offset = offset;
		let is_end = false;
		const chunks = [];

		// console.log(current_offset, buffer.length);

		while (current_offset < buffer.length && !is_end) {
			const chunk = new PNGChunk(buffer, current_offset);

			chunks.push(chunk);

			// console.log(current_offset, SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + chunk.length + CRC_WIDTH);

			current_offset = current_offset + chunk.get_total_length();
			is_end = chunk.header === CHUNK_TYPE_IEND;
		}

		return chunks;
	}
}
