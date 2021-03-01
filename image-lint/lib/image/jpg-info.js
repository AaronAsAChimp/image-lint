/* @flow */
'use strict';

const InfoProvider = require('../image-info.js'),
	  pf = require('../pixel-format'),
	  PixelFormat = pf.PixelFormat,
	  ColorSpace = pf.ColorSpace;

const MARKER_LENGTH = 2;
const CHUNKS_WITH_DIMS = 0xF0;
const HEIGHT_OFFSET = 5;
const WIDTH_OFFSET = 7;
const CHANNELS_OFFSET = 9;
const FILE_TRAILER = 0xFFD9;

// https://www.w3.org/Graphics/JPEG/jfif3.pdf
// http://www.itu.int/rec/T-REC-T.871-201105-I/en

class JPGInfoProvider extends InfoProvider {

	constructor () {
		super();

		this.magic = Buffer.from('ffd8ff', 'hex');

	}

	/**
	 * @return Number the offset of the next chunk
	 */
	next_chunk (buffer, offset) {
		return offset + MARKER_LENGTH + buffer.readUInt16BE(offset + 2); //this.calculate_chunk_length(s1, s2);
	}

	/**
	 * Determines if this chunk is a SOFn chunk that may conatain matadata for
	 * this image.
	 *
	 * @param  {Buffer}  buffer The buffer source of the image.
	 * @param  {number}  offset The offset of the start of the chunk
	 * @return {Boolean}        Returns true if it is a SOFn chunk.
	 */
	is_sof_chunk (buffer, offset) {
		let sof_byte = buffer.readUInt8(offset + 1);

		return (sof_byte & CHUNKS_WITH_DIMS) === 0xC0 && sof_byte !== 0xC4 && sof_byte !== 0xC8 && sof_byte !== 0xCC;
	}

	/**
	 * Iterate all the chunks in the file.
	 *
	 * @param {Buffer} buffer The buffer to scan through looking for chunks.
	 * @yields {number} The offset of the next chunk.
	 */
	*chunks (buffer)/*: Generator<number, void, number> */ {
		var offset = this.next_chunk(buffer, MARKER_LENGTH),
			found = false;

		while (!found) {

			yield offset;

			offset = this.next_chunk(buffer, offset);

			//console.log(offset, buffer.length);

			if (offset > buffer.length) {
				found = true;
			}
		}
	}

	get_overhead () {
		// This is the size of the smallest possible JPG, I'm assuming it will
		// be mostly overhead.
		return 119;
	}

	is_truncated (buffer/*: Buffer */)/*: boolean */ {
		return buffer.readUInt16BE(buffer.length - 2) !== FILE_TRAILER;
	}

	get_dimensions (buffer) {
		var width = null,
			height = null;

		for (let offset of this.chunks(buffer)) {

			if (this.is_sof_chunk(buffer, offset)) {
				//console.log('Reading header');

				width = buffer.readUInt16BE(offset + WIDTH_OFFSET);
				height = buffer.readUInt16BE(offset + HEIGHT_OFFSET);

				break;
			}
		}

		if (!width || !height) {
			throw new Error('Dimensions not found');
		}

		return {
			width: width,
			height: height,
			frames: 1
		};
	}

	get_pixel_format (buffer) {
		let format = new PixelFormat(),
			channels = null;

		for (let offset of this.chunks(buffer)) {
			if (this.is_sof_chunk(buffer, offset)) {

				channels = buffer.readUInt8(offset + CHANNELS_OFFSET);

				break;
			}
		}

		if (channels === 1) {
			format.color_space = ColorSpace.G;
		} else if (channels === 3) {
			format.color_space = ColorSpace.RGB;
		} else if (channels === 4) {
			format.color_space = ColorSpace.CMYK;
		}

		return format;
	}

	get_extensions() {
		return [
			'.jpg',
			'.jpeg',
			'.jpe'
		];
	}

	get_mimes() {
		return [
			'image/jpeg'
		];
	}
}

InfoProvider.register(JPGInfoProvider);
