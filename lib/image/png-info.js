/* @flow */
'use strict';

const crc = require('crc'),
	  InfoProvider = require('../image-info'),
	  pf = require('../pixel-format'),
	  PixelFormat = pf.PixelFormat,
	  ColorSpace = pf.ColorSpace;

const IHDR_OFFSET = 0xC;
const SECTION_HEADER_WIDTH = 4,
	  SECTION_LENGTH_WIDTH = 4,
	  CRC_WIDTH = 4;

const WIDTH_OFFSET = IHDR_OFFSET + SECTION_HEADER_WIDTH,
	  HEIGHT_OFFSET = WIDTH_OFFSET + 4,
	  BIT_DEPTH_OFFSET = HEIGHT_OFFSET + 4,
	  COLOR_TYPE_OFFSET = BIT_DEPTH_OFFSET + 1;

const CHUNK_TYPE_IEND = 0x49454E44;

const IEND_CRC = 0xAE426082,
	  IEND_LENGTH = SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + CRC_WIDTH;

const GRAYSCALE_TYPES = new Set([0, 4]),
	  RGB_TYPES = new Set([2, 3, 6]),
	  ALPHA_TYPES = new Set([4, 6]),
	  INDEXED_TYPES = new Set([4]);

// http://www.libpng.org/pub/png/spec/1.2/

class PNGChunk {
	/*::
	length: number;
	header: number;
	data: Buffer;
	crc32: number;
	*/
	constructor(buffer, offset) {
		this.length = buffer.readUInt32BE(offset);
		this.header = buffer.readUInt32BE(offset + SECTION_LENGTH_WIDTH);
		this.data = buffer.slice(offset + SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH, this.length);
		this.crc32 = buffer.readUInt32BE(offset + SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + this.length)
	}

	verify() {
		let header = Buffer.alloc(4),
			check = null;

		header.writeUInt32BE(this.header, 0);

		check = crc.crc32(header);
		check = crc.crc32(this.data, check);

		return check === this.crc32;
	}
}

class PNGInfoProvider extends InfoProvider {

	constructor () {
		super();

		this.magic = new Buffer('89504e470d0a1a0a', 'hex');

	}

	get_overhead () {
		// This is the size of the smallest possible PNG, I'm assuming it will
		// be mostly overhead.
		return 67;
	}

	is_truncated (buffer/*: Buffer */)/*: boolean */ {
		let end_chunk = null;

		try {
			end_chunk = new PNGChunk(buffer, buffer.length - IEND_LENGTH);
		} catch (e) {
			return true;
		}

		return end_chunk.header === CHUNK_TYPE_IEND && !end_chunk.verify();
	}

	get_dimensions (buffer) {
		return {
			width: buffer.readUInt32BE(WIDTH_OFFSET),
			height: buffer.readUInt32BE(HEIGHT_OFFSET),
			frames: 1
		};
	}

	get_pixel_format (buffer) {
		let format = new PixelFormat(),
			bit_depth = buffer.readInt8(BIT_DEPTH_OFFSET),
			color_type = buffer.readInt8(COLOR_TYPE_OFFSET);

		// Determine the color space
		if (RGB_TYPES.has(color_type)) {
			format.color_space = ColorSpace.RGB;
			format.bit_depth.R = bit_depth;
			format.bit_depth.G = bit_depth;
			format.bit_depth.B = bit_depth;
		} else if (GRAYSCALE_TYPES.has(color_type)) {
			format.color_space = ColorSpace.G;
			format.bit_depth.G = bit_depth;
		} else {
			throw new Error('Unknown color type ' + color_type);
		}

		// Determine the alpha channel
		if (ALPHA_TYPES.has(color_type)) {
			format.alpha = true;
			format.bit_depth.alpha = bit_depth;
		}

		// Determine if it is indexed.
		if (INDEXED_TYPES.has(color_type)) {
			format.indexed = true;
		}

		return format;
	}
	
	get_extensions() {
		return [
			'.png'
		];
	}

	get_mimes() {
		return [
			'image/png'
		];
	}
}

InfoProvider.register(PNGInfoProvider);
