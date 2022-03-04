/* @flow */
'use strict';

/*::
import type { Log } from './logger.js';
import type { FileDescriptor } from './finder.js';
import type { LinterOptions } from './linter.js';
import type { PixelFormat } from './pixel-format.js';

export
interface Dimensions {
	width: number;
	height: number;
	frames: number;
}

export interface ImageInfo {
	truncated: boolean;
	dimensions?: Dimensions;
	size?: number;
	pixel_format?: PixelFormat;
	bytes_per_pixel?: number;
}
*/

/**
 * Gather information about an image file.
 */
class InfoProvider {
	/**
	 * Calculate the number of bytes per pixel in the image.
	 *
	 * @param  {Dimensions} dims The dimensions of the image.
	 * @param  {number} size     The file size of the image.
	 * @return {number}          The number of bytes per pixel.
	 */
	calculate_bpp(dims/*: Dimensions */, size/*: number */)/*: number */ {
		return (size - this.get_overhead()) / (dims.width * dims.height * dims.frames);
	}

	/**
	 * Get the number of bytes of overhead of this file format.
	 *
	 * @return {number} The number in bytes.
	 */
	get_overhead()/*: number */ {
		return 0;
	}

	/**
	 * Get the dimensions of the image.
	 *
	 * @param  {Buffer} buffer The file buffer.
	 */
	get_dimensions(buffer/*: Buffer */)/*: Dimensions */ {
		throw new Error('Not Implemented');
	}

	/**
	 * Get the pixel format of the image.
	 * @param  {Buffer} buffer The file buffer.
	 */
	get_pixel_format(buffer/*: Buffer */)/*: PixelFormat */ {
		throw new Error('Not Implemented');
	}

	/**
	 * The the information for this file.
	 * @param  {Buffer} buffer The file buffer.
	 * @return {ImageInfo}     This image information.
	 */
	get_info(buffer/*: Buffer */)/*: ImageInfo */ {
		const info/*: ImageInfo */ = {
			'truncated': this.is_truncated(buffer),
		};

		if (!info.truncated) {
			const dims = this.get_dimensions(buffer);

			info.dimensions = dims;
			info.size = buffer.length;
			info.pixel_format = this.get_pixel_format(buffer);
			info.bytes_per_pixel = this.calculate_bpp(dims, buffer.length);
		}

		return info;
	}

	/**
	 * Is the file truncated.
	 *
	 * @param  {Buffer}    buffer A buffer containing a compressed image.
	 * @return {Boolean}   True if the file is invalid due to it being truncated.
	 */
	is_truncated(buffer/*: Buffer */)/*: boolean */ {
		throw new Error('Not Implemented');
	}
}

module.exports = InfoProvider;
