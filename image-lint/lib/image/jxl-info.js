/* @flow */
'use strict';

/*::
import type {Dimensions} from '../image-info.js';
*/

import {InfoProvider} from '../image-info.js';
import {PixelFormat, ColorSpace} from '../pixel-format.js';

import {/* U32, */ BitStream} from './jxl/bit-stream.js';
import {SizeHeader} from './jxl/size-header.js';
import {ImageMetadata} from './jxl/image-metadata.js';
import {COLOR_SPACE} from './jxl/color-encoding.js';

// const CONTAINER_HEADER_SIZE = 48;
// const MAX_CODESTREAM_BASIC_INFO_SIZE = 50;
// const MAX_BASIC_INFO_SIZE = CONTAINER_HEADER_SIZE + MAX_CODESTREAM_BASIC_INFO_SIZE;

// https://gitlab.com/wg1/jpeg-xl/-/blob/master/lib/jxl/decode.cc
// https://arxiv.org/ftp/arxiv/papers/1908/1908.03565.pdf

// signature: Signature
// size: SizeHeader
// metadata: ImageMetadata

/**
 * A JPEG XL info provider.
 */
export class JXLInfoProvider extends InfoProvider {
	/**
	 * @inheritdoc
	 */
	get_overhead()/*: number */ {
		// This is the size of the smallest possible JPG, I'm assuming it will
		// be mostly overhead.
		return 119;
	}

	/**
	 * @inheritdoc
	 */
	is_truncated(buffer/*: Buffer */)/*: boolean */ {
		return buffer.readUInt8(buffer.length - 1) !== 0x00;
	}

	/**
	 * @inheritdoc
	 */
	get_dimensions(buffer/*: Buffer */)/*: Dimensions */ {
		const bit_stream = new BitStream(buffer, 0);

		const size_header = new SizeHeader(bit_stream);

		return {
			width: size_header.get_xsize(),
			height: size_header.get_ysize(),
			frames: 1, // TODO: read this from ImageMetadata2
		};
	}

	/**
	 * @inheritdoc
	 */
	get_pixel_format(buffer/*: Buffer */)/*: PixelFormat */ {
		const bit_stream = new BitStream(buffer, 0);

		// const size_header = new SizeHeader(bit_stream);
		const image_metadata = new ImageMetadata(bit_stream);
		const color_encoding = image_metadata.color_encoding;

		const format = new PixelFormat();

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
				format.color_space = ColorSpace.unkownFormat(color_encoding);
			}
		}

		return format;
	}
}
