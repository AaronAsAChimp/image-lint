import {CHUNK_NAMES} from './chunk-names.js';

export const MARKER_LENGTH = 2;
const CHUNKS_WITH_DIMS = 0xF0;
const RST0_MARKER = 0xFFD0;
const RST7_MARKER = 0xFFD7;
// const SOI_MARKER = 0xFFD8;
export const EOI_MARKER = 0xFFD9;
const SOS_MARKER = 0xFFDA;

/**
 * A JPEG chunk
 */
export class JPEGChunk {
	/**
	 * Describe this chunk.
	 *
	 * @returns {string} The description of this chunk.
	 */
	describe() {
		return 'UNK';
	}

	/**
	 * Determines if this chunk is an EOI chunk that signifies the end of
	 * the image.
	 *
	 * @returns {boolean} True if it is an EOI chunk.
	 */
	is_eoi_chunk() {
		return false;
	}

	/**
	 * Determines if this chunk is a SOFn chunk that may conatain matadata for
	 * this image.
	 *
	 * @returns {boolean}        Returns true if it is a SOFn chunk.
	 */
	is_sof_chunk() {
		return false;
	}

	/**
	 * Parse all of the chunks from the provided buffer.
	 *
	 * @param  {Buffer} buffer The image buffer.
	 * @param  {number} offset The offset of where to start parsing.
	 * @returns {JPEGChunk[]}  The chunks contained in the buffer.
	 */
	static get_chunks(buffer, offset) {
		let found = false;
		const result = [];

		while (!found) {
			const marker_code = buffer.readUInt16BE(offset);
			let chunk;

			if (marker_code >= RST0_MARKER && marker_code <= EOI_MARKER) {
				chunk = new StandaloneJPEGChunk(buffer, offset);
				offset += MARKER_LENGTH;

				// RST markers are immediately followed by an Entropy
				// Coded Segment.
				if (offset < buffer.length && marker_code >= RST0_MARKER && marker_code <= RST7_MARKER) {
					result.push(chunk);

					chunk = EntropyCodedSegment.from_buffer(buffer, offset);
					offset += chunk.length;
				}
			} else if (marker_code === SOS_MARKER) {
				chunk = new SOSChunk(buffer, offset);
				offset += MARKER_LENGTH + chunk.length;

				result.push(chunk);

				// SOS chunks are immediately followed by an Entropy
				// Coded Segment.
				if (offset < buffer.length) {
					chunk = EntropyCodedSegment.from_buffer(buffer, offset);
					offset += chunk.length;
				}
			} else if (CHUNK_NAMES.has(marker_code)) {
				chunk = new DataJPEGChunk(buffer, offset);
				offset += MARKER_LENGTH + chunk.length;
			} else {
				throw new Error(`Unknown marker code ${ marker_code.toString(16) } at offset ${ offset }`);
			}

			result.push(chunk);

			// console.log('offset', offset, 'buffer length:', buffer.length);

			// There needs to be at least two bytes left in the buffer to be
			// able to read the next chunk.
			if (offset >= buffer.length - 1 || chunk.is_eoi_chunk()) {
				found = true;
			}
		}

		return result;
	}
}

/**
 * A JPEG chunk
 */
export class MarkerSegment {
	/**
	 * Construct a JPEG chunk
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, offset) {
		this.offset = offset;
		this.marker_code = buffer.readUInt16BE(offset);
	}

	/**
	 * Describe this chunk.
	 *
	 * @returns {string} The description of this chunk.
	 */
	describe() {
		const name = CHUNK_NAMES.get(this.marker_code) ?? 'UNK';

		return `${ name } (0x${ this.marker_code.toString(16) }, offset ${ this.offset })`;
	}

	/**
	 * Determines if this chunk is an EOI chunk that signifies the end of
	 * the image.
	 *
	 * @returns {boolean} True if it is an EOI chunk.
	 */
	is_eoi_chunk() {
		return EOI_MARKER === this.marker_code;
	}

	/**
	 * Determines if this chunk is a SOFn chunk that may conatain matadata for
	 * this image.
	 *
	 * @returns {boolean}       Returns true if it is a SOFn chunk.
	 */
	is_sof_chunk() {
		const sof_byte = this.marker_code;

		return (sof_byte & CHUNKS_WITH_DIMS) === 0xC0 &&
			sof_byte !== 0xFFC4 &&
			sof_byte !== 0xFFC8 &&
			sof_byte !== 0xFFCC;
	}
}

/**
 * A chunk that doesn't have any data and is only a marker.
 */
class StandaloneJPEGChunk extends MarkerSegment {

}

/**
 * A chunk that contains data.
 */
class DataJPEGChunk extends MarkerSegment {
	/**
	 * Construct a JPEG data chunk
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, offset) {
		super(buffer, offset);

		this.length = buffer.readUInt16BE(offset + 2);
		this.number_of_components = buffer.readUInt8(offset + 4);
	}
}


/**
 * A chunk that contains the Start of Scan data.
 */
class SOSChunk extends MarkerSegment {
	/**
	 * Construct a SOS chunk
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {number} offset The offset of the beginning of the chunk.
	 */
	constructor(buffer, offset) {
		super(buffer, offset);

		this.scan_header_length = buffer.readUInt16BE(offset + 2);
		this.number_of_components = buffer.readUInt8(offset + 4);
		this.length = this.scan_header_length + 6;
	}
}

/**
 * A chunk that contains entropy coded data.
 */
class EntropyCodedSegment extends JPEGChunk {
	/**
	 * Construct a new EntropyCodedSegment
	 *
	 * @param  {Buffer} buffer The file buffer
	 * @param  {number} offset The offset of the beginning of the segment.
	 * @param  {number} length The length ofthe segment.
	 */
	constructor(buffer, offset, length) {
		super();

		this.offset = offset;
		this.length = length;
	}

	/**
	 * Describe this chunk.
	 *
	 * @returns {string} The description of this chunk.
	 */
	describe() {
		return `Entropy Coded Segment (offset ${ this.offset }, length ${ this.length })`;
	}

	/**
	 * Read an EC segment from a buffer.
	 *
	 * @param  {Buffer} buffer The file buffer
	 * @param  {number} offset The offset of the beginning of the segment.
	 * @returns {EntropyCodedSegment}   The segment read from the buffer.
	 */
	static from_buffer(buffer, offset) {
		// The entropy coded data always follows the SOS chunk.
		let end_of_ecs = false;
		const ecs_start = offset;
		let max = 10000;

		// Scan ahead until a 0xFF byte is found that is not followed by a
		// 0x00 byte.
		while (!end_of_ecs && max > 0) {
			const segment_start = buffer.indexOf(0xFF, offset + 1);

			if (segment_start >= 0) {
				end_of_ecs = buffer.readUInt8(segment_start + 1) !== 0x00;
				offset = segment_start;
			} else {
				offset = buffer.length;
				break;
			}

			max--;
		}

		if (max === 0) {
			throw new Error('Maximum chunk size exceeded.');
		}

		return new EntropyCodedSegment(buffer, ecs_start, offset - ecs_start);
	}
}
