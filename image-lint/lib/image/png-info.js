/* @flow */
'use strict';

/*::
import type {Dimensions} from '../image-info.js';
*/

import {InfoProvider} from '../image-info.js';
import {PixelFormat, ColorSpace} from '../pixel-format.js';
import {PNGChunk, SECTION_LENGTH_WIDTH, SECTION_HEADER_WIDTH, CHUNK_TYPE_IEND, IHDR_OFFSET, CRC_WIDTH} from './png/chunk.js';

const WIDTH_OFFSET = IHDR_OFFSET + SECTION_HEADER_WIDTH;
const HEIGHT_OFFSET = WIDTH_OFFSET + 4;
const BIT_DEPTH_OFFSET = HEIGHT_OFFSET + 4;
const COLOR_TYPE_OFFSET = BIT_DEPTH_OFFSET + 1;

// const IEND_CRC = 0xAE426082;
const IEND_LENGTH = SECTION_LENGTH_WIDTH + SECTION_HEADER_WIDTH + CRC_WIDTH;

const GRAYSCALE_TYPES = new Set([0, 4]);
const RGB_TYPES = new Set([2, 3, 6]);
const ALPHA_TYPES = new Set([4, 6]);
const INDEXED_TYPES = new Set([4]);

// http://www.libpng.org/pub/png/spec/1.2/

/**
 * A PNG info provider.
 */
export class PNGInfoProvider extends InfoProvider {
	/**
	 * @inheritdoc
	 */
	get_overhead()/*: number */ {
		// This is the size of the smallest possible PNG, I'm assuming it will
		// be mostly overhead.
		return 67;
	}

	/**
	 * @inheritdoc
	 */
	is_truncated(buffer/*: Buffer */)/*: boolean */ {
		let end_chunk = null;

		try {
			end_chunk = new PNGChunk(buffer, buffer.length - IEND_LENGTH);
		} catch (e) {
			return true;
		}

		return end_chunk.header === CHUNK_TYPE_IEND && !end_chunk.verify();
	}

	/**
	 * @inheritdoc
	 */
	get_dimensions(buffer/*: Buffer */)/*: Dimensions */ {
		return {
			width: buffer.readUInt32BE(WIDTH_OFFSET),
			height: buffer.readUInt32BE(HEIGHT_OFFSET),
			frames: 1,
		};
	}

	/**
	 * @inheritdoc
	 */
	get_pixel_format(buffer/*: Buffer */)/*: PixelFormat */ {
		const format = new PixelFormat();
		const bit_depth = buffer.readInt8(BIT_DEPTH_OFFSET);
		const color_type = buffer.readInt8(COLOR_TYPE_OFFSET);

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
			format.color_space = ColorSpace.unkownFormat(color_type);
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
}
