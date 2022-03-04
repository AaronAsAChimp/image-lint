/* @flow */
'use strict';


const InfoProvider = require('../image-info.js'),
	  pf = require('../pixel-format'),
	  PixelFormat = pf.PixelFormat,
	  ColorSpace = pf.ColorSpace;

const {U32, BitStream} = require('./jxl/bit-stream');
const {SizeHeader} = require('./jxl/size-header');
const {ImageMetadata} = require('./jxl/image-metadata');
const {COLOR_SPACE} = require('./jxl/color-encoding');

const CONTAINER_HEADER_SIZE = 48;
const MAX_CODESTREAM_BASIC_INFO_SIZE = 50;
const MAX_BASIC_INFO_SIZE = CONTAINER_HEADER_SIZE + MAX_CODESTREAM_BASIC_INFO_SIZE;

// https://gitlab.com/wg1/jpeg-xl/-/blob/master/lib/jxl/decode.cc
// https://arxiv.org/ftp/arxiv/papers/1908/1908.03565.pdf

// signature: Signature
// size: SizeHeader
// metadata: ImageMetadata

class JXLInfoProvider extends InfoProvider {
	get_overhead () {
		// This is the size of the smallest possible JPG, I'm assuming it will
		// be mostly overhead.
		return 119;
	}

	is_truncated (buffer/*: Buffer */)/*: boolean */ {
		return buffer.readUInt8(buffer.length - 1) !== 0x00;
	}

	get_dimensions (buffer) {
		const bit_stream = new BitStream(buffer, 0);

		const size_header = new SizeHeader(bit_stream);

		return {
			width: size_header.get_xsize(),
			height: size_header.get_ysize(),
			frames: 1 // TODO: read this from ImageMetadata2
		};
	}

	get_pixel_format (buffer) {
		const bit_stream = new BitStream(buffer, 0);

		const size_header = new SizeHeader(bit_stream);
		const image_metadata = new ImageMetadata(bit_stream);
		const color_encoding = image_metadata.color_encoding

		let format = new PixelFormat();

		if (color_encoding) {
			if (color_encoding.color_space === COLOR_SPACE.K_GREY) {
				format.color_space = ColorSpace.G;
			} else if (color_encoding.color_space === COLOR_SPACE.K_RGB) {
				format.color_space = ColorSpace.RGB;
			} else if (color_encoding.color_space === COLOR_SPACE.K_XYZ) {
				format.color_space = ColorSpace.XYZ;
			} else if (color_encoding.color_space === COLOR_SPACE.K_XYB) {
				format.color_space = ColorSpace.XYB;
			} else {
				throw new Error('Unknown color space.');
			}
		}

		return format;
	}
}

module.exports = JXLInfoProvider;
