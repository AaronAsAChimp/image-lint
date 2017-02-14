/* @flow */
'use strict';

const InfoProvider = require('../image-info'),
	  pf = require('../pixel-format'),
	  PixelFormat = pf.PixelFormat,
	  ColorSpace = pf.ColorSpace;

const IHDR_OFFSET = 0xC;
const SECTION_HEADER_WIDTH = 4;

const WIDTH_OFFSET = IHDR_OFFSET + SECTION_HEADER_WIDTH,
	  HEIGHT_OFFSET = WIDTH_OFFSET + 4,
	  BIT_DEPTH_OFFSET = HEIGHT_OFFSET + 4,
	  COLOR_TYPE_OFFSET = BIT_DEPTH_OFFSET + 1;

const GRAYSCALE_TYPES = new Set([0, 4]),
	  RGB_TYPES = new Set([2, 3, 6]),
	  ALPHA_TYPES = new Set([4, 6]),
	  INDEXED_TYPES = new Set([4]);

// http://www.libpng.org/pub/png/spec/1.2/

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
