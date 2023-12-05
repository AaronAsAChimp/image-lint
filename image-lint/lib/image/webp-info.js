/* @flow */
'use strict';

/*::
import type {Dimensions} from '../image-info.js';
*/

import {InfoProvider} from '../image-info.js';
import {PixelFormat, ColorSpace} from '../pixel-format.js';
import {RIFFChunk} from './riff/chunk.js';
import {read_chunks} from './vp8/vp8.js';


/**
 * A AVIF info provider.
 */
export class WEBPInfoProvider extends InfoProvider {
	/**
	 * @inheritdoc
	 */
	get_overhead()/*: number */ {
		// This is the size of the smallest possible AVIF, I'm assuming it will
		// be mostly overhead.
		return 333;
	}

	/**
	 * @inheritdoc
	 */
	is_truncated(buffer/*: Buffer */)/*: boolean */ {
		// TODO: implement
		return false;
	}

	/**
	 * @inheritdoc
	 */
	get_dimensions(buffer/*: Buffer */)/*: Dimensions */ {
		const root = read_chunks(buffer, 0)[0];
		let dimensions_chunk;

		if (root instanceof RIFFChunk) {
			dimensions_chunk = root.subchunks.find((chunk) => chunk.header === 'VP8X' || chunk.header === 'VP8L');
		}

		return {
			width: dimensions_chunk.width,
			height: dimensions_chunk.height,
			frames: 1,
		};
	}

	/**
	 * @inheritdoc
	 */
	get_pixel_format(buffer/*: Buffer */)/*: PixelFormat */ {
		const format = new PixelFormat();
		format.color_space = ColorSpace.RGB;

		return format;
	}
}
