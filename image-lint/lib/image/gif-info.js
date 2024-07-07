import {InfoProvider} from '../image-info.js';
import {PixelFormat, ColorSpace} from '../pixel-format.js';

const VERSION_OFFSET = 0x3;
const HEIGHT_OFFSET = 0x6;
const WIDTH_OFFSET = 0x8;
const SETTINGS_OFFSET = 0xA;
const COLOR_TABLE_OFFSET = 0xD;
const COLOR_TABLE_AVAILABLE_MASK = 0x80;
const COLOR_TABLE_LENGTH_MASK = 0x7;
const IMAGE_DESCRIPTOR_OFFSET = 9; // a relative offset from the separator (0x2c)
const FILE_TRAILER = 0x3B; // A semicolon;

/**
 * A JPEG info provider.
 */
export class GIFInfoProvider extends InfoProvider {
	/**
	 * @inheritdoc
	 */
	get_overhead() {
		// This is the size of the smallest possible GIF, I'm assuming it will
		// be mostly overhead.
		return 35;
	}

	/**
	 * Get the offset of the next chunk.
	 *
	 * @param  {Buffer} buffer The file buffer
	 * @param  {number} offset The offset in the buffer.
	 * @returns {number}       The offset of the next chunk.
	 */
	next_chunk(buffer, offset) {
		const block_length = 2 + buffer.readUInt8(offset + 2);

		// console.log('block_length', block_length);

		return offset + block_length + this.get_sub_block_length(buffer, offset + block_length + 1) + 1;
	}

	/**
	 * Get the length of the sub-block.
	 *
	 * @param  {Buffer} buffer The file buffer
	 * @param  {number} offset The offset in the buffer.
	 * @returns {number}       The length of the sub-block.
	 */
	get_sub_block_length(buffer, offset) {
		let sub_block_length = 0;
		let size_byte = buffer.readUInt8(offset);

		// console.log('starting searching for sub-blocks, initial sub-block size', size_byte.toString(16));
		// if the initial size_byte is 0x00 then we are dealing with a non-data chunk.
		if (size_byte !== 0) {
			while (size_byte !== 0) {
				size_byte = buffer.readUInt8(offset + sub_block_length);
				// console.log(size_byte);
				sub_block_length += size_byte + 1;
			}
		} else {
			sub_block_length = 1;
		}

		// console.log('finished searching for sub-blocks, total length is', sub_block_length + 1);

		return sub_block_length;
	}

	/**
	 * Get the length of the color table.
	 *
	 * @param  {Buffer} buffer The file buffer.
	 * @param  {number} offset The offset in the buffer.
	 * @returns {number}       The length of the color table.
	 */
	get_color_table_length(buffer, offset) {
		const color_table_bits = buffer.readUInt8(offset) & COLOR_TABLE_LENGTH_MASK;

		// console.log('color table bits', color_table_bits.toString(16));

		return 3 * Math.pow(2, color_table_bits + 1);
	}

	/**
	 * Determine if a color table exists.
	 *
	 * @param  {Buffer}  buffer The file buffer.
	 * @param  {number}  offset The offset in buffer.
	 * @returns {boolean}       True if the file has a color table.
	 */
	has_color_table(buffer, offset) {
		// console.log('has color table', !!(buffer.readUInt8(offset) & COLOR_TABLE_AVAILABLE_MASK));
		return !!(buffer.readUInt8(offset) & COLOR_TABLE_AVAILABLE_MASK);
	}

	/**
	 * Get the version string.
	 *
	 * @param  {Buffer} buffer The file buffer
	 * @returns {string}       The version string.
	 */
	get_version(buffer) {
		return buffer.toString('ascii', VERSION_OFFSET, HEIGHT_OFFSET);
	}

	/**
	 * @inheritdoc
	 */
	get_dimensions(buffer) {
		let frame_count = 0;
		let found = false;
		let offset = 0;

		if (this.has_color_table(buffer, SETTINGS_OFFSET)) {
			const color_table_length = this.get_color_table_length(buffer, SETTINGS_OFFSET);
			offset = COLOR_TABLE_OFFSET + color_table_length;
		} else {
			offset = SETTINGS_OFFSET + 3;
		}

		// console.log(offset);

		while (!found) {
			let block_header = buffer.readUInt8(offset);

			// console.log('Offset of block', offset);
			// console.log('block header (should be 0x21)', block_header.toString(16));
			// console.log('block label', buffer.readUInt8(offset + 1).toString(16));

			if (block_header === 0x2c) {
				frame_count++;
				// console.log(buffer.readUInt8(offset).toString(16));
				offset += IMAGE_DESCRIPTOR_OFFSET;
				// Skip the color table, if present

				// console.log('color table return', this.has_color_table(buffer, offset));
				if (this.has_color_table(buffer, offset)) {
					// console.log('has local color table');
					offset += this.get_color_table_length(buffer, offset);
				}
				// Skip the Packed values byte and the "LZW Minimum Code Size" byte.
				offset += 2;
				// Skip the image data
				offset += this.get_sub_block_length(buffer, offset);
				// console.log('offset', offset);
				// console.log('this should be a block header', buffer.readUInt8(offset).toString(16));
			}

			// console.log('near the end', offset, buffer.length);

			if (offset + 1 >= buffer.length) {
				// Normal Termination
				// We've reached the end of the file
				found = true;
				continue;
			} else {
				block_header = buffer.readUInt8(offset);

				if (block_header !== 0x21 && block_header !== 0x2c) {
					// Abnormal Termination
					// There is either junk at the end of the file or its corrupted
					// (or the programmer made a mistake).
					found = true;
					continue;
				}
			}

			offset = this.next_chunk(buffer, offset);

			// console.log(offset);
		}

		// console.log('gif version', this.get_version(buffer));
		// console.log('number of frames', frame_count);

		return {
			'width': buffer.readUInt16LE(HEIGHT_OFFSET),
			'height': buffer.readUInt16LE(WIDTH_OFFSET),
			'frames': frame_count,
		};
	}

	/**
	 * @inheritdoc
	 */
	is_truncated(buffer) {
		return buffer.readUInt8(buffer.length - 1) !== FILE_TRAILER;
	}

	/**
	 * @inheritdoc
	 */
	get_pixel_format() {
		const format = new PixelFormat();

		format.color_space = ColorSpace.RGB;
		format.indexed = true;
		format.bit_depth.R = 8;
		format.bit_depth.G = 8;
		format.bit_depth.B = 8;

		// TODO: handle this properly
		format.bit_depth.alpha = 1;

		return format;
	}
}
